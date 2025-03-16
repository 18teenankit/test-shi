import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ProductCategory from "@/pages/ProductCategory";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/not-found";

// Admin pages
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Categories from "@/pages/admin/Categories";
import HeroImages from "@/pages/admin/HeroImages";
import ContactRequests from "@/pages/admin/ContactRequests";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";

// Auth providers
import { AuthProvider } from "@/lib/auth";

function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/category/:id" component={ProductCategory} />
            <Route path="/product/:id" component={ProductDetail} />
            
            {/* Admin Routes */}
            <Route path="/admin" component={Dashboard} />
            <Route path="/admin/login" component={Login} />
            <Route path="/admin/products" component={Products} />
            <Route path="/admin/categories" component={Categories} />
            <Route path="/admin/hero-images" component={HeroImages} />
            <Route path="/admin/contact-requests" component={ContactRequests} />
            <Route path="/admin/settings" component={Settings} />
            <Route path="/admin/users" component={Users} />
            
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
