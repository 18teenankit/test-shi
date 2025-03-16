import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function Carousel({
  items,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  
  const updateIndex = useCallback(
    (newIndex: number) => {
      const itemsLength = items.length;
      
      if (newIndex < 0) {
        newIndex = itemsLength - 1;
      } else if (newIndex >= itemsLength) {
        newIndex = 0;
      }
      
      setActiveIndex(newIndex);
    },
    [items]
  );
  
  useEffect(() => {
    if (!autoPlay || paused) return;
    
    const timer = setInterval(() => {
      updateIndex(activeIndex + 1);
    }, interval);
    
    return () => {
      clearInterval(timer);
    };
  }, [autoPlay, interval, activeIndex, updateIndex, paused]);
  
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div key={index} className="min-w-full flex-grow-0 flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
      
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full hover:bg-white dark:hover:bg-black/70"
            onClick={() => updateIndex(activeIndex - 1)}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full hover:bg-white dark:hover:bg-black/70"
            onClick={() => updateIndex(activeIndex + 1)}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}
      
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full focus:outline-none",
                index === activeIndex
                  ? "bg-white bg-opacity-80"
                  : "bg-white bg-opacity-30"
              )}
              onClick={() => updateIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Alternative Hero Carousel Implementation that matches the design reference more closely
export function HeroCarousel({
  slides,
  autoPlay = true,
  interval = 5000,
}: {
  slides: Array<{
    imageUrl: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);
  
  return (
    <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden" style={{ height: "500px" }}>
      {slides.map((slide, index) => (
        <div key={index} className={`hero-slide ${index === currentSlide ? "active" : ""}`}>
          <img
            src={slide.imageUrl}
            alt={slide.title || "Hero image"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl">
                {slide.title && (
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {slide.title}
                  </h1>
                )}
                {slide.subtitle && (
                  <p className="text-xl text-white mb-8">{slide.subtitle}</p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <a
                    href={slide.buttonLink}
                    className="inline-block bg-primary hover:bg-opacity-90 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Hero Navigation */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot w-3 h-3 rounded-full focus:outline-none ${
              index === currentSlide ? "bg-white bg-opacity-60" : "bg-white bg-opacity-30"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
