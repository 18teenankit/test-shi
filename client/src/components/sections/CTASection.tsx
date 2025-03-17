import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface CTASectionProps {
  language?: "en" | "hi";
}

interface Settings {
  social_whatsapp?: string;
  [key: string]: string | undefined;
}

export function CTASection({ language = "en" }: CTASectionProps) {
  const { data: settings = {} as Settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });
  
  const whatsappNumber = settings?.social_whatsapp || "+919876543210";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    language === "en" 
      ? "Hello! I need assistance with chemicals and compounds." 
      : "नमस्ते! मुझे रसायनों और यौगिकों के साथ सहायता की आवश्यकता है।"
  )}`;
  
  const content = {
    en: {
      title: "Need help finding the right chemicals?",
      subtitle: "Our experts are ready to assist you with your specific requirements.",
      contactButton: "Contact Us",
      whatsappButton: "WhatsApp"
    },
    hi: {
      title: "सही रसायन खोजने में मदद चाहिए?",
      subtitle: "हमारे विशेषज्ञ आपकी विशिष्ट आवश्यकताओं के साथ आपकी सहायता करने के लिए तैयार हैं।",
      contactButton: "संपर्क करें",
      whatsappButton: "व्हाट्सएप"
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold">
              {currentContent.title}
            </h2>
            <p className="mt-2 text-gray-100">
              {currentContent.subtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/contact">
              <Button className="bg-white text-primary hover:bg-gray-100">
                {currentContent.contactButton}
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-5 w-5 mr-2 fill-current"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
                {currentContent.whatsappButton}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
