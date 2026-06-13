import { Helmet } from "react-helmet-async";
import { useSettings } from "../../store/settingsStore.js";

const SEO = ({ title, description, image }) => {
  const { settings } = useSettings();
  const siteName = settings?.siteName || "Handmate";
  const tagline = settings?.tagline || "Custom fashion for every woman";
  const defaultDescription =
    settings?.description ||
    "Premium custom-fit clothing for women. Dresses, tops, ethnic wear, and more. Free shipping available.";
  const defaultImage = settings?.logo?.url || "";

  const pageTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - ${tagline}`;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {pageImage && <meta property="og:image" content={pageImage} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {pageImage && <meta name="twitter:image" content={pageImage} />}
    </Helmet>
  );
};

export default SEO;
