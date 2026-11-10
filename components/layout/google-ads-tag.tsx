import Script from "next/script";

// Google tag container for the Google Ads mentoring campaign. Google Ads counts a
// booking when the `purchase` event fires on /mentoring/thank-you, and it can only
// tie that booking to an ad click if the tag also ran on the landing page
// (/mentoring). Keep it to those two pages: the container is ~150 KB of script.
export const GOOGLE_TAG_ID = "GTM-PZLSZJ2J";

const BOOTSTRAP =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());";

// Fires once per booking: cal.com forwards the booking `uid` in the redirect URL,
// and sessionStorage stops a reload from counting the same booking twice.
function purchaseScript(value: number) {
  return `(function(){var uid=new URLSearchParams(location.search).get('uid');var key=uid||'no-uid';try{if(sessionStorage.getItem('fc_booking')===key)return;sessionStorage.setItem('fc_booking',key);}catch(e){}gtag('event','purchase',{transaction_id:uid||'booking-'+Date.now(),value:${value},currency:'USD'});})();`;
}

interface GoogleAdsTagProps {
  /** Only true on the production deployment, so previews and CI never report conversions. */
  enabled?: boolean;
  /** Set on the thank-you page to report a booking worth this many USD. */
  purchaseValue?: number;
}

export function GoogleAdsTag({ enabled = false, purchaseValue }: GoogleAdsTagProps) {
  if (!enabled) return null;
  return (
    <>
      <Script id="google-tag-bootstrap" strategy="afterInteractive">
        {purchaseValue === undefined ? BOOTSTRAP : BOOTSTRAP + purchaseScript(purchaseValue)}
      </Script>
      <Script
        id="google-tag"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_ID}`}
      />
    </>
  );
}

export const googleAdsTagEnabled = () => process.env.VERCEL_ENV === "production";
