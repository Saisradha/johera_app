import { useParams, Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Products = () => {
  const { category } = useParams();
  const { data: products, isLoading } = useProducts(category);
  const { data: categories } = useCategories();

  return (
    <div className="animate-fade-in">
      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
        <Link
          to="/products"
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors",
            !category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"
          )}
        >
          All
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products/${cat.slug}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors",
              category === cat.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="px-4 pb-6">
        <h1 className="font-display text-2xl font-bold mb-1">
          {category
            ? categories?.find((c) => c.slug === category)?.name ?? "Products"
            : "All Products"}
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          {products?.length ?? 0} {(products?.length ?? 0) === 1 ? "piece" : "pieces"}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
