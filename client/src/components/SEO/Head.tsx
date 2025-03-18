import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
  noIndex?: boolean;
}

export default function Head({
  title = 'Shivanshi Enterprises - Chemicals & Compounds Dealer',
  description = 'Shivanshi Enterprises - Your trusted partner for high-quality chemicals and compounds. We offer premium chemicals, compounds, and reliable solutions for all your chemical needs.',
  keywords = 'chemicals, compounds, chemical dealers, chemical suppliers, chemicals and compounds, Shivanshi Enterprises, chemical supplier india',
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = '/uploads/logo-1742233935605-1ec8d0e89d22.jpg',
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noIndex = false,
}: HeadProps) {
  const baseUrl = 'https://shivanshienterprises.in'; // Update this with your actual domain
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  const fullTwitterImage = twitterImage?.startsWith('http') ? twitterImage : twitterImage ? `${baseUrl}${twitterImage}` : fullOgImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Robots Meta Tag */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:type" content={ogType} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:site_name" content="Shivanshi Enterprises" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={fullTwitterImage} />
      
      {/* Additional SEO-Related Meta Tags */}
      <meta name="author" content="Shivanshi Enterprises" />
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Prayagraj" />
      <meta name="language" content="English" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
} 