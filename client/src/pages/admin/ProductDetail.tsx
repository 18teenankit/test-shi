import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";
  const productId = isNew ? null : params.id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nameHi: "",
    description: "",
    descriptionHi: "",
    categoryId: "",
    imageUrl: "",
    inStock: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data if editing
  const { isLoading: isLoadingProduct } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !isNew && !!productId,
    onSuccess: (data) => {
      setFormData({
        name: data.name || "",
        nameHi: data.nameHi || "",
        description: data.description || "",
        descriptionHi: data.descriptionHi || "",
        categoryId: data.categoryId || "",
        imageUrl: data.imageUrl || "",
        inStock: data.inStock !== undefined ? data.inStock : true,
      });
    },
  });

  // Fetch categories for dropdown
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Create/Update product mutation
  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isNew ? "/api/products" : `/api/products/${productId}`;
      const method = isNew ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: `Product ${isNew ? "created" : "updated"} successfully`,
        description: `${formData.name} has been ${isNew ? "added to" : "updated in"} your product catalog.`,
      });
      setLocation("/admin/products");
    },
    onError: (error) => {
      toast({
        title: "Error saving product",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: `${formData.name} has been removed from your product catalog.`,
      });
      setLocation("/admin/products");
    },
    onError: (error) => {
      toast({
        title: "Error deleting product",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };
  
  const handleStockToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, inStock: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    mutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setIsSubmitting(true);
      deleteMutation.mutate();
    }
  };

  const isLoading = isLoadingProduct || isLoadingCategories;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isNew ? "Add New Product" : "Edit Product"}
          </h1>
          {!isNew && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name (English)</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (English)</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameHi">Name (Hindi)</Label>
                      <Input
                        id="nameHi"
                        name="nameHi"
                        value={formData.nameHi}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="descriptionHi">Description (Hindi)</Label>
                      <Textarea
                        id="descriptionHi"
                        name="descriptionHi"
                        value={formData.descriptionHi}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center space-x-2">
                  <Switch 
                    id="inStock" 
                    checked={formData.inStock}
                    onCheckedChange={handleStockToggle}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/products")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isNew ? "Create Product" : "Update Product"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
} 