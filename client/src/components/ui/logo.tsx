import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Logo({ size = "medium", className }: LogoProps) {
  const dimensions = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-16 w-16",
  };

  return (
    <div className={cn(dimensions[size], "relative", className)}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
        <path
          d="M10 15C10 12.2386 12.2386 10 15 10H25C27.7614 10 30 12.2386 30 15V25C30 27.7614 27.7614 30 25 30H15C12.2386 30 10 27.7614 10 25V15Z"
          fill="white"
          fillOpacity="0.2"
        />
        <path
          d="M20 12L28 20L20 28L12 20L20 12Z"
          fill="white"
        />
        <path
          d="M20 16L24 20L20 24L16 20L20 16Z"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
    </div>
  );
}
