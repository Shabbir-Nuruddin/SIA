import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE = "https://makemerevise.com";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

export const SEO = ({ title, description, path, jsonLd, noindex }: SEOProps) => {
  const location = useLocation();
  const url = `${SITE}${path ?? location.pathname}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
};
