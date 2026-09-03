// SEO optimization utilities

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  og?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    creator?: string;
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(type: string, data: Record<string, any>) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
}

/**
 * Generate meta tags
 */
export function generateMetaTags(metadata: SEOMetadata): string[] {
  const tags: string[] = [
    `<meta name="description" content="${metadata.description}" />`,
    `<meta name="keywords" content="${metadata.keywords.join(", ")}" />`,
  ];

  if (metadata.og) {
    if (metadata.og.title) tags.push(`<meta property="og:title" content="${metadata.og.title}" />`);
    if (metadata.og.description) tags.push(`<meta property="og:description" content="${metadata.og.description}" />`);
    if (metadata.og.image) tags.push(`<meta property="og:image" content="${metadata.og.image}" />`);
    if (metadata.og.url) tags.push(`<meta property="og:url" content="${metadata.og.url}" />`);
  }

  if (metadata.twitter) {
    if (metadata.twitter.card) tags.push(`<meta name="twitter:card" content="${metadata.twitter.card}" />`);
    if (metadata.twitter.creator) tags.push(`<meta name="twitter:creator" content="${metadata.twitter.creator}" />`);
  }

  return tags;
}

/**
 * Sitemap generation
 */
export function generateSitemap(
  urls: Array<{ loc: string; lastmod?: string; priority?: number }>
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ""}
${url.priority ? `    <priority>${url.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;
  return xml;
}
