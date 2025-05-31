import React from "react";
import { Helmet } from "react-helmet-async";

const SeoHelmet = ({
  title,
  description,
  image,
  url,
  type = "website",
  twitterCard = "summary_large_image",
  locale = "uk_UA",
  siteName = "ПромЕлектроСервіс",
  jsonLd = null,
}) => {
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteName,
    "url": url,
    "image": image,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Київ",
      "addressRegion": "Київська область",
      "postalCode": "01001",
      "streetAddress": "вул. Прикладна, 1"
    },
    "telephone": "+380666229776",
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="icon" href="/favicon.ico" />
      <link rel="preload" as="image" href={image} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SeoHelmet;
