# Nutriplex

The contact form uses reCAPTCHA v3, a 10-minute single-use email OTP, and a server-side Formspree submission. Set the variables in `.env.example` in Vercel before deploying. `RECAPTCHA_SECRET_KEY` must belong to the same reCAPTCHA v3 key pair used by `index.html`.

For phone validation, add Twilio Lookup credentials. Lookup confirms that the number is valid/reachable; only an SMS OTP can prove a visitor owns that number.

After Vercel gives the production URL, replace the `nutriplex.vercel.app` placeholder in `robots.txt`, `sitemap.xml`, and `RECAPTCHA_HOSTNAMES` if the actual Vercel subdomain is different. Submit that exact sitemap URL in Google Search Console.
