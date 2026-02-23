import { Link } from "react-router-dom";
import { useFeaturedProducts, useTrendingProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: featured, isLoading: fl } = useFeaturedProducts();
  const { data: trending, isLoading: tl } = useTrendingProducts();
  const { data: categories } = useCategories();

  const categoryEmojis: Record<string, string> = {
    lehengas: "👗",
    "coord-sets": "✨",
    streetwear: "🔥",
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 py-20 text-center bg-accent">
        <span className="font-story text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Where Mythology Meets Fashion
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-4">
          JOHERA
        </h1>
        <p className="font-body text-base text-muted-foreground max-w-sm mb-8">
          Contemporary silhouettes inspired by Indian epics — for the modern woman who wears her heritage with pride.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore Collections
        </Link>
      </section>

      {/* Categories */}
      <section className="px-4 py-10">
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">Shop by Style</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products/${cat.slug}`}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-card border border-border p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{categoryEmojis[cat.slug] ?? "🛍️"}</span>
              <span className="font-body text-sm font-medium text-card-foreground">{cat.name}</span>
            </Link>
          ))}
          <Link
            to="/products"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-card border border-border p-6 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-3xl">🆕</span>
            <span className="font-body text-sm font-medium text-card-foreground">All Products</span>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-10">
        <h2 className="font-display text-2xl font-semibold mb-6">Featured Pieces</h2>
        {fl ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featured?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Story teaser */}
      <section className="px-4 py-10 bg-accent">
        <h2 className="font-display text-2xl font-semibold mb-2 text-center">The Story Behind the Stitch</h2>
        <p className="font-story text-base italic text-muted-foreground text-center max-w-md mx-auto mb-6">
          "Every garment carries a verse from the Mahabharata — woven into fabric, worn as armour."
        </p>
        <div className="text-center">
          <Link to="/stories" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Read Our Stories →
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="px-4 py-10">
        <h2 className="font-display text-2xl font-semibold mb-6">Trending Now</h2>
        {tl ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trending?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
