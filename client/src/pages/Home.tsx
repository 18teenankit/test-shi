import { useState } from "react";
import { Layout } from "@/components/layouts/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { CompanyIntro } from "@/components/sections/CompanyIntro";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { CTASection } from "@/components/sections/CTASection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  return (
    <Layout>
      <HeroSection language={language} />
      <CompanyIntro language={language} />
      <FeaturedProducts language={language} />
      <CTASection language={language} />
      <ContactSection language={language} />
    </Layout>
  );
}
