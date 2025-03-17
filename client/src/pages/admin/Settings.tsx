import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSettingSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest, invalidateSettingsCache } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, Building, Phone, Mail, Clock, GithubIcon, Instagram, Facebook, Linkedin, Map, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUpload } from "@/components/ui/file-upload";

type SettingFormValues = z.infer<typeof insertSettingSchema>;

export default function Settings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  
  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });
  
  // Transform settings array to object
  const settingsObj = settings?.reduce((obj: Record<string, string>, setting: any) => {
    obj[setting.key] = setting.value;
    return obj;
  }, {}) || {};
  
  // Company info form
  const companyForm = useForm<SettingFormValues>({
    resolver: zodResolver(insertSettingSchema),
    defaultValues: {
      key: "",
      value: ""
    },
  });
  
  // Contact info form
  const contactForm = useForm<SettingFormValues>({
    resolver: zodResolver(insertSettingSchema),
    defaultValues: {
      key: "",
      value: ""
    },
  });
  
  // Social media form
  const socialForm = useForm<SettingFormValues>({
    resolver: zodResolver(insertSettingSchema),
    defaultValues: {
      key: "",
      value: ""
    },
  });
  
  // Maps form
  const mapsForm = useForm<SettingFormValues>({
    resolver: zodResolver(insertSettingSchema),
    defaultValues: {
      key: "",
      value: ""
    },
  });
  
  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Logo upload mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);
      
      const response = await fetch("/api/admin/settings/logo", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload logo");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      invalidateSettingsCache();
      toast({
        title: "Logo updated",
        description: "Company logo has been updated successfully.",
      });
      setLogoFile(null);
      
      // Force reload the image by adding a timestamp
      if (settingsObj.company_logo) {
        const img = new Image();
        img.src = `${settingsObj.company_logo}?t=${new Date().getTime()}`;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to upload logo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleLogoUpload = () => {
    if (logoFile) {
      uploadLogoMutation.mutate(logoFile);
    } else {
      toast({
        title: "No file selected",
        description: "Please select a logo image file to upload.",
        variant: "destructive",
      });
    }
  };
  
  // Update forms when settings are loaded
  useState(() => {
    if (!isLoading && settings) {
      companyForm.reset({
        key: "company_name",
        value: settingsObj.company_name || ""
      });
      
      contactForm.reset({
        key: "company_address",
        value: settingsObj.company_address || ""
      });
      
      socialForm.reset({
        key: "social_facebook",
        value: settingsObj.social_facebook || ""
      });
      
      mapsForm.reset({
        key: "google_maps_url",
        value: settingsObj.google_maps_url || ""
      });
    }
  }, [isLoading, settings]);
  
  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async (data: SettingFormValues) => {
      const response = await apiRequest("POST", "/api/admin/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Setting updated",
        description: "Setting has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update setting",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Generic save setting handler
  const saveSetting = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };
  
  // Company info submit handler
  const onCompanySubmit = () => {
    saveSetting("company_name", companyForm.getValues().value);
  };
  
  // Contact info submit handlers
  const onAddressSubmit = () => {
    saveSetting("company_address", contactForm.getValues().value);
  };
  
  const onPhoneSubmit = () => {
    saveSetting("company_phone", contactForm.getValues("company_phone"));
  };
  
  const onEmailSubmit = () => {
    saveSetting("company_email", contactForm.getValues("company_email"));
  };
  
  const onHoursSubmit = () => {
    saveSetting("company_hours", contactForm.getValues("company_hours"));
  };
  
  // Social media submit handlers
  const onFacebookSubmit = () => {
    saveSetting("social_facebook", socialForm.getValues().value);
  };
  
  const onInstagramSubmit = () => {
    saveSetting("social_instagram", socialForm.getValues("social_instagram"));
  };
  
  const onLinkedinSubmit = () => {
    saveSetting("social_linkedin", socialForm.getValues("social_linkedin"));
  };
  
  const onWhatsappSubmit = () => {
    saveSetting("social_whatsapp", socialForm.getValues("social_whatsapp"));
  };
  
  // Maps submit handler
  const onMapsSubmit = () => {
    saveSetting("google_maps_url", mapsForm.getValues().value);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Website Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="maps">Google Maps</TabsTrigger>
          </TabsList>
          
          {/* Company Info Tab */}
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company's basic information that will be displayed throughout the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <Form {...companyForm}>
                    <div className="space-y-4">
                      <FormField
                        control={companyForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter company name"
                                  defaultValue={settingsObj.company_name || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onCompanySubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="company_tagline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Company Tagline
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter company tagline"
                                  defaultValue={settingsObj.company_tagline || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={() => saveSetting("company_tagline", field.value)}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              A short tagline or slogan for your company. This appears below the logo in some places.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="border rounded-lg p-4 space-y-4">
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Image className="h-4 w-4 mr-2" />
                            Company Logo
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {settingsObj.company_logo && (
                                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Logo:</div>
                                  <img 
                                    src={settingsObj.company_logo} 
                                    alt="Company Logo" 
                                    className="max-h-24"
                                  />
                                </div>
                              )}
                              
                              <FileUpload
                                id="company-logo"
                                accept="image/*"
                                onChange={setLogoFile}
                                value={logoFile}
                              />
                              
                              <Button
                                type="button"
                                onClick={handleLogoUpload}
                                disabled={uploadLogoMutation.isPending || !logoFile}
                                className="mt-2"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                {uploadLogoMutation.isPending ? "Uploading..." : "Upload Logo"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload your company logo. This will be displayed in the header, footer, and admin panel.
                            Recommended size: 200x200px. Supported formats: PNG, JPG, SVG.
                          </FormDescription>
                        </FormItem>
                      </div>
                      
                    </div>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contact Details Tab */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update your contact details that appear on the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <Form {...contactForm}>
                    <form className="space-y-6">
                      <FormField
                        control={contactForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Address
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Textarea 
                                  placeholder="Enter company address"
                                  defaultValue={settingsObj.company_address || ""}
                                  className="resize-none"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onAddressSubmit}
                                  disabled={updateSettingMutation.isPending}
                                  className="h-auto"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={contactForm.control}
                        name="company_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter phone number"
                                  defaultValue={settingsObj.company_phone || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onPhoneSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={contactForm.control}
                        name="company_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter email address"
                                  defaultValue={settingsObj.company_email || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onEmailSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={contactForm.control}
                        name="company_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Business Hours
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter business hours"
                                  defaultValue={settingsObj.company_hours || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onHoursSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Example: Monday - Saturday: 9:00 AM - 6:00 PM
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Update your social media links that appear on the website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <Form {...socialForm}>
                    <form className="space-y-6">
                      <FormField
                        control={socialForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Facebook className="h-4 w-4 mr-2" />
                              Facebook
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter Facebook URL"
                                  defaultValue={settingsObj.social_facebook || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onFacebookSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Example: https://facebook.com/shivanshienterprises
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialForm.control}
                        name="social_instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Instagram className="h-4 w-4 mr-2" />
                              Instagram
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter Instagram URL"
                                  defaultValue={settingsObj.social_instagram || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onInstagramSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Example: https://instagram.com/shivanshienterprises
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialForm.control}
                        name="social_linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter LinkedIn URL"
                                  defaultValue={settingsObj.social_linkedin || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onLinkedinSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Example: https://linkedin.com/company/shivanshienterprises
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialForm.control}
                        name="social_whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <GithubIcon className="h-4 w-4 mr-2" />
                              WhatsApp Number
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input 
                                  placeholder="Enter WhatsApp number"
                                  defaultValue={settingsObj.social_whatsapp || ""}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onWhatsappSubmit}
                                  disabled={updateSettingMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter with country code. Example: +919876543210
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Google Maps Tab */}
          <TabsContent value="maps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Maps Integration</CardTitle>
                <CardDescription>
                  Update the Google Maps embed URL for the contact page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <Form {...mapsForm}>
                    <form className="space-y-4">
                      <FormField
                        control={mapsForm.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Map className="h-4 w-4 mr-2" />
                              Google Maps Embed URL
                            </FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Textarea 
                                  placeholder="Enter Google Maps embed URL"
                                  defaultValue={settingsObj.google_maps_url || ""}
                                  className="resize-none"
                                  rows={4}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  onClick={onMapsSubmit}
                                  disabled={updateSettingMutation.isPending}
                                  className="h-auto"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Paste the embed URL from Google Maps. Go to Google Maps, select your location, click "Share", select "Embed", and copy the URL from the iframe's src attribute.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {settingsObj.google_maps_url && (
                        <div className="mt-6">
                          <h3 className="text-sm font-medium mb-2">Preview:</h3>
                          <div className="h-64 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <iframe
                              src={settingsObj.google_maps_url}
                              className="w-full h-full border-0"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Google Maps"
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
