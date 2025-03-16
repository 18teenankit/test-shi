import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Layout } from "@/components/layouts/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel } from "@/components/ui/carousel-custom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function ProductDetail() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  const content = {
    en: {
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      specifications: "Specifications",
      description: "Description",
      discount: "OFF",
      contactUs: "Contact Us",
      category: "Category",
      loading: "Loading product details..."
    },
    hi: {
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक में नहीं",
      specifications: "विनिर्देश",
      description: "विवरण",
      discount: "छूट",
      contactUs: "संपर्क करें",
      category: "श्रेणी",
      loading: "उत्पाद विवरण लोड हो रहा है..."
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Skeleton className="w-full aspect-square" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === "en" ? "Product not found" : "उत्पाद नहीं मिला"}
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {language === "en" 
              ? "The product you are looking for does not exist or has been removed." 
              : "जिस उत्पाद की आप तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।"}
          </p>
          <Link href="/">
            <Button>
              {language === "en" ? "Return to Home" : "होम पर वापस जाएं"}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Prepare carousel items from product images
  const carouselItems = product.images && product.images.length > 0
    ? product.images.map((image: any) => (
        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <img
            src={image.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      ))
    : [
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">
            {language === "en" ? "No image available" : "कोई छवि उपलब्ध नहीं है"}
          </span>
        </div>
      ];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link href="/">
            <a className="hover:text-primary">{language === "en" ? "Home" : "होम"}</a>
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          {product.category && (
            <>
              <Link href={`/category/${product.category.id}`}>
                <a className="hover:text-primary">{product.category.name}</a>
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </>
          )}
          <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <Carousel items={carouselItems} showDots={carouselItems.length > 1} />
            
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="secondary" className="bg-amber-500 text-white">
                  {product.discount}% {currentContent.discount}
                </Badge>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="mb-4">
              <Badge variant={product.inStock ? "default" : "destructive"} className={product.inStock ? "bg-emerald-500" : ""}>
                {product.inStock ? currentContent.inStock : currentContent.outOfStock}
              </Badge>
            </div>
            
            {product.category && (
              <div className="mb-4">
                <span className="text-gray-600 dark:text-gray-300">{currentContent.category}: </span>
                <Link href={`/category/${product.category.id}`}>
                  <a className="text-primary hover:underline">{product.category.name}</a>
                </Link>
              </div>
            )}
            
            <Tabs defaultValue="description" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="description">{currentContent.description}</TabsTrigger>
                {product.specifications && (
                  <TabsTrigger value="specifications">{currentContent.specifications}</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="description" className="text-gray-700 dark:text-gray-300">
                {product.description || (
                  <p className="text-gray-500 italic">
                    {language === "en" 
                      ? "No description available" 
                      : "कोई विवरण उपलब्ध नहीं है"}
                  </p>
                )}
              </TabsContent>
              
              {product.specifications && (
                <TabsContent value="specifications" className="text-gray-700 dark:text-gray-300">
                  <div className="whitespace-pre-line">
                    {product.specifications}
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="mt-8">
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  {currentContent.contactUs}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
