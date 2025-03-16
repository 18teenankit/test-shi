import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  language: "en" | "hi";
  setLanguage: (language: "en" | "hi") => void;
}

export function LanguageSwitcher({ language, setLanguage }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full h-12 w-12 bg-slate-800 hover:bg-slate-700 text-white"
            size="icon"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Switch language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className={language === "en" ? "bg-muted" : ""}
            onClick={() => setLanguage("en")}
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={language === "hi" ? "bg-muted" : ""}
            onClick={() => setLanguage("hi")}
          >
            हिन्दी (Hindi)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
