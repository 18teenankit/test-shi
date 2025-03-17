
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layouts/Layout";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function Products() {
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products by Category</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                {category.image && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  {category.description && (
                    <p className="text-muted-foreground mt-2">
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
