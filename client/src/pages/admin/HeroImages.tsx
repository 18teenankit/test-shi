import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { insertHeroImageSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreHorizontal, 
  PlusCircle, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown, 
  ImageIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";

type HeroImageFormValues = z.infer<typeof insertHeroImageSchema> & {
  imageFile?: File | null;
};

export default function HeroImages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Get URL params
  const urlParams = new URLSearchParams(location.search.substring(1));
  const actionParam = urlParams.get("action");

  // Open dialog if action=new in URL
  useState(() => {
    if (actionParam === "new") {
      setOpenDialog(true);
    }
  });

  // Fetch hero images
  const { data: heroImages, isLoading: heroImagesLoading } = useQuery({
    queryKey: ["/api/admin/hero-images"],
  });

  // Create hero image form
  const form = useForm<HeroImageFormValues>({
    resolver: zodResolver(insertHeroImageSchema),
    defaultValues: {
      imageUrl: "",
      imageFile: null,
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      order: 0,
      isActive: true
    },
  });

  // Reset form when dialog opens/closes or when selectedImage changes
  useState(() => {
    if (openDialog) {
      // If editing, set form values from selectedImage
      if (selectedImage) {
        form.reset({
          imageUrl: selectedImage.imageUrl || "",
          imageFile: null,
          title: selectedImage.title || "",
          subtitle: selectedImage.subtitle || "",
          buttonText: selectedImage.buttonText || "",
          buttonLink: selectedImage.buttonLink || "",
          order: selectedImage.order || 0,
          isActive: selectedImage.isActive
        });
      } else {
        // If creating, reset to defaults
        form.reset({
          imageUrl: "",
          imageFile: null,
          title: "",
          subtitle: "",
          buttonText: "",
          buttonLink: "",
          order: heroImages?.length || 0,
          isActive: true
        });
      }
    }
  }, [openDialog, selectedImage, heroImages?.length]);

  // Create hero image mutation
  const createMutation = useMutation({
    mutationFn: async (data: HeroImageFormValues) => {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      if (data.buttonText) formData.append("buttonText", data.buttonText);
      if (data.buttonLink) formData.append("buttonLink", data.buttonLink);
      formData.append("order", data.order.toString());
      formData.append("isActive", data.isActive.toString());
      if (data.imageFile) formData.append("image", data.imageFile);

      const response = await fetch("/api/admin/hero-images", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create hero image");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      setOpenDialog(false);
      toast({
        title: "Hero image created",
        description: "Hero image has been created successfully.",
      });
      // Clear URL param
      // navigate("/admin/hero-images"); //Removed navigate call as it is no longer needed here.
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create hero image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update hero image mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; data: HeroImageFormValues }) => {
      const formData = new FormData();
      if (data.data.title) formData.append("title", data.data.title);
      if (data.data.subtitle) formData.append("subtitle", data.data.subtitle);
      if (data.data.buttonText) formData.append("buttonText", data.data.buttonText);
      if (data.data.buttonLink) formData.append("buttonLink", data.data.buttonLink);
      formData.append("order", data.data.order.toString());
      formData.append("isActive", data.data.isActive.toString());
      if (data.data.imageFile) formData.append("image", data.data.imageFile);

      const response = await fetch(`/api/admin/hero-images/${data.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hero image");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      setOpenDialog(false);
      setSelectedImage(null);
      toast({
        title: "Hero image updated",
        description: "Hero image has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update hero image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete hero image mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/hero-images/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      setOpenDeleteDialog(false);
      setSelectedImage(null);
      toast({
        title: "Hero image deleted",
        description: "Hero image has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete hero image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/hero-images/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
      toast({
        title: "Status updated",
        description: "Hero image visibility has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update order mutation (move up/down)
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: number; newOrder: number }) => {
      const response = await apiRequest("PUT", `/api/admin/hero-images/${id}`, { order: newOrder });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-images"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submit handler
  const onSubmit = (data: HeroImageFormValues) => {
    if (selectedImage) {
      updateMutation.mutate({ id: selectedImage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (image: any) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleDelete = (image: any) => {
    setSelectedImage(image);
    setOpenDeleteDialog(true);
  };

  const handleToggleActive = (image: any) => {
    toggleActiveMutation.mutate({ id: image.id, isActive: !image.isActive });
  };

  const handleMoveUp = (image: any, index: number) => {
    if (index === 0) return;
    updateOrderMutation.mutate({ id: image.id, newOrder: image.order - 1 });
  };

  const handleMoveDown = (image: any, index: number, totalItems: number) => {
    if (index === totalItems - 1) return;
    updateOrderMutation.mutate({ id: image.id, newOrder: image.order + 1 });
  };

  // Sort hero images by order
  const sortedHeroImages = heroImages ? [...heroImages].sort((a: any, b: any) => a.order - b.order) : [];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hero Images</h1>

          <Button onClick={() => {
            setSelectedImage(null);
            setOpenDialog(true);
          }}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Hero Image
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Hero Slideshow</CardTitle>
            <CardDescription>
              These images will appear in the hero carousel on the homepage. Drag to reorder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {heroImagesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            ) : sortedHeroImages.length === 0 ? (
              <div className="text-center py-10">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">No hero images found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Add images to display in the hero section carousel.
                </p>
                <Button onClick={() => setOpenDialog(true)}>
                  Add your first hero image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedHeroImages.map((image: any, index: number) => (
                  <Card key={image.id} className={`overflow-hidden ${!image.isActive ? 'opacity-60' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-[260px,1fr,auto] gap-4">
                      <div className="h-[180px] bg-gray-100 dark:bg-gray-800 relative">
                        {image.imageUrl ? (
                          <img 
                            src={image.imageUrl} 
                            alt={image.title || "Hero slide"} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {!image.isActive && (
                          <Badge variant="secondary" className="absolute top-2 right-2 bg-gray-500 text-white">
                            Hidden
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 md:p-0 md:py-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {image.title || "Untitled Slide"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {image.subtitle || "No subtitle"}
                          </p>
                          {image.buttonText && (
                            <div className="inline-flex items-center bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-md text-sm">
                              {image.buttonText} 
                              {image.buttonLink && (
                                <span className="text-xs ml-2 text-gray-500">→ {image.buttonLink}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center mt-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                            Order: {image.order}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-end p-4 space-x-2 md:space-x-0 md:space-y-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMoveUp(image, index)}
                          disabled={index === 0}
                          className="flex-shrink-0"
                        >
                          <MoveUp className="h-4 w-4" />
                          <span className="sr-only">Move up</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMoveDown(image, index, sortedHeroImages.length)}
                          disabled={index === sortedHeroImages.length - 1}
                          className="flex-shrink-0"
                        >
                          <MoveDown className="h-4 w-4" />
                          <span className="sr-only">Move down</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(image)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(image)}>
                              {image.isActive ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Show
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(image)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Hero Image Dialog */}
      <Dialog open={openDialog} onOpenChange={(open) => {
        setOpenDialog(open);
        // if (!open) {
        //   // Clear URL param when closing dialog
        //   if (actionParam === "new") {
        //     navigate("/admin/hero-images"); //Removed navigate call as it is no longer needed here.
        //   }
        // }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedImage ? "Edit Hero Image" : "Add New Hero Image"}</DialogTitle>
            <DialogDescription>
              {selectedImage 
                ? "Update the details of an existing hero image." 
                : "Fill in the details to create a new hero image."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        id="hero-image"
                        accept="image/*"
                        onChange={field.onChange}
                        value={field.value}
                        preview={selectedImage?.imageUrl}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image for the hero slideshow. Recommended size: 1920x500px.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slide title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slide subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter button text (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter button link (e.g., /products)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Enter display order" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first in the slideshow.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-8">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Show or hide this slide on the website.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : selectedImage 
                      ? "Update Hero Image" 
                      : "Create Hero Image"
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Hero Image Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this hero image 
              from the slideshow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedImage) {
                  deleteMutation.mutate(selectedImage.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}