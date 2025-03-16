import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  inStock: boolean;
  discount?: number;
  language?: "en" | "hi";
}

export function ProductCard({
  id,
  name,
  description,
  imageUrl = "https://images.unsplash.com/photo-1612441804231-77a36b284856",
  inStock,
  discount = 0,
  language = "en"
}: ProductCardProps) {
  const viewDetailsText = language === "en" ? "View Details" : "विवरण देखें";
  const inStockText = language === "en" ? "In Stock" : "स्टॉक में";
  const outOfStockText = language === "en" ? "Out of Stock" : "स्टॉक में नहीं";
  
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden translate-effect">
      <div className="relative pb-[70%]">
        <img 
          src={imageUrl} 
          alt={name} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute top-3 right-3">
          <Badge variant={inStock ? "default" : "destructive"} className={inStock ? "bg-emerald-500" : ""}>
            {inStock ? inStockText : outOfStockText}
          </Badge>
        </div>
        
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-amber-500 text-white">
              {discount}% OFF
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <Link href={`/product/${id}`}>
          <a className="text-primary dark:text-primary hover:underline font-medium flex items-center">
            {viewDetailsText}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
}
