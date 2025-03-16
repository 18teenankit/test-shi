import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Layout } from "@/components/layouts/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export default function ProductDetail() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch product details
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
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
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="bg-white dark:bg-card rounded-lg shadow p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="mt-4">
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
        
        <div className="bg-white dark:bg-card rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
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
    </Layout>
  );
}
