const crypto = require('crypto');
const { checkIpRateLimit, getClientIp, getEmail, json, kv, sendOtp, verifyRecaptcha } = require('./_security');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const email = getEmail(req.body?.email);
    if (!email) return json(res, 400, { error: 'Please use a valid permanent email address.' });
    if (req.body?._gotcha) return json(res, 200, { ok: true });

    // IP-based rate limiting: max 5 OTP requests per IP per hour
    const clientIp = getClientIp(req);
    await checkIpRateLimit(clientIp, 'otp_rate', 5, 3600);

    await verifyRecaptcha(req.body?.recaptchaToken, 'request_otp');
    const id = crypto.randomBytes(24).toString('hex');
    const code = String(crypto.randomInt(100000, 1000000));
    // Store OTP with originating IP for cross-check during verification
    await kv(`set/otp:${id}/${JSON.stringify({ email, codeHash: crypto.createHash('sha256').update(`${id}:${code}`).digest('hex'), ip: clientIp })}/EX/600`);
    await sendOtp(email, code);
    return json(res, 200, { ok: true, verificationId: id });
  } catch (error) {
    return json(res, 400, { error: error.message || 'Unable to send a verification code.' });
  }
};
