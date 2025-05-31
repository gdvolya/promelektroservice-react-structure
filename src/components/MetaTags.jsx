// src/components/MetaTags.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

const MetaTags = ({
  title,
  description,
  url = "https://promelektroservice.vercel.app",
  image = "/img/logo.png",
  type = "website",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default MetaTags;
