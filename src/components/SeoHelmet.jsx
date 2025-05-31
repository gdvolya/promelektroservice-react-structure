import React from "react";
import { Helmet } from "react-helmet-async";

const SeoHelmet = ({ title, description, image, url, type = "website" }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={type} />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preload" as="image" href={image} />
  </Helmet>
);

export default SeoHelmet;
