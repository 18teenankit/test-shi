import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactSectionProps {
  language?: "en" | "hi";
}

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactSection({ language = "en" }: ContactSectionProps) {
  const { toast } = useToast();
  
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      requestCallBack: false
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "en" ? "Message sent successfully!" : "संदेश सफलतापूर्वक भेजा गया!",
        description: language === "en" 
          ? "We'll get back to you soon." 
          : "हम जल्द ही आपसे संपर्क करेंगे।",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: language === "en" ? "Failed to send message" : "संदेश भेजने में विफल",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };
  
  const content = {
    en: {
      title: "Contact Us",
      description: "Have questions or need assistance? Reach out to us using any of the methods below.",
      formTitle: "Send Us a Message",
      nameLabel: "Full Name",
      namePlaceholder: "John Doe",
      emailLabel: "Email Address",
      emailPlaceholder: "john@example.com",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+91 98765 43210",
      messageLabel: "Message",
      messagePlaceholder: "How can we help you?",
      sendButton: "Send Message",
      callbackButton: "Get Call Back",
      contactInfo: "Contact Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      hours: "Business Hours",
      connect: "Connect With Us"
    },
    hi: {
      title: "संपर्क करें",
      description: "कोई प्रश्न है या सहायता चाहिए? नीचे दिए गए किसी भी तरीके से हमसे संपर्क करें।",
      formTitle: "हमें संदेश भेजें",
      nameLabel: "पूरा नाम",
      namePlaceholder: "जॉन डो",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "john@example.com",
      phoneLabel: "फोन नंबर",
      phonePlaceholder: "+91 98765 43210",
      messageLabel: "संदेश",
      messagePlaceholder: "हम आपकी कैसे मदद कर सकते हैं?",
      sendButton: "संदेश भेजें",
      callbackButton: "कॉलबैक प्राप्त करें",
      contactInfo: "संपर्क जानकारी",
      address: "पता",
      phone: "फोन",
      email: "ईमेल",
      hours: "कार्य समय",
      connect: "हमसे जुड़ें"
    }
  };
  
  const currentContent = language === "en" ? content.en : content.hi;
  
  return (
    <section id="contact" className="py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{currentContent.title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            {currentContent.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-6">{currentContent.formTitle}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentContent.nameLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={currentContent.namePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentContent.emailLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={currentContent.emailPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentContent.phoneLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={currentContent.phonePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentContent.messageLabel}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={currentContent.messagePlaceholder} 
                            className="resize-none" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending 
                      ? (language === "en" ? "Sending..." : "भेज रहा है...") 
                      : currentContent.sendButton}
                  </Button>
                  
                  <FormField
                    control={form.control}
                    name="requestCallBack"
                    render={({ field }) => (
                      <Button
                        type="button"
                        variant={field.value ? "default" : "secondary"}
                        className={field.value ? "bg-secondary hover:bg-secondary/90" : ""}
                        onClick={() => field.onChange(!field.value)}
                      >
                        {currentContent.callbackButton}
                      </Button>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="h-64 mb-8 rounded-lg overflow-hidden">
              {settings?.google_maps_url ? (
                <iframe
                  src={settings.google_maps_url}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                ></iframe>
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === "en" ? "Map not available" : "नक्शा उपलब्ध नहीं है"}
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">{currentContent.contactInfo}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 bg-primary bg-opacity-10 p-2 rounded-full">
                    <MapPin className="text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{currentContent.address}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.company_address || "123 Industrial Area, Sector 5, Noida, Uttar Pradesh, India"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary bg-opacity-10 p-2 rounded-full">
                    <Phone className="text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{currentContent.phone}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.company_phone || "+91 98765 43210"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary bg-opacity-10 p-2 rounded-full">
                    <Mail className="text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{currentContent.email}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.company_email || "info@shivanshienterprises.com"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary bg-opacity-10 p-2 rounded-full">
                    <Clock className="text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{currentContent.hours}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {settings?.company_hours || "Monday - Saturday: 9:00 AM - 6:00 PM"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="font-medium mb-3">{currentContent.connect}</p>
                <div className="flex space-x-4">
                  {settings?.social_facebook && (
                    <a 
                      href={settings.social_facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 320 512" 
                        className="w-4 h-4 fill-current"
                      >
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                      </svg>
                    </a>
                  )}
                  
                  {settings?.social_instagram && (
                    <a 
                      href={settings.social_instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-pink-600 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 448 512" 
                        className="w-4 h-4 fill-current"
                      >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                      </svg>
                    </a>
                  )}
                  
                  {settings?.social_linkedin && (
                    <a 
                      href={settings.social_linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-700 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 448 512" 
                        className="w-4 h-4 fill-current"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                      </svg>
                    </a>
                  )}
                  
                  {settings?.social_whatsapp && (
                    <a 
                      href={`https://wa.me/${settings.social_whatsapp.replace(/\D/g, "")}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 448 512" 
                        className="w-4 h-4 fill-current"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
