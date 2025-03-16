import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/ThemeProvider";
import { Logo } from "@/components/ui/logo";
import { CategoryDropdown } from "@/components/ui/category-dropdown";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const isMobile = useMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  // Settings query
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });
  
  // Effect to close mobile menu when changing page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white dark:bg-card z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Logo />
                <span className="text-xl font-bold text-primary dark:text-primary">
                  {settings?.company_name || "Shivanshi Enterprises"}
                </span>
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex space-x-8">
                <Link href="/">
                  <a className="font-medium hover:text-primary dark:hover:text-primary transition-colors">
                    {language === "en" ? "Home" : "होम"}
                  </a>
                </Link>
                
                <CategoryDropdown language={language} />
                
                <Link href="/about">
                  <a className="font-medium hover:text-primary dark:hover:text-primary transition-colors">
                    {language === "en" ? "About Us" : "हमारे बारे में"}
                  </a>
                </Link>
                
                <Link href="/contact">
                  <a className="font-medium hover:text-primary dark:hover:text-primary transition-colors">
                    {language === "en" ? "Contact" : "संपर्क करें"}
                  </a>
                </Link>
              </nav>
            )}
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              
              {/* Mobile Menu Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && isMobileMenuOpen && (
          <div className="bg-white dark:bg-card border-t dark:border-border py-4">
            <div className="container mx-auto px-4 space-y-3">
              <Link href="/">
                <a className="block font-medium hover:text-primary dark:hover:text-primary py-2 transition-colors">
                  {language === "en" ? "Home" : "होम"}
                </a>
              </Link>
              
              <div className="py-2">
                <CategoryDropdown isMobile language={language} />
              </div>
              
              <Link href="/about">
                <a className="block font-medium hover:text-primary dark:hover:text-primary py-2 transition-colors">
                  {language === "en" ? "About Us" : "हमारे बारे में"}
                </a>
              </Link>
              
              <Link href="/contact">
                <a className="block font-medium hover:text-primary dark:hover:text-primary py-2 transition-colors">
                  {language === "en" ? "Contact" : "संपर्क करें"}
                </a>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer language={language} />
      
      {/* Language Switcher */}
      <LanguageSwitcher language={language} setLanguage={setLanguage} />
      
      {/* WhatsApp Button */}
      <WhatsAppButton whatsappNumber={settings?.social_whatsapp || "+919876543210"} />
    </div>
  );
}
