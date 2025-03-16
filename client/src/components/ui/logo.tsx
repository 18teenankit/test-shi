import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Logo({ size = "medium", className }: LogoProps) {
  const dimensions = {
    small: "h-8",
    medium: "h-12",
    large: "h-20",
  };

  // Fetch company name from settings
  const { data: settings = {} } = useQuery({
    queryKey: ["/api/settings"],
  });

  const companyName = settings.company_name || "Shivanshi Enterprises";
  const companyTagline = settings.company_tagline || "Chemicals & Compound Dealers";

  // Get first letter for the logo
  const firstLetter = companyName?.charAt(0) || "S";

  return (
    <div className={cn(dimensions[size], "relative", className)}>
      <svg
        viewBox="0 0 500 400"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Dynamic Logo */}
        <g>
          {/* First letter in dark blue */}
          <path
            d="M120 50 C 150 30, 200 20, 220 50 C 240 80, 220 110, 150 130 C 80 150, 60 180, 80 210 C 100 240, 150 250, 180 230"
            stroke="#002859"
            strokeWidth="40"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* E in red */}
          <path
            d="M240 40 L 320 40 L 320 80 L 240 80 L 240 220 L 320 220"
            stroke="#D32027"
            strokeWidth="40"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Diagonal line (dark blue) */}
          <path
            d="M330 40 L 410 220"
            stroke="#002859"
            strokeWidth="40"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Company name */}
          <text
            x="40"
            y="320"
            fontFamily="Arial, sans-serif"
            fontSize="60"
            fontWeight="bold"
            fill="#002859"
          >
            {companyName.toUpperCase()}
          </text>
          
          {/* Tagline */}
          <text
            x="120"
            y="370"
            fontFamily="Arial, sans-serif"
            fontSize="30"
            fontWeight="normal"
            fill="#002859"
          >
            {companyTagline.toUpperCase()}
          </text>
        </g>
      </svg>
    </div>
  );
}
