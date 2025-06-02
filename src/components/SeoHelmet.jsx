import React from "react";
import { Helmet } from "react-helmet-async";

const SeoHelmet = ({
  title = "ПромЕлектроСервіс",
  description = "Професійні електромонтажні роботи будь-якої складності.",
  image = "/img/logo.png",
  url = "https://promelektroservice.vercel.app",
  type = "website",
  twitterCard = "summary_large_image",
  locale = "uk_UA",
  siteName = "ПромЕлектроСервіс",
  jsonLd = null,
  preloadImage = false, // ✅ контролируем preload вручную
}) => {
  const structuredData = jsonLd || {
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
    "telephone": "+380666229776"
  };

  return (
    <Helmet>
      {/* SEO title and description */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* ✅ Optional image preload only if explicitly requested */}
      {preloadImage && <link rel="preload" as="image" href={image} />}

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Helmet>
  );
};

export default SeoHelmet;
