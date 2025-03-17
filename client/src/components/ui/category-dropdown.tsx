import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Category } from "@shared/schema";

interface CategoryDropdownProps {
  isMobile?: boolean;
}

export function CategoryDropdown({ isMobile = false }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const categoryLabel = "Products";
  
  if (isMobile) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full font-medium py-2">
          {categoryLabel}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 space-y-2 mt-2">
          {isLoading ? (
            <div className="py-2 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.id}`} className="block py-2 hover:text-primary dark:hover:text-primary transition-colors">
                  {category.name}
                </Link>
              ))}
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  return (
    <div className="dropdown relative group">
      <button className="font-medium hover:text-primary dark:hover:text-primary transition-colors flex items-center">
        {categoryLabel}
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      <div className="dropdown-menu mt-2 py-2 rounded-md">
        {isLoading ? (
          <div className="px-4 py-2 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {category.name}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
