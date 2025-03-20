import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || `${res.status}: ${res.statusText}`);
      } else {
        const text = (await res.text()) || res.statusText;
        console.error(`Non-JSON response received: ${text.substring(0, 100)}...`);
        throw new Error(`Server returned HTML instead of JSON. Status: ${res.status}`);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        // JSON parse error
        const text = await res.text();
        console.error(`Invalid JSON response: ${text.substring(0, 100)}...`);
        throw new Error(`Invalid JSON response from server. Status: ${res.status}`);
      }
      throw error;
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    } : {
      "Accept": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        }
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query failed for ${queryKey[0]}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});

// Add a function to invalidate settings cache
export function invalidateSettingsCache() {
  queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
}
