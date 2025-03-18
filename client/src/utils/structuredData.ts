/**
 * Creates structured data for the Organization
 */
export function createOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shivanshi Enterprises",
    "description": "Your trusted partner for high-quality chemicals and compounds. We offer premium chemicals, compounds, and reliable solutions for all your chemical needs.",
    "url": "https://shivanshienterprises.in",
    "logo": "https://shivanshienterprises.in/uploads/logo-1742233935605-1ec8d0e89d22.jpg",
    "sameAs": [
      "https://www.facebook.com/shivanshienterprises",
      "https://www.linkedin.com/company/shivanshi-enterprises"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "55 2B 9 SANGAM ROAD NAINI INDUSTRIAL AREA",
      "addressLocality": "PRAYAGRAJ",
      "addressRegion": "UTTAR PRADESH",
      "postalCode": "211008",
      "addressCountry": "INDIA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 1234567890",
      "contactType": "customer service",
      "email": "shivanshienterprises44@gmail.com"
    }
  };
}

/**
 * Creates structured data for a Product
 */
export function createProductStructuredData(product: {
  name: string;
  description: string;
  image?: string;
  sku?: string;
  brand?: string;
  category?: string;
  price?: string;
  availability?: "InStock" | "OutOfStock" | "LimitedAvailability";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image || "https://shivanshienterprises.in/uploads/logo-1742233935605-1ec8d0e89d22.jpg",
    "sku": product.sku || "",
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Shivanshi Enterprises"
    },
    "category": product.category || "Chemicals",
    "offers": {
      "@type": "Offer",
      "url": `https://shivanshienterprises.in/product/${product.sku || ''}`,
      "priceCurrency": "INR",
      "price": product.price || "",
      "availability": `https://schema.org/${product.availability || "InStock"}`
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Shivanshi Enterprises"
    }
  };
}

/**
 * Creates structured data for the LocalBusiness
 */
export function createLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ChemicalStore",
    "name": "Shivanshi Enterprises",
    "description": "Leading supplier of high-quality chemicals and compounds serving industries across India.",
    "url": "https://shivanshienterprises.in",
    "logo": "https://shivanshienterprises.in/uploads/logo-1742233935605-1ec8d0e89d22.jpg",
    "image": "https://shivanshienterprises.in/uploads/logo-1742233935605-1ec8d0e89d22.jpg",
    "telephone": "+91 1234567890",
    "email": "shivanshienterprises44@gmail.com",
    "sameAs": [
      "https://www.facebook.com/shivanshienterprises",
      "https://www.linkedin.com/company/shivanshi-enterprises"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "55 2B 9 SANGAM ROAD NAINI INDUSTRIAL AREA",
      "addressLocality": "PRAYAGRAJ",
      "addressRegion": "UTTAR PRADESH",
      "postalCode": "211008",
      "addressCountry": "INDIA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.3503",
      "longitude": "81.7956"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  };
}

/**
 * Creates structured data for the FAQ page
 */
export function createFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Creates structured data for a specific chemical product category
 */
export function createProductCategoryStructuredData(category: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": category.name,
    "description": category.description,
    "url": category.url,
    "image": category.image || "https://shivanshienterprises.in/uploads/logo-1742233935605-1ec8d0e89d22.jpg"
  };
} 