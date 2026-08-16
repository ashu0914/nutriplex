const crypto = require('crypto');

// 200+ most common disposable/temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '20minutemail.com', '33mail.com', 'adf.ly', 'ag.us.to',
  'amilegit.com', 'anonbox.net', 'anonymbox.com', 'antispam.de', 'armyspy.com',
  'binkmail.com', 'bio-muesli.net', 'bobmail.info', 'bodhi.lawlita.com', 'bofthew.com',
  'brefmail.com', 'brennendesreich.de', 'broadbandninja.com', 'bsnow.net', 'buffemail.com',
  'bugmenot.com', 'bumpymail.com', 'bund.us', 'bundes-ede.de', 'burnthespam.info',
  'burnermail.io', 'buyusedlibrarybooks.org', 'byom.de', 'cash4u.com', 'casualdx.com',
  'centermail.com', 'centermail.net', 'chammy.info', 'cheatmail.de', 'chogmail.com',
  'choicemail1.com', 'clixser.com', 'cmail.net', 'cmail.org', 'coldemail.info',
  'cool.fr.nf', 'correo.blogos.net', 'cosmorph.com', 'courriel.fr.nf', 'crap.kakadua.net',
  'crapmail.org', 'cubiclink.com', 'curryworld.de', 'cust.in', 'cuvox.de',
  'dacoolest.com', 'dandikmail.com', 'dayrep.com', 'dcemail.com', 'deadaddress.com',
  'deadspam.com', 'despam.it', 'despammed.com', 'devnullmail.com', 'dfgh.net',
  'digitalsanctuary.com', 'dingbone.com', 'discard.email', 'discardmail.com', 'discardmail.de',
  'disposable.com', 'disposableaddress.com', 'disposableemailaddresses.emailmiser.com',
  'disposableinbox.com', 'dispose.it', 'dispostable.com', 'dm.w3internet.co.uk',
  'dodgeit.com', 'dodgit.com', 'donemail.ru', 'dontreg.com', 'dontsendmespam.de',
  'drdrb.net', 'dump-email.info', 'dumpanyjunk.com', 'dumpyemail.com', 'e4ward.com',
  'easytrashmail.com', 'einmalmail.de', 'einrot.com', 'eintagsmail.de', 'emailgo.de',
  'emailias.com', 'emailigo.de', 'emailinfive.com', 'emaillime.com', 'emailmiser.com',
  'emailproxsy.com', 'emailsensei.com', 'emailtemporario.com.br', 'emailwarden.com',
  'emailx.at.hm', 'emailxfer.com', 'emz.net', 'enterto.com', 'ephemail.net',
  'etranquil.com', 'etranquil.net', 'etranquil.org', 'evopo.com', 'explodemail.com',
  'express.net.ua', 'eyepaste.com', 'fakeinbox.com', 'fakeinformation.com', 'fansworldwide.de',
  'fastacura.com', 'fastchevy.com', 'fastchrysler.com', 'fastkawasaki.com', 'fastmazda.com',
  'fastnissan.com', 'fastsubaru.com', 'fastsuzuki.com', 'fasttoyota.com', 'fastyamaha.com',
  'filzmail.com', 'fixmail.tk', 'fizmail.com', 'fleckens.hu', 'fr33mail.info',
  'frapmail.com', 'front14.org', 'fux0ringduh.com', 'garliclife.com', 'get1mail.com',
  'get2mail.fr', 'getairmail.com', 'getmails.eu', 'getonemail.com', 'getonemail.net',
  'ghosttexter.de', 'girlsundertheinfluence.com', 'gishpuppy.com', 'goemailgo.com',
  'gorillaswithdirtyarmpits.com', 'gotmail.net', 'gotmail.org', 'gotti.otherinbox.com',
  'great-host.in', 'greensloth.com', 'grr.la', 'gsrv.co.uk', 'guerillamail.biz',
  'guerillamail.com', 'guerillamail.de', 'guerillamail.info', 'guerillamail.net',
  'guerillamail.org', 'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de',
  'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
  'gustr.com', 'h8s.org', 'haltospam.com', 'harakirimail.com', 'hartbot.de',
  'hatespam.org', 'herp.in', 'hidemail.de', 'hidzz.com', 'hmamail.com',
  'hopemail.biz', 'hotpop.com', 'hulapla.de', 'ieatspam.eu', 'ieatspam.info',
  'imails.info', 'inbax.tk', 'inbox.si', 'inboxalias.com', 'inboxclean.com',
  'inboxclean.org', 'incognitomail.com', 'incognitomail.net', 'incognitomail.org',
  'insorg-mail.info', 'ipoo.org', 'irish2me.com', 'iwi.net', 'jetable.com',
  'jetable.fr.nf', 'jetable.net', 'jetable.org', 'jnxjn.com', 'jobbikszyer.hu',
  'jourrapide.com', 'junk1e.com', 'kasmail.com', 'kaspop.com', 'keepmymail.com',
  'killmail.com', 'killmail.net', 'kir.ch.tc', 'klassmaster.com', 'klassmaster.net',
  'klzlk.com', 'koszmail.pl', 'kurzepost.de', 'lawlita.com', 'letthemeatspam.com',
  'lhsdv.com', 'lifebyfood.com', 'link2mail.net', 'litedrop.com', 'lol.ovpn.to',
  'lookugly.com', 'lopl.co.cc', 'lortemail.dk', 'lr78.com', 'lroid.com',
  'lukop.dk', 'm21.cc', 'mail-temporaire.fr', 'mail.by', 'mail.mezimages.net',
  'mail.zp.ua', 'mail1a.de', 'mail21.cc', 'mail2rss.org', 'mail333.com',
  'mailbidon.com', 'mailbiz.biz', 'mailblocks.com', 'mailbucket.org', 'mailcat.biz',
  'mailcatch.com', 'mailde.de', 'mailde.info', 'maildrop.cc', 'maildx.com',
  'maileater.com', 'mailexpire.com', 'mailfa.tk', 'mailforspam.com', 'mailfreeonline.com',
  'mailguard.me', 'mailin8r.com', 'mailinater.com', 'mailinator.com', 'mailinator.net',
  'mailinator2.com', 'mailincubator.com', 'mailismagic.com', 'mailmate.com', 'mailme.ir',
  'mailme.lv', 'mailmetrash.com', 'mailmoat.com', 'mailms.com', 'mailnator.com',
  'mailnesia.com', 'mailnull.com', 'mailorg.org', 'mailpick.biz', 'mailrock.biz',
  'mailscrap.com', 'mailshell.com', 'mailsiphon.com', 'mailslite.com', 'mailtemp.info',
  'mailtome.de', 'mailtothis.com', 'mailtrash.net', 'mailtv.net', 'mailtv.tv',
  'mailzilla.com', 'mailzilla.org', 'makemetheking.com', 'manifestgenerator.com',
  'manybrain.com', 'mbx.cc', 'mega.zik.dj', 'meinspamschutz.de', 'meltmail.com',
  'messagebeamer.de', 'mezimages.net', 'ministry-of-silly-walks.de', 'mintemail.com',
  'misterpinball.de', 'mohmal.com', 'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
  'monumentmail.com', 'mt2015.com', 'mx0.wwwnew.eu', 'my10minutemail.com', 'myalias.pw',
  'mycard.net.ua', 'mycleaninbox.net', 'myemailboxy.com', 'mymail-in.net', 'mypacks.net',
  'mypartyclip.de', 'myphantom.com', 'mysamp.de', 'myspaceinc.com', 'myspaceinc.net',
  'myspaceinc.org', 'myspacepimpedup.com', 'mytemp.email', 'mytempmail.com', 'mytrashmail.com',
  'nabala.com', 'neomailbox.com', 'nepwk.com', 'nervmich.net', 'nervtansen.de',
  'netmails.com', 'netmails.net', 'neverbox.com', 'no-spam.ws', 'nobulk.com',
  'noclickemail.com', 'nogmailspam.info', 'nomail.xl.cx', 'nomail2me.com', 'nomorespamemails.com',
  'nospam.ze.tc', 'nospam4.us', 'nospamfor.us', 'nospammail.net', 'nothingtoseehere.ca',
  'nowmymail.com', 'nurfuerspam.de', 'nus.edu.sg', 'nwldx.com', 'objectmail.com',
  'obobbo.com', 'odnorazovoe.ru', 'oneoffemail.com', 'onewaymail.com', 'oopi.org',
  'ordinaryamerican.net', 'otherinbox.com', 'ourklips.com', 'outlawspam.com', 'ovpn.to',
  'owlpic.com', 'pancakemail.com', 'pimpedupmyspace.com', 'pjjkp.com', 'plexolan.de',
  'pookmail.com', 'privacy.net', 'proxymail.eu', 'prtnx.com', 'putthisinyouremail.com',
  'qq.com', 'quickinbox.com', 'rcpt.at', 'reallymymail.com', 'recode.me',
  'recursor.net', 'reliable-mail.com', 'rhyta.com', 'rklips.com', 'rmqkr.net',
  'royal.net', 'rppkn.com', 'rtrtr.com', 's0ny.net', 'safe-mail.net',
  'safersignup.de', 'safetymail.info', 'safetypost.de', 'sandelf.de', 'saynotospams.com',
  'scatmail.com', 'schafmail.de', 'selfdestructingmail.com', 'sendspamhere.com', 'sharklasers.com',
  'shieldedmail.com', 'shiftmail.com', 'shitmail.me', 'shortmail.net', 'sibmail.com',
  'skeefmail.com', 'slaskpost.se', 'slipry.net', 'slopsbox.com', 'slowslow.de',
  'slutty.horse', 'smashmail.de', 'smellfear.com', 'snakemail.com', 'sneakemail.com',
  'sneakmail.de', 'snkmail.com', 'sofimail.com', 'sofort-mail.de', 'softpls.asia',
  'sogetthis.com', 'soodonims.com', 'spam.la', 'spam.su', 'spam4.me',
  'spamavert.com', 'spambob.com', 'spambob.net', 'spambob.org', 'spambog.com',
  'spambog.de', 'spambog.ru', 'spambox.us', 'spamcannon.com', 'spamcannon.net',
  'spamcero.com', 'spamcorptastic.com', 'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org',
  'spamday.com', 'spamex.com', 'spamfighter.cf', 'spamfighter.ga', 'spamfighter.gq',
  'spamfighter.ml', 'spamfighter.tk', 'spamfree24.com', 'spamfree24.de', 'spamfree24.eu',
  'spamfree24.info', 'spamfree24.net', 'spamfree24.org', 'spamgourmet.com', 'spamgourmet.net',
  'spamgourmet.org', 'spamhereplease.com', 'spamhole.com', 'spamify.com', 'spaminator.de',
  'spamkill.info', 'spaml.com', 'spaml.de', 'spammotel.com', 'spamobox.com',
  'spamoff.de', 'spamslicer.com', 'spamspot.com', 'spamstack.net', 'spamthis.co.uk',
  'spamtrail.com', 'spamtrap.ro', 'speed.1s.fr', 'spoofmail.de', 'stuffmail.de',
  'supergreatmail.com', 'supermailer.jp', 'superrito.com', 'superstachel.de', 'suremail.info',
  'svk.jp', 'sweetxxx.de', 'tafmail.com', 'tagyoureit.com', 'talkinator.com',
  'tapchicuoihoi.com', 'teewars.org', 'teleworm.com', 'teleworm.us', 'temp-mail.org',
  'temp-mail.ru', 'tempail.com', 'tempalias.com', 'tempe4mail.com', 'tempemail.biz',
  'tempemail.co.za', 'tempemail.com', 'tempemail.net', 'tempinbox.com', 'tempinbox.co.uk',
  'tempmail.com', 'tempmail.eu', 'tempmail.it', 'tempmail2.com', 'tempmaildemo.com',
  'tempmailer.com', 'tempmailer.de', 'tempm.com', 'tempomail.fr', 'temporarily.de',
  'temporarioemail.com.br', 'temporaryemail.net', 'temporaryforwarding.com', 'temporaryinbox.com',
  'temporarymailaddress.com', 'tempthe.net', 'thankdog.com', 'thankyou2010.com',
  'thc.st', 'thetempmail.com', 'throwawayemailaddress.com', 'throwawaymail.com',
  'tittbit.in', 'tizi.com', 'tmailinator.com', 'toiea.com', 'toomail.biz',
  'topranklist.de', 'tradermail.info', 'trash-amil.com', 'trash-mail.at', 'trash-mail.com',
  'trash-mail.de', 'trash2009.com', 'trashdevil.com', 'trashemail.de', 'trashmail.at',
  'trashmail.com', 'trashmail.de', 'trashmail.me', 'trashmail.net', 'trashmail.org',
  'trashmail.ws', 'trashmailer.com', 'trashymail.com', 'trashymail.net', 'trialmail.de',
  'trickmail.net', 'trillianpro.com', 'turual.com', 'twinmail.de', 'tyldd.com',
  'uggsrock.com', 'umail.net', 'upliftnow.com', 'uplipht.com', 'venompen.com',
  'veryreallyelevator.com', 'viditag.com', 'viewcastmedia.com', 'viewcastmedia.net',
  'viewcastmedia.org', 'vomoto.com', 'vpn.st', 'vsimcard.com', 'vubby.com',
  'wasteland.rfc822.org', 'webemail.me', 'weg-werf-email.de', 'wegwerfadresse.de',
  'wegwerfemail.com', 'wegwerfemail.de', 'wegwerfmail.de', 'wegwerfmail.info', 'wegwerfmail.net',
  'wegwerfmail.org', 'wh4f.org', 'whatiaas.com', 'whatpaas.com', 'whyspam.me',
  'wikidocuslice.com', 'willhackforfood.biz', 'willselfdestruct.com', 'winemaven.info',
  'wronghead.com', 'wuzup.net', 'wuzupmail.net', 'wwwnew.eu', 'x.ip6.li',
  'xagloo.com', 'xemaps.com', 'xents.com', 'xjoi.com', 'xmaily.com',
  'xoxy.net', 'yapped.net', 'yeah.net', 'yep.it', 'yogamaven.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.gq', 'yopmail.net', 'yourdomain.com',
  'ypmail.webarnak.fr.eu.org', 'yuurok.com', 'zehnminutenmail.de', 'zippymail.info',
  'zoaxe.com', 'zoemail.org'
]);

const json = (res, status, body) => res.status(status).json(body);
const clean = (value, max) => String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

function getEmail(value) {
  const email = clean(value, 254).toLowerCase();
  const match = /^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+)$/i.exec(email);
  if (!match || DISPOSABLE_DOMAINS.has(match[2])) return null;
  return email;
}

function getPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  // Normalize to E.164
  let normalized = '';
  if (/^[6-9]\d{9}$/.test(digits)) normalized = `+91${digits}`;
  else if (/^91[6-9]\d{9}$/.test(digits)) normalized = `+${digits}`;
  else if (/^[1-9]\d{7,14}$/.test(digits)) normalized = `+${digits}`;
  else return null;

  // Fake phone detection: reject obviously fake patterns
  const core = normalized.replace(/^\+91/, '').replace(/^\+/, '');
  // All same digits (e.g., 0000000000, 9999999999)
  if (/^(\d)\1+$/.test(core)) return null;
  // Sequential ascending (1234567890)
  if (core === '1234567890' || core === '0123456789') return null;
  // Sequential descending (9876543210)
  if (core === '9876543210' || core === '0987654321') return null;
  // Repeated patterns (e.g., 1212121212, 123123123)
  if (/^(\d{1,3})\1{3,}$/.test(core)) return null;

  return normalized;
}

function validateName(value) {
  const name = clean(value, 100);
  if (!name || name.length < 2) return null;
  // Reject all-same-character names (e.g., "aaa", "bbb")
  if (/^(.)\1+$/i.test(name.replace(/\s/g, ''))) return null;
  // Reject obvious test/fake names
  const lower = name.toLowerCase().replace(/\s/g, '');
  const fakeNames = ['test', 'testing', 'asdf', 'qwerty', 'asd', 'abc', 'xyz', 'xxx', 'zzz', 'none', 'null', 'undefined', 'na', 'n/a', 'nil', 'fake', 'anonymous'];
  if (fakeNames.includes(lower)) return null;
  // Must contain at least one letter
  if (!/[a-zA-Z\u0900-\u097F]/.test(name)) return null;
  return name;
}

async function verifyRecaptcha(token, action) {
  if (!process.env.RECAPTCHA_SECRET_KEY) throw new Error('Server security is not configured.');
  const result = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: token || '' })
  }).then((response) => response.json());
  const allowedHostnames = (process.env.RECAPTCHA_HOSTNAMES || '').split(',').map((host) => host.trim()).filter(Boolean);
  if (!result.success || result.action !== action || Number(result.score) < 0.5 || (allowedHostnames.length && !allowedHostnames.includes(result.hostname))) {
    throw new Error('Security check failed. Please try again.');
  }
}

async function kv(path, method = 'GET') {
  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!base || !token) throw new Error('Server security is not configured.');
  const response = await fetch(`${base}/${path}`, { method, headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error('Temporary security service error.');
  return response.json();
}

async function sendOtp(email, code) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!process.env.RESEND_API_KEY || !from) throw new Error('Email verification is not configured.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [email], subject: 'Your Nutriplex verification code', text: `Your Nutriplex verification code is ${code}. It expires in 10 minutes. Do not share this code.` })
  });
  if (!response.ok) throw new Error('We could not send the verification code.');
}

async function validatePhone(phone) {
  if (!phone || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return;
  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const url = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phone)}?Fields=line_type_intelligence`;
  const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!response.ok) throw new Error('Please enter a real, reachable phone number.');
  const result = await response.json();
  if (!result.valid) throw new Error('Please enter a real, reachable phone number.');
}

// IP-based rate limiting helper
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

async function checkIpRateLimit(ip, prefix, maxRequests, windowSeconds) {
  const key = `${prefix}:${hash(ip)}`;
  const stored = await kv(`get/${key}`);
  const count = stored.result ? parseInt(stored.result, 10) : 0;
  if (count >= maxRequests) {
    throw new Error('Too many attempts from your network. Please try again later.');
  }
  // Increment counter with TTL
  if (count === 0) {
    await kv(`set/${key}/${count + 1}/EX/${windowSeconds}`, 'POST');
  } else {
    // Use INCR-like behavior: set the incremented value with remaining TTL
    const ttl = await kv(`ttl/${key}`);
    const remainingTtl = (ttl.result && ttl.result > 0) ? ttl.result : windowSeconds;
    await kv(`set/${key}/${count + 1}/EX/${remainingTtl}`, 'POST');
  }
}

module.exports = { clean, checkIpRateLimit, getClientIp, getEmail, getPhone, hash, json, kv, sendOtp, validateName, validatePhone, verifyRecaptcha };
