import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  language?: "en" | "hi";
}

interface Product {
  id: number;
  name: string;
  description: string;
  price?: string;
  stockStatus?: string;
  mainImage?: string | null;
  [key: string]: any;
}

export function FeaturedProducts({ language = "en" }: FeaturedProductsProps) {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  const content = {
    en: {
      title: "Featured Products",
      description: "Explore our selection of high-quality chemicals and compounds",
      viewAllButton: "View All Products",
      loadingText: "Loading products...",
      errorText: "Failed to load products.",
      emptyText: "No products available."
    },
    hi: {
      title: "विशेष उत्पाद",
      description: "हमारे उच्च-गुणवत्ता वाले रसायनों और यौगिकों का चयन करें",
      viewAllButton: "सभी उत्पाद देखें",
      loadingText: "उत्पाद लोड हो रहे हैं...",
      errorText: "उत्पाद लोड करने में विफल।",
      emptyText: "कोई उत्पाद उपलब्ध नहीं है।"
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, i) => (
      <div key={i} className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
        <div className="relative pb-[70%]">
          <Skeleton className="absolute inset-0 w-full h-full" />
        </div>
        <div className="p-5 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </div>
      </div>
    ));
  };
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{currentContent.title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            {currentContent.description}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="bg-white dark:bg-card rounded-lg shadow divide-y">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-gray-500 bg-white dark:bg-card rounded-lg shadow">
              {currentContent.errorText}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white dark:bg-card rounded-lg shadow">
              {currentContent.emptyText}
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-lg shadow divide-y">
              {products?.slice(0, 4).map((product: any) => (
                <div key={product.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div onClick={() => window.location.href = `/product/${product.id}`} className="cursor-pointer">
                    <h3 className="text-lg font-medium hover:text-primary mb-1">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1 line-clamp-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              {currentContent.viewAllButton}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
