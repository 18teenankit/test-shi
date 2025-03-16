import { useState } from "react";
import { Layout } from "@/components/layouts/Layout";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Contact() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  return (
    <Layout>
      <div className="py-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "Contact Us" : "संपर्क करें"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {language === "en" 
              ? "Get in touch with our team for any queries or support" 
              : "किसी भी प्रश्न या सहायता के लिए हमारी टीम से संपर्क करें"}
          </p>
        </div>
      </div>
      
      <ContactSection language={language} />
    </Layout>
  );
}
