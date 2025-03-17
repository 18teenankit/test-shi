import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/layouts/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  category?: {
    id: string;
    name: string;
  };
  imageUrl?: string;
  inStock: boolean;
}

export default function ProductDetail() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch product details
  const { data: product, isLoading, isError } = useQuery<Product>({
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
      contactUs: "Contact Us",
      category: "Category",
      loading: "Loading product details...",
      notFound: "Product not found",
      notFoundMessage: "The product you are looking for does not exist or has been removed.",
      returnHome: "Return to Home",
      backToProducts: "Back to Products"
    },
    hi: {
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक में नहीं",
      specifications: "विनिर्देश",
      description: "विवरण",
      contactUs: "संपर्क करें",
      category: "श्रेणी",
      loading: "उत्पाद विवरण लोड हो रहा है...",
      notFound: "उत्पाद नहीं मिला",
      notFoundMessage: "जिस उत्पाद की आप तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
      returnHome: "होम पर वापस जाएं",
      backToProducts: "उत्पादों पर वापस जाएं"
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
            {currentContent.notFound}
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {currentContent.notFoundMessage}
          </p>
          <Link href="/products">
            <Button>
              {currentContent.backToProducts}
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
            <span className="hover:text-primary cursor-pointer">{language === "en" ? "Home" : "होम"}</span>
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products">
            <span className="hover:text-primary cursor-pointer">{language === "en" ? "Products" : "उत्पाद"}</span>
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href={`/category/${product.category.id}`}>
                <span className="hover:text-primary cursor-pointer">{product.category.name}</span>
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-primary truncate">{product.name}</span>
        </div>
        
        <div className="bg-white dark:bg-card rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge className={product.inStock ? "bg-green-500" : "bg-red-500"}>
              {product.inStock ? currentContent.inStock : currentContent.outOfStock}
            </Badge>
          </div>
          
          {product.category && (
            <div className="mb-6">
              <span className="text-gray-600 dark:text-gray-300 mr-2">{currentContent.category}:</span>
              <Link href={`/category/${product.category.id}`}>
                <span className="text-primary hover:underline cursor-pointer">
                  {product.category.name}
                </span>
              </Link>
            </div>
          )}
          
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="description">{currentContent.description}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="text-gray-700 dark:text-gray-300">
              {product.description ? (
                <div className="prose dark:prose-invert max-w-none">
                  {product.description}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  {language === "en" ? "No description available" : "कोई विवरण उपलब्ध नहीं है"}
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
