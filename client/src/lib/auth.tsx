import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define types for the user and auth context
export interface AuthUser {
  id: number;
  username: string;
  role: "super_admin" | "manager";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isSuperAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on component mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/current-user", {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest("POST", "/api/login", { username, password });
      const data = await response.json();
      setUser(data.user);
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isSuperAdmin = !!user && user.role === "super_admin";

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
