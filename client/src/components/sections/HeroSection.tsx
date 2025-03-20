import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { HeroCarousel } from "@/components/ui/carousel-custom";
import { Skeleton } from "@/components/ui/skeleton";

// Define interface for hero image data
interface HeroImage {
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  order: number | null;
  isActive: boolean | null;
}

interface HeroSectionProps {
  language?: "en" | "hi";
}

export function HeroSection({ language = "en" }: HeroSectionProps) {
  console.log('HeroSection fetching hero images:', { queryKey: "/api/hero-images" });
  
  const { data: heroImages, isLoading, error } = useQuery<HeroImage[]>({
    queryKey: ["/api/hero-images"],
    queryFn: async () => {
      console.log('Starting hero images fetch');
      try {
        const response = await fetch('/api/hero-images', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('Hero images fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          console.error('Hero images fetch failed:', response.status, response.statusText);
          throw new Error(`Error fetching hero images: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('Hero images fetch content-type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Invalid content type:', contentType);
          const text = await response.text();
          console.error('Response text (first 100 chars):', text.substring(0, 100));
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        console.log('Hero images fetch successful, found', data.length, 'hero images');
        return data;
      } catch (err) {
        console.error('Failed to load hero images:', err);
        throw err;
      }
    },
    retry: 1
  });
  
  if (isLoading) {
    console.log('HeroSection is loading...');
    return (
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden" style={{ height: "500px" }}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  if (error) {
    console.error('HeroSection error:', error);
  }
  
  if (!heroImages || heroImages.length === 0) {
    console.log('No hero images found, showing fallback');
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
                  href="https://wa.me/911234567890" 
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
  
  console.log('Rendering hero carousel with', heroImages.length, 'images');
  return (
    <HeroCarousel
      slides={heroImages.map((image: HeroImage) => ({
        imageUrl: image.imageUrl,
        title: image.title || undefined,
        subtitle: image.subtitle || undefined,
        buttonText: image.buttonText || undefined,
        buttonLink: image.buttonLink || undefined
      }))}
    />
  );
}
