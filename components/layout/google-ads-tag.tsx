import Script from "next/script";

// Google tag container for the Google Ads mentoring campaign. Google Ads counts a
// booking when the `purchase` event fires on /mentoring/thank-you, and it can only
// tie that booking to an ad click if the tag also ran on the landing page
// (/mentoring). Keep it to those two pages: the container is ~150 KB of script.
export const GOOGLE_TAG_ID = "GTM-PZLSZJ2J";

const BOOTSTRAP =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());";

// cal.com forwards booking details in the redirect URL, including the attendee's
// email and phone number. This runs inline while the page is parsed, before any
// analytics script, keeps the two values the purchase event needs and then removes
// the query string so nothing personal reaches Google, Vercel Analytics or Sentry.
export const BOOKING_PARAMS_SCRUB =
  "(function(){try{var q=new URLSearchParams(location.search),s=Date.parse(q.get('startTime')),e=Date.parse(q.get('endTime'));window.__fcBooking={uid:q.get('uid'),minutes:(e-s)/60000||null};if(location.search)history.replaceState(history.state,'',location.pathname);}catch(e){}})();";

export function BookingParamsScrub() {
  return <script dangerouslySetInnerHTML={{ __html: BOOKING_PARAMS_SCRUB }} />;
}

// Fires once per booking: the booking `uid` is the transaction ID, and sessionStorage
// stops a reload from counting the same booking twice. A session of an hour or more
// is reported at the hourly price.
function purchaseScript({ halfHour, hour }: BookingPrices) {
  return `(function(){var b=window.__fcBooking||{},uid=b.uid,key=uid||'no-uid';try{if(sessionStorage.getItem('fc_booking')===key)return;sessionStorage.setItem('fc_booking',key);}catch(e){}gtag('event','purchase',{transaction_id:uid||'booking-'+Date.now(),value:b.minutes>=60?${hour}:${halfHour},currency:'USD'});})();`;
}

interface BookingPrices {
  halfHour: number;
  hour: number;
}

interface GoogleAdsTagProps {
  /** Only true on the production deployment, so previews and CI never report conversions. */
  enabled?: boolean;
  /** Set on the thank-you page to report a booking, with the session prices in USD. */
  purchase?: BookingPrices;
}

export function GoogleAdsTag({ enabled = false, purchase }: GoogleAdsTagProps) {
  if (!enabled) return null;
  return (
    <>
      <Script id="google-tag-bootstrap" strategy="afterInteractive">
        {purchase ? BOOTSTRAP + purchaseScript(purchase) : BOOTSTRAP}
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
