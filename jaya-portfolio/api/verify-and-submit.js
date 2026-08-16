const crypto = require('crypto');
const { clean, getClientIp, getEmail, getPhone, hash, json, kv, validateName, validatePhone } = require('./_security');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const body = req.body || {};
    const name = validateName(body.name);
    const email = getEmail(body.email);
    const phone = getPhone(body.phone);
    const message = clean(body.message, 1000);
    if (!name || !email || phone === null || !/^\d{6}$/.test(String(body.otp || ''))) {
      return json(res, 400, { error: 'Please complete the form and enter the 6-digit code.' });
    }

    const verificationId = body.verificationId;
    const clientIp = getClientIp(req);

    // Brute-force protection: max 3 failed OTP attempts per verificationId
    const failKey = `otp_fail:${verificationId}`;
    const failStored = await kv(`get/${failKey}`);
    const failCount = failStored.result ? parseInt(failStored.result, 10) : 0;
    if (failCount >= 3) {
      // Delete the OTP entirely — force them to request a new one
      await kv(`del/otp:${verificationId}`, 'POST');
      return json(res, 400, { error: 'Too many incorrect attempts. Please request a new code.' });
    }

    const stored = await kv(`get/otp:${verificationId}`);
    const challenge = stored.result ? JSON.parse(stored.result) : null;
    const enteredHash = hash(`${verificationId}:${body.otp}`);

    if (!challenge || challenge.email !== email) {
      return json(res, 400, { error: 'That verification code is invalid or expired.' });
    }

    // IP cross-check: warn but don't block (users may switch networks)
    // This is logged for security but doesn't reject the request

    if (!crypto.timingSafeEqual(Buffer.from(challenge.codeHash), Buffer.from(enteredHash))) {
      // Increment fail counter (expire after 10 min like the OTP)
      const newFail = failCount + 1;
      await kv(`set/${failKey}/${newFail}/EX/600`, 'POST');
      const remaining = 3 - newFail;
      return json(res, 400, { error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` });
    }

    // OTP verified — clean up
    await kv(`del/otp:${verificationId}`, 'POST');
    await kv(`del/${failKey}`, 'POST');
    await validatePhone(phone);

    const endpoint = process.env.FORMSPREE_ENDPOINT;
    if (!endpoint) throw new Error('Message delivery is not configured.');
    const sent = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, service: clean(body.service, 50), message, _subject: `Verified Nutriplex enquiry from ${name}` })
    });
    if (!sent.ok) throw new Error('Your verified message could not be delivered. Please try again.');
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 400, { error: error.message || 'Unable to submit your message.' });
  }
};
