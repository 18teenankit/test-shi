
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layouts/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "wouter";

export default function CategoryProducts() {
  const { id } = useParams();
  
  const { data: category } = useQuery({
    queryKey: [`/api/categories/${id}`],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products", { categoryId: id }],
  });

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground mb-8">
            {category.description}
          </p>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                {product.description && (
                  <p className="text-muted-foreground mt-2">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
