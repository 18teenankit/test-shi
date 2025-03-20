import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Eye, EyeOff } from "lucide-react";

type FormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, loading } = useAuth();
  const [_, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  
  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log("User already authenticated, redirecting to admin dashboard");
      navigate("/admin");
    }
  }, [user, loading, navigate]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      console.log("Attempting login...");
      
      // First check if API server is reachable
      try {
        const healthCheck = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        console.log("Health check response:", healthCheck.status, healthCheck.statusText);
      } catch (healthError) {
        console.error("Health check failed:", healthError);
      }
      
      await login(data.username, data.password);
      
      // Store login timestamp in localStorage to track session age
      localStorage.setItem('admin_last_login', Date.now().toString());
      navigate("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide more specific error message based on the error type
      if (error.message.includes("invalid response") || error.message.includes("HTML instead of JSON")) {
        setErrorMessage("Server error: The server responded with HTML instead of JSON. Please try again later.");
      } else if (error.message.includes("internet connection")) {
        setErrorMessage("Connection error: Unable to connect to the server. Please check your network.");
      } else {
        setErrorMessage(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }
  
  // Don't render login form if already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4">
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
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Logo size="large" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 p-3 rounded-md mb-4 text-sm">
              {errorMessage}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
