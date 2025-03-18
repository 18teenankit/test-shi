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
  const [error, setError] = useState<string | null>(null);

  // Function to check authentication status
  const checkAuth = useCallback(async () => {
    try {
      // Check authentication status from the server
      setLoading(true);
      
      const response = await fetch("/api/current-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          // Successfully authenticated user
          setUser(data.user);
          setError(null);
        } else {
          // Response OK but no user data
          setUser(null);
        }
      } else {
        // Not authenticated
        setUser(null);
      }
    } catch (err) {
      // Authentication check failed
      setError("Failed to check authentication status");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to refresh the session explicitly
  const refreshSession = useCallback(async () => {
    setLoading(true);
    await checkAuth();
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

  // Login the user
  const login = async (username: string, password: string) => {
    try {
      // Attempt user login
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      // Handle non-JSON responses (indicates a server error)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Non-JSON response:", errorText);
        throw new Error("The server returned an invalid response. Please try again later.");
      }

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setUser(data.user);
        setError(null);
        return data;
      } else {
        // Login failed with error from server
        setError(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      // Error during login process
      if (err.message === "Failed to fetch") {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else {
        setError(err.message || "An error occurred during login");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      // Attempt to logout
      setLoading(true);
      
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Logout successful
        setUser(null);
      }
    } catch (err) {
      // Error during logout
      setError("Logout failed");
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
