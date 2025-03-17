import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/ThemeProvider";
import { Logo } from "@/components/ui/logo";
import { CategoryDropdown } from "@/components/ui/category-dropdown";
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

  // Settings query - the type specifies that it's a Record with string keys and string values
  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  // Effect to close mobile menu when changing page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
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
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-bold text-primary dark:text-primary">
                {settings.company_name || "Shivanshi Enterprises"}
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="flex space-x-8">
                <Link
                  href="/"
                  className="font-medium hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Home
                </Link>

                <CategoryDropdown />

                <Link
                  href="/about"
                  className="font-medium hover:text-primary dark:hover:text-primary transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="font-medium hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Contact
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
              <Link
                href="/"
                className="block font-medium hover:text-primary dark:hover:text-primary py-2 transition-colors"
              >
                Home
              </Link>

              <div className="py-2">
                <CategoryDropdown isMobile />
              </div>

              <Link
                href="/about"
                className="block font-medium hover:text-primary dark:hover:text-primary py-2 transition-colors"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="block font-medium hover:text-primary dark:hover:text-primary py-2 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton
        whatsappNumber={settings.social_whatsapp || "+919418974444"}
      />
    </div>
  );
}
