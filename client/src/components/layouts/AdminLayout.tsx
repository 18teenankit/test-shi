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
  User,
  Loader
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout, loading, refreshSession } = useAuth();
  const [location, navigate] = useLocation();
  const isMobile = useMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authRetries, setAuthRetries] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsSheetOpen(false);
  }, [location]);
  
  // Enhanced authentication check with retry mechanism
  useEffect(() => {
    const MAX_RETRIES = 3;
    let timeoutId: NodeJS.Timeout;
    
    // Only run this effect if the main auth loading is complete
    if (!loading) {
      if (!user && authRetries < MAX_RETRIES) {
        // If no user after auth loading finished, wait briefly and retry
        setAuthChecking(true);
        timeoutId = setTimeout(async () => {
          try {
            console.log(`Auth retry attempt ${authRetries + 1} of ${MAX_RETRIES}`);
            await refreshSession();
            setAuthRetries(prev => prev + 1);
          } finally {
            setAuthChecking(false);
          }
        }, 1000); // Wait 1 second before retry
      } else {
        setAuthChecking(false);
      }
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, loading, authRetries, refreshSession]);
  
  // Redirect to login if not authenticated after retries
  useEffect(() => {
    if (!loading && !authChecking && !user && authRetries > 0) {
      console.log("Not authenticated after retries, redirecting to login");
      navigate("/admin/login");
    }
  }, [loading, authChecking, user, authRetries, navigate]);
  
  // Show loading state while checking auth
  if (loading || authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600 dark:text-gray-400">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }
  
  // If still checking or not authenticated, don't render admin content
  if (!user) {
    return null;
  }
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <header className="border-b bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
                    <div className="flex flex-col h-full">
                      <div className="border-b py-4 px-4">
                        <Logo size="small" />
                      </div>
                      
                      <div className="flex-1 overflow-auto py-2">
                        <nav className="space-y-1 px-2">
                          {navItems.map((item) => (
                            <Link 
                              key={item.href} 
                              href={item.href}
                              className={`flex items-center px-2 py-2 text-sm rounded-md ${
                                location === item.href
                                  ? 'bg-primary text-white font-medium'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          ))}
                        </nav>
                      </div>
                      
                      <div className="border-t p-4 flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          className="justify-start text-sm font-normal w-full"
                          onClick={toggleTheme}
                        >
                          {theme === 'dark' ? (
                            <Sun className="h-4 w-4 mr-2" />
                          ) : (
                            <Moon className="h-4 w-4 mr-2" />
                          )}
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="justify-start text-sm font-normal text-red-500 w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              
              <Link href="/admin" className="flex items-center">
                <Logo size="small" />
                <span className="ml-2 font-semibold text-lg hidden sm:inline-block">Admin Panel</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.username}</span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="cursor-pointer w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar (desktop only) */}
        {!isMobile && (
          <div className="w-64 border-r bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <nav className="space-y-1 p-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    location === item.href
                      ? 'bg-primary text-white font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
