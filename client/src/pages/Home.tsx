import { useState } from "react";
import { Layout } from "@/components/layouts/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { CompanyIntro } from "@/components/sections/CompanyIntro";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CTASection } from "@/components/sections/CTASection";
import { ContactSection } from "@/components/sections/ContactSection";
import Head from "@/components/SEO/Head";
import { createLocalBusinessStructuredData, createOrganizationStructuredData } from "@/utils/structuredData";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  // Combine multiple structured data objects
  const structuredData = [
    createOrganizationStructuredData(),
    createLocalBusinessStructuredData()
  ];
  
  return (
    <Layout>
      {/* SEO Meta Tags */}
      <Head 
        title="Shivanshi Enterprises"
        description="Shivanshi Enterprises is a trusted supplier of premium chemicals and compounds across India. We provide reliable solutions for all your chemical needs with quality and safety."
        keywords="chemicals, compounds, chemical dealers, chemical suppliers, industrial chemicals, laboratory chemicals, Shivanshi Enterprises, Prayagraj chemicals"
        canonicalUrl="/"
        ogTitle="Shivanshi Enterprises - Leading Chemical & Compound Supplier"
        ogDescription="Your trusted partner for high-quality chemicals and compounds across India. Quality, safety, and reliability."
        ogType="website"
        structuredData={structuredData}
      />
      
      <HeroSection language={language} />
      <CompanyIntro language={language} />
      <FeaturedProducts language={language} />
      <CTASection language={language} />
      <ContactSection language={language} />
    </Layout>
  );
}
