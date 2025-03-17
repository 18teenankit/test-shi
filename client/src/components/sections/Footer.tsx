import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "@/components/ui/logo";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Category } from "@shared/schema";

interface FooterProps {}

export function Footer({}: FooterProps) {
  const { data: settings = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const content = {
    description: "Your trusted partner for high-quality chemicals and compounds across India. Quality, safety, and reliability.",
    products: "Products",
    quickLinks: "Quick Links",
    home: "Home",
    about: "About Us",
    contact: "Contact",
    terms: "Terms & Conditions",
    contactInfo: "Contact Info",
    allRights: "All rights reserved.",
    privacy: "Privacy Policy",
    termsOfService: "Terms of Service"
  };
  
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Logo />
              <h3 className="text-xl font-semibold ml-2">
                {settings?.company_name || "Shivanshi Enterprises"}
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              {content.description}
            </p>
            <div className="flex space-x-4">
              {settings?.social_facebook && (
                <a 
                  href={settings.social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 320 512" 
                    className="h-5 w-5 fill-current"
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
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 448 512" 
                    className="h-5 w-5 fill-current"
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
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 448 512" 
                    className="h-5 w-5 fill-current"
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
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 448 512" 
                    className="h-5 w-5 fill-current"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{content.products}</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.id}`} className="text-gray-300 hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{content.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {content.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {content.about}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {content.contact}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  {content.terms}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{content.contactInfo}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3" />
                <span>
                  {settings?.company_address || "123 Industrial Area, Sector 5, Noida, Uttar Pradesh, India"}
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-3" />
                <span>{settings?.company_phone || "+91 98765 43210"}</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-3" />
                <span>{settings?.company_email || "info@shivanshienterprises.com"}</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mt-1 mr-3" />
                <span>{settings?.company_hours || "Mon - Sat: 9:00 AM - 6:00 PM"}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {settings?.company_name || "Shivanshi Enterprises"}. {content.allRights}
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
                {content.privacy}
              </Link>
              <Link href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
                {content.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
