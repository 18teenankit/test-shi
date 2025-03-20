import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFoundAlt() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <Card className={`w-full max-w-md mx-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <CardContent className="pt-6 text-center">
          <AlertCircle className={`h-12 w-12 mx-auto mb-4 ${theme === "dark" ? "text-red-400" : "text-red-500"}`} />
          <h1 className="text-3xl font-bold">Oops! Page Not Found</h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            The page you are looking for doesn't exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
