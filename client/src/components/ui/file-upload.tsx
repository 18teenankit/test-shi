import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  id: string;
  onChange: (file: File | null) => void;
  label?: string;
  accept?: string;
  value?: File | null;
  preview?: string;
  error?: string;
}

export function FileUpload({
  id,
  onChange,
  label = "Upload file",
  accept = "image/*",
  value,
  preview,
  error
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      onChange(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null);
    setPreviewUrl(null);
  };
  
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      
      <div className="flex flex-col space-y-2">
        {previewUrl ? (
          <div className="relative rounded-md overflow-hidden border bg-background">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 mx-auto object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              id={id}
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
              accept={accept}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {label}
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
