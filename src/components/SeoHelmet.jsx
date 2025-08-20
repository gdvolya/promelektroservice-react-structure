import React from "react";
import { Helmet } from "react-helmet-async";

const SeoHelmet = ({
  title = "ПромЕлектроСервіс",
  description = "Професійні електромонтажні роботи будь-якої складності.",
  image = "/img/logo.webp",
  url = "https://promelektroservice-react-structure.vercel.app/",
  type = "website",
  twitterCard = "summary_large_image",
  locale = "uk_UA",
  siteName = "ПромЕлектроСервіс",
  keywords = "електромонтаж, Київ, ПромЕлектроСервіс, електрика, освітлення, щити",
  jsonLd = null,
  preloadImage = false,
}) => {
  const structuredData = jsonLd || {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    url: url,
    image: image,
    description: description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Київ",
      addressRegion: "Київська область",
      postalCode: "01001",
      streetAddress: "вул. Прикладна, 1",
    },
    telephone: "+380666229776",
    priceRange: "$$",
    geo: {
      "@type": "GeoCoordinates",
      latitude: "50.4501",
      longitude: "30.5234",
    },
  };

  const image2x = image.endsWith(".webp")
    ? image.replace(".webp", "@2x.webp")
    : image;

  return (
    <Helmet>
      {/* SEO basics */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#007bff" />

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

      {/* Optional LCP image preload */}
      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={image}
          imagesrcset={`${image} 1x, ${image2x} 2x`}
          imagesizes="100vw"
          {...(image.endsWith(".webp") ? { type: "image/webp" } : {})}
        />
      )}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Helmet>
  );
};

export default SeoHelmet;
