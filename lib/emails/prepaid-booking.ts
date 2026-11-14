// Email sent to prepaid mentoring package buyers (see app/api/stripe-webhook).
// Styled with the Frances Coronel Design System tokens from app/globals.css.
// Email clients ignore external stylesheets and CSS variables, so the token
// values are inlined here; keep them in sync with the @theme block.

export const BOOKING_URL = "https://cal.com/francescoronel/mentoring-hour-prepaid";

const SITE_URL = "https://francescoronel.com";

const color = {
  navy600: "#415c63",
  navy700: "#344a50",
  navy800: "#2b3e43",
  navy900: "#253137",
  horchata50: "#f9f5f3",
  horchata100: "#f0ebe9",
  horchata200: "#e8e1de",
  horchata400: "#dacec8",
  horchata700: "#9e2b25",
  accentLight: "#f0b0a8",
  white: "#ffffff",
};

// Latina Essential loads in clients that allow web fonts (Apple Mail, iOS Mail);
// the rest fall back to the system sans-serif
const FONT_STACK = `'Latina Essential', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(greeting: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Book your mentoring sessions</title>
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
        .rule { border-color: ${color.navy700} !important; }
      }
    </style>
  </head>
  <body class="bg" style="margin:0;padding:0;background-color:${color.horchata50};font-family:${FONT_STACK};color:${color.navy900};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your booking link for the mentoring sessions in your package.</div>
    <table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" style="background-color:${color.horchata50};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            <tr>
              <td class="card" style="padding:40px 32px;background-color:${color.white};border:1px solid ${color.horchata200};border-radius:16px;">
                <p class="label" style="margin:0;font-size:14px;line-height:20px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${color.horchata700};">Mentoring</p>
                <h1 class="heading" style="margin:4px 0 24px;font-size:30px;line-height:38px;font-weight:700;color:${color.navy900};">Book your sessions 🗓️</h1>
                <p class="body" style="margin:0 0 16px;font-size:18px;line-height:28px;color:${color.navy900};">${greeting}</p>
                <p class="body" style="margin:0 0 16px;font-size:18px;line-height:28px;color:${color.navy900};">Thanks for booking a mentoring package! 🎉</p>
                <p class="body" style="margin:0 0 28px;font-size:18px;line-height:28px;color:${color.navy900};">You can schedule your sessions whenever you're ready.</p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:12px;background-color:${color.horchata700};">
                      <a href="${BOOKING_URL}" style="display:inline-block;padding:14px 28px;font-family:${FONT_STACK};font-size:18px;line-height:24px;font-weight:700;color:${color.white};text-decoration:none;border-radius:12px;">Schedule a session</a>
                    </td>
                  </tr>
                </table>
                <p class="muted" style="margin:28px 0 0;font-size:16px;line-height:24px;color:${color.navy600};">Keep this email handy, since the same link works for every session in your package:</p>
                <p style="margin:4px 0 0;font-size:16px;line-height:24px;"><a class="link" href="${BOOKING_URL}" style="color:${color.horchata700};word-break:break-all;">${BOOKING_URL}</a></p>
                <hr class="rule" style="margin:32px 0;border:0;border-top:1px solid ${color.horchata200};" />
                <p class="body" style="margin:0 0 16px;font-size:18px;line-height:28px;color:${color.navy900};">Reply here if you have any questions. Excited to chat soon!</p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:12px;">
                      <img src="${SITE_URL}/images/static/headshot-email.jpg" alt="" width="48" height="48" style="display:block;width:48px;height:48px;border-radius:24px;object-fit:cover;" />
                    </td>
                    <td>
                      <p class="heading" style="margin:0;font-size:18px;line-height:24px;font-weight:700;color:${color.navy900};">Frances Coronel</p>
                      <p style="margin:0;font-size:16px;line-height:22px;"><a class="link" href="${SITE_URL}/mentoring" style="color:${color.horchata700};">francescoronel.com/mentoring</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 16px 0;">
                <p class="muted" style="margin:0;font-size:14px;line-height:20px;color:${color.navy600};">You're getting this because you bought a mentoring package from Frances Coronel.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Subject, plain text and HTML for the prepaid package booking email. */
export function prepaidBookingEmail(name: string | null | undefined) {
  const firstName = name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const text = [
    greeting,
    "Thanks for booking a mentoring package! 🎉",
    "You can schedule your sessions whenever you're ready using this link:",
    BOOKING_URL,
    "Keep this email handy, since the same link works for every session in your package.",
    "Reply here if you have any questions. Excited to chat soon!",
    "Frances",
  ].join("\n\n");

  return {
    subject: "Book your mentoring sessions 🗓️",
    text,
    html: buildHtml(escapeHtml(greeting)),
  };
}
