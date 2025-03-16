import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { HeroCarousel } from "@/components/ui/carousel-custom";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionProps {
  language?: "en" | "hi";
}

export function HeroSection({ language = "en" }: HeroSectionProps) {
  const { data: heroImages, isLoading } = useQuery({
    queryKey: ["/api/hero-images"],
  });
  
  if (isLoading) {
    return (
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden" style={{ height: "500px" }}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  if (!heroImages || heroImages.length === 0) {
    // Fallback hero if no images are available
    return (
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden" style={{ height: "500px" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {language === "en" 
                  ? "Welcome to Shivanshi Enterprises" 
                  : "शिवांशी एंटरप्राइजेज में आपका स्वागत है"}
              </h1>
              <p className="text-xl text-white mb-8">
                {language === "en"
                  ? "PAN India Chemical & Compound Dealers - Quality & Reliability Since 2010"
                  : "पैन इंडिया केमिकल एंड कंपाउंड डीलर्स - 2010 से गुणवत्ता और विश्वसनीयता"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://wa.me/919418974444" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors text-center"
                >
                  {language === "en" ? "Contact via WhatsApp" : "व्हाट्सएप पर संपर्क करें"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <HeroCarousel
      slides={heroImages.map((image: any) => ({
        imageUrl: image.imageUrl,
        title: image.title,
        subtitle: image.subtitle,
        buttonText: image.buttonText,
        buttonLink: image.buttonLink
      }))}
    />
  );
}
