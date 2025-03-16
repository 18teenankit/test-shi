import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Layout } from "@/components/layouts/Layout";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function ProductCategory() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [match, params] = useRoute("/category/:id");
  const categoryId = params?.id ? parseInt(params.id) : undefined;
  
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "newest">("name");
  
  // Fetch category
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: !!categoryId,
  });
  
  // Fetch products by category
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: [`/api/products?categoryId=${categoryId}`],
    enabled: !!categoryId,
  });
  
  const isLoading = categoryLoading || productsLoading;
  
  // Filter products by search
  const filteredProducts = products?.filter((product: any) => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
  ) || [];
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
  
  const content = {
    en: {
      title: category?.name || "Products",
      searchPlaceholder: "Search products...",
      sortBy: "Sort by",
      name: "Name",
      newest: "Newest",
      noProductsFound: "No products found.",
      loading: "Loading products..."
    },
    hi: {
      title: category?.name || "उत्पाद",
      searchPlaceholder: "उत्पादों की खोज करें...",
      sortBy: "इसके अनुसार क्रमबद्ध करें",
      name: "नाम",
      newest: "नवीनतम",
      noProductsFound: "कोई उत्पाद नहीं मिला।",
      loading: "उत्पाद लोड हो रहे हैं..."
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  // Render skeleton loader during loading
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, i) => (
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
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">{currentContent.title}</h1>
          
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder={currentContent.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "name" | "newest")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={currentContent.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{currentContent.name}</SelectItem>
                  <SelectItem value="newest">{currentContent.newest}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="bg-white dark:bg-card rounded-lg shadow">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 border-b">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-card rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400">{currentContent.noProductsFound}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-lg shadow divide-y">
              {sortedProducts.map((product: any) => (
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
      </div>
    </Layout>
  );
}
