import { useState, useEffect } from "react";
import { Link, useLocation, useRouter } from "wouter";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Package,
  Layers,
  Image,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  Menu,
  Moon,
  Sun,
  User
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/ui/logo";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const isMobile = useMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsSheetOpen(false);
  }, [location]);
  
  if (!user) {
    // Redirect to login if not authenticated
    navigate("/admin/login");
    return null;
  }
  
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout", {});
      logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  // Navigation items
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
    { href: "/admin/products", label: "Products", icon: <Package className="h-5 w-5 mr-2" /> },
    { href: "/admin/categories", label: "Categories", icon: <Layers className="h-5 w-5 mr-2" /> },
    { href: "/admin/hero-images", label: "Hero Images", icon: <Image className="h-5 w-5 mr-2" /> },
    { href: "/admin/contact-requests", label: "Contact Requests", icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5 mr-2" /> }
  ];
  
  // Only show users page for super_admin
  if (user.role === "super_admin") {
    navItems.push({ href: "/admin/users", label: "Users", icon: <Users className="h-5 w-5 mr-2" /> });
  }
  
  const NavLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => {
    const isActive = location === href;
    
    return (
      <Link href={href}>
        <a
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            isActive
              ? "bg-primary text-white"
              : "hover:bg-secondary"
          }`}
        >
          {icon}
          {label}
        </a>
      </Link>
    );
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-card border-r overflow-y-auto">
            <div className="flex items-center justify-center h-16">
              <Logo size="small" />
              <span className="text-xl font-bold ml-2">Admin Panel</span>
            </div>
            
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16">
                <Logo size="small" />
                <span className="text-xl font-bold ml-2">Admin Panel</span>
              </div>
              
              <nav className="flex-1 mt-5 space-y-1">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
              
              <div className="p-4 border-t mt-auto">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${!isMobile ? "md:pl-64" : ""}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white dark:bg-card shadow-md">
          <div className="px-4 flex items-center justify-between h-full">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSheetOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            )}
            
            <div className="flex-1 flex justify-center md:justify-start">
              {isMobile && (
                <h1 className="text-xl font-semibold">
                  Admin Panel
                </h1>
              )}
            </div>
            
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
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="text-sm text-muted-foreground">
                      Logged in as <strong>{user.username}</strong>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="text-sm text-muted-foreground">
                      Role: <strong>{user.role}</strong>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
