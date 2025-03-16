import { Link } from "wouter";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  language?: "en" | "hi";
}

export function ProductCard({
  id,
  name,
  description,
  language = "en"
}: ProductCardProps) {
  const viewDetailsText = language === "en" ? "View Details" : "विवरण देखें";
  
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden translate-effect">
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
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
