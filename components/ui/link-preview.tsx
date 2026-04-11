interface OgData {
  title: string;
  description: string;
  image: string | null;
  siteName: string;
}

function decodeHtmlEntities(str: string): string {
  // Decode &amp; last — it is the escape character itself, so decoding it
  // first would cause double-unescaping of sequences like &amp;lt; → &lt; → <
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

async function fetchOgData(url: string): Promise<OgData | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; francescoronel.com link preview)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: false },
    });

    if (!res.ok) return null;

    const html = await res.text();

    function getMeta(attr: string, value: string): string | null {
      const a = new RegExp(
        `<meta[^>]+${attr}=["']${value}["'][^>]+content=["']([^"']+)["']`,
        "i"
      );
      const b = new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${value}["']`,
        "i"
      );
      return (html.match(a) ?? html.match(b))?.[1] ?? null;
    }

    const title =
      getMeta("property", "og:title") ??
      getMeta("name", "twitter:title") ??
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ??
      "";

    if (!title) return null;

    return {
      title: decodeHtmlEntities(title),
      description: decodeHtmlEntities(
        getMeta("property", "og:description") ??
          getMeta("name", "twitter:description") ??
          getMeta("name", "description") ??
          ""
      ),
      image: getMeta("property", "og:image") ?? getMeta("name", "twitter:image"),
      siteName: decodeHtmlEntities(
        getMeta("property", "og:site_name") ??
          new URL(url).hostname.replace(/^www\./, "")
      ),
    };
  } catch {
    return null;
  }
}

export async function LinkPreview({ url }: { url: string }) {
  const og = await fetchOgData(url);
  const hostname = new URL(url).hostname.replace(/^www\./, "");

  const linkClass =
    "text-horchata-800 underline decoration-horchata-300 underline-offset-2 transition-colors hover:text-horchata-700 dark:text-horchata-400 dark:hover:text-horchata-200";

  if (!og) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {url}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full max-w-xl overflow-hidden rounded-xl border border-horchata-200 bg-white no-underline transition-shadow hover:shadow-md dark:border-navy-700 dark:bg-navy-800"
    >
      {og.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={og.image}
          alt=""
          className="w-32 shrink-0 object-cover sm:w-40"
        />
      )}
      <div className="flex min-w-0 flex-col justify-center gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-horchata-600 dark:text-horchata-500">
          {og.siteName}
        </span>
        <p className="truncate text-sm font-semibold text-navy-900 dark:text-horchata-100">
          {og.title}
        </p>
        {og.description && (
          <p className="line-clamp-2 text-xs text-navy-600 dark:text-navy-300">
            {og.description}
          </p>
        )}
        <span className="mt-1 truncate text-xs text-navy-400 dark:text-navy-500">
          {hostname}
        </span>
      </div>
    </a>
  );
}
