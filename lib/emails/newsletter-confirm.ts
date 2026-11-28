// Double opt-in email sent by POST /api/newsletter (see app/api/newsletter).
// Same inline-style approach as prepaid-booking.ts and scripts/newsletter-broadcast.js:
// email clients ignore external stylesheets and CSS variables, so the design
// system token values from app/globals.css are inlined here.

const SITE_URL = "https://francescoronel.com";

const color = {
  navy600: "#415c63",
  navy700: "#344a50",
  navy800: "#2b3e43",
  navy900: "#253137",
  navy950: "#182126",
  horchata50: "#f9f5f3",
  horchata100: "#f0ebe9",
  horchata200: "#e8e1de",
  horchata400: "#dacec8",
  horchata600: "#ca2e55",
  horchata700: "#9e2b25",
  accentLight: "#e7a7b7",
  white: "#ffffff",
};

const FONT_STACK = `'Latina Essential', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(confirmUrl: string): string {
  const url = escapeHtml(confirmUrl);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Confirm your subscription</title>
    <style>
      @font-face {
        font-family: 'Latina Essential';
        font-weight: 400;
        src: url('${SITE_URL}/fonts/latina-essential-medium.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Latina Essential';
        font-weight: 700;
        src: url('${SITE_URL}/fonts/latina-essential-bold.woff2') format('woff2');
      }
      @media (prefers-color-scheme: dark) {
        .bg { background-color: ${color.navy900} !important; }
        .card { background-color: ${color.navy800} !important; border-color: ${color.navy700} !important; }
        .label { color: ${color.accentLight} !important; }
        .heading, .body { color: ${color.horchata100} !important; }
        .muted { color: ${color.horchata400} !important; }
        .link { color: ${color.horchata400} !important; }
        .cta { background-color: ${color.accentLight} !important; }
        .cta-link { color: ${color.navy950} !important; }
      }
    </style>
  </head>
  <body class="bg" style="margin:0;padding:0;background-color:${color.horchata50};font-family:${FONT_STACK};color:${color.navy900};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">One click to confirm your subscription to Frances Coronel's newsletter.</div>
    <table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" style="background-color:${color.horchata50};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            <tr>
              <td class="card" style="padding:40px 32px;background-color:${color.white};border:1px solid ${color.horchata200};border-radius:16px;">
                <p class="label" style="margin:0;font-size:14px;line-height:20px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${color.horchata700};">Newsletter</p>
                <h1 class="heading" style="margin:4px 0 24px;font-size:30px;line-height:38px;font-weight:700;color:${color.navy900};">Confirm your subscription 📬</h1>
                <p class="body" style="margin:0 0 28px;font-size:18px;line-height:28px;color:${color.navy900};">Thanks for signing up! Click the button below to confirm your email and start getting new posts in your inbox.</p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="cta" style="border-radius:12px;background-color:${color.horchata600};">
                      <a class="cta-link" href="${url}" style="display:inline-block;padding:14px 28px;font-family:${FONT_STACK};font-size:18px;line-height:24px;font-weight:700;color:${color.white};text-decoration:none;border-radius:12px;">Confirm subscription</a>
                    </td>
                  </tr>
                </table>
                <p class="muted" style="margin:28px 0 0;font-size:16px;line-height:24px;color:${color.navy600};">Button not working? Paste this link into your browser. It works for 7 days.</p>
                <p style="margin:4px 0 0;font-size:16px;line-height:24px;"><a class="link" href="${url}" style="color:${color.horchata600};word-break:break-all;">${url}</a></p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 16px 0;">
                <p class="muted" style="margin:0;font-size:14px;line-height:20px;color:${color.navy600};">Didn't sign up at francescoronel.com? Ignore this email and you won't be subscribed.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Subject, plain text and HTML for the newsletter confirmation email. */
export function newsletterConfirmEmail(confirmUrl: string) {
  const text = [
    "Thanks for signing up for Frances Coronel's newsletter!",
    "Confirm your email to start getting new posts in your inbox:",
    confirmUrl,
    "The link works for 7 days. Didn't sign up at francescoronel.com? Ignore this email and you won't be subscribed.",
  ].join("\n\n");

  return {
    subject: "Confirm your subscription 📬",
    text,
    html: buildHtml(confirmUrl),
  };
}
