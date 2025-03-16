import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Package, 
  Layers, 
  Image, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Fetch stats data
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
  const { data: heroImages, isLoading: heroImagesLoading } = useQuery({
    queryKey: ["/api/admin/hero-images"],
  });
  
  const { data: contactRequests, isLoading: contactRequestsLoading } = useQuery({
    queryKey: ["/api/admin/contact-requests"],
  });
  
  const isLoading = categoriesLoading || productsLoading || heroImagesLoading || contactRequestsLoading;
  
  // Calculate stats
  const stats = {
    products: products?.length || 0,
    categories: categories?.length || 0,
    heroImages: heroImages?.length || 0,
    contactRequests: contactRequests?.length || 0,
    outOfStockProducts: products?.filter((p: any) => !p.inStock).length || 0,
    newContactRequests: contactRequests?.filter((r: any) => r.status === "new").length || 0
  };
  
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    href, 
    loading 
  }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode; 
    href: string; 
    loading: boolean;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
        <Link href={href}>
          <Button variant="link" className="p-0 h-auto mt-1 text-sm">
            View details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Products" 
            value={stats.products} 
            icon={<Package className="h-5 w-5 text-muted-foreground" />} 
            href="/admin/products" 
            loading={isLoading}
          />
          
          <StatCard 
            title="Categories" 
            value={stats.categories} 
            icon={<Layers className="h-5 w-5 text-muted-foreground" />} 
            href="/admin/categories" 
            loading={isLoading}
          />
          
          <StatCard 
            title="Hero Images" 
            value={stats.heroImages} 
            icon={<Image className="h-5 w-5 text-muted-foreground" />} 
            href="/admin/hero-images" 
            loading={isLoading}
          />
          
          <StatCard 
            title="Contact Requests" 
            value={stats.contactRequests} 
            icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />} 
            href="/admin/contact-requests" 
            loading={isLoading}
          />
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* Alerts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Alerts</h2>
            
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                {stats.outOfStockProducts > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Out of Stock Items</AlertTitle>
                    <AlertDescription>
                      There are {stats.outOfStockProducts} products currently out of stock.
                      <Link href="/admin/products">
                        <Button variant="link" className="p-0 h-auto ml-2">
                          View products
                        </Button>
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
                
                {stats.newContactRequests > 0 && (
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertTitle>New Contact Requests</AlertTitle>
                    <AlertDescription>
                      You have {stats.newContactRequests} new contact requests that need attention.
                      <Link href="/admin/contact-requests">
                        <Button variant="link" className="p-0 h-auto ml-2">
                          View requests
                        </Button>
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
                
                {stats.outOfStockProducts === 0 && stats.newContactRequests === 0 && (
                  <Alert variant="default" className="border-green-200 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>All Systems Operational</AlertTitle>
                    <AlertDescription>
                      Everything is running smoothly. No immediate actions required.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
            <Tabs defaultValue="products">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="space-y-4 mt-4">
                <div className="grid gap-2 grid-cols-2">
                  <Link href="/admin/products">
                    <Button className="w-full" variant="outline">View Products</Button>
                  </Link>
                  <Link href="/admin/products?action=new">
                    <Button className="w-full">Add Product</Button>
                  </Link>
                </div>
                
                {!isLoading && products && products.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Latest Products</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {products.slice(0, 3).map((product: any) => (
                          <li key={product.id} className="p-3 flex items-center justify-between">
                            <span className="truncate max-w-[200px]">{product.name}</span>
                            <div className="flex items-center">
                              <span className={`inline-block h-2 w-2 rounded-full mr-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="text-xs text-muted-foreground">
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="categories" className="space-y-4 mt-4">
                <div className="grid gap-2 grid-cols-2">
                  <Link href="/admin/categories">
                    <Button className="w-full" variant="outline">View Categories</Button>
                  </Link>
                  <Link href="/admin/categories?action=new">
                    <Button className="w-full">Add Category</Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="hero" className="space-y-4 mt-4">
                <div className="grid gap-2 grid-cols-2">
                  <Link href="/admin/hero-images">
                    <Button className="w-full" variant="outline">View Hero Images</Button>
                  </Link>
                  <Link href="/admin/hero-images?action=new">
                    <Button className="w-full">Add Hero Image</Button>
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid gap-2 grid-cols-2">
                  <Link href="/admin/contact-requests">
                    <Button className="w-full" variant="outline">View Requests</Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button className="w-full">Manage Settings</Button>
                  </Link>
                </div>
                
                {!isLoading && contactRequests && contactRequests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Contact Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {contactRequests.slice(0, 3).map((request: any) => (
                          <li key={request.id} className="p-3 flex items-center justify-between">
                            <span className="truncate max-w-[200px]">{request.name}</span>
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                request.status === 'new' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
