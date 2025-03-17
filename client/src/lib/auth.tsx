import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  refreshSession: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isSuperAdmin: false,
  refreshSession: async () => {},
});

// Session polling interval (in milliseconds)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to check authentication status
  const checkAuth = useCallback(async (showErrors = false) => {
    try {
      console.log("Checking authentication status...");
      
      const response = await fetch("/api/current-user", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.user) {
          console.log("User authenticated:", data.user.username);
          setUser(data.user);
          return true;
        } else {
          console.log("No user data in response");
          setUser(null);
          return false;
        }
      } else {
        console.log("Not authenticated", response.status);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (showErrors) {
        toast({
          title: "Session Error",
          description: "Failed to verify your session. Please try refreshing the page.",
          variant: "destructive",
        });
      }
      setUser(null);
      return false;
    }
  }, [toast]);

  // Function to refresh the session explicitly
  const refreshSession = useCallback(async () => {
    setLoading(true);
    await checkAuth(true);
    setLoading(false);
  }, [checkAuth]);

  // Check if user is authenticated on component mount
  useEffect(() => {
    async function initialAuthCheck() {
      setLoading(true);
      await checkAuth();
      setLoading(false);
    }
    
    initialAuthCheck();
  }, [checkAuth]);

  // Set up periodic session check
  useEffect(() => {
    // Only set up polling if the user is authenticated
    if (!user) return;

    const intervalId = setInterval(() => {
      checkAuth();
    }, SESSION_CHECK_INTERVAL);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [user, checkAuth]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting login for:", username);
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await response.json();
      
      if (data && data.user) {
        console.log("Login successful:", data.user.username);
        setUser(data.user);
        // After login, ensure we have the latest session cookie
        document.cookie = document.cookie;
        return; // Successfully logged in
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      console.error("Login error:", errorMessage);
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Logging out...");
      setLoading(true);
      
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      console.log("Logout successful");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
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
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
