import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/auth";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ProductCategory from "@/pages/ProductCategory";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/not-found";
import Products from "@/pages/Products"; // Added import
import CategoryProducts from "@/pages/CategoryProducts"; // Added import

// Legal pages
import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";

// Admin pages
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ProductsAdmin from "@/pages/admin/Products"; // Renamed to avoid conflict
import Categories from "@/pages/admin/Categories";
import HeroImages from "@/pages/admin/HeroImages";
import ContactRequests from "@/pages/admin/ContactRequests";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";

// Auth providers
import { AuthProvider } from "@/lib/auth";

// Protected route component for admin routes
function AdminRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  
  // If loading, return null (AdminLayout will handle loading state)
  if (loading) return null;
  
  // If not authenticated and not loading, redirect to login
  if (!user && !loading) {
    // Redirect to login page
    return <Redirect to="/admin/login" />;
  }
  
  // Render the component if authenticated
  return <Route {...rest} component={Component} />;
}

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
            <Route path="/products" component={Products} /> {/* Added route */}
            <Route path="/category/:id" component={CategoryProducts} /> {/* Added route */}
            
            {/* Legal Routes */}
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />

            {/* Login route (special case) */}
            <Route path="/admin/login" component={Login} />

            {/* Protected Admin Routes */}
            <AdminRoute path="/admin" component={Dashboard} />
            <AdminRoute path="/admin/products" component={ProductsAdmin} />
            <AdminRoute path="/admin/categories" component={Categories} />
            <AdminRoute path="/admin/hero-images" component={HeroImages} />
            <AdminRoute path="/admin/contact-requests" component={ContactRequests} />
            <AdminRoute path="/admin/settings" component={Settings} />
            <AdminRoute path="/admin/users" component={Users} />

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