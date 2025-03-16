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
                  ? "Your trusted partner for industrial equipment and power tools."
                  : "औद्योगिक उपकरण और पावर टूल्स के लिए आपका विश्वसनीय साथी।"}
              </p>
              <Link href="/products">
                <a className="inline-block bg-white hover:bg-gray-100 text-primary font-medium px-6 py-3 rounded-lg transition-colors">
                  {language === "en" ? "Explore Products" : "उत्पाद देखें"}
                </a>
              </Link>
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
