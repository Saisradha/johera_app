import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useFeaturedProducts,
  useTrendingProducts,
  useCategories,
} from "@/hooks/useProducts";

const categoryEmojis: Record<string, string> = {
  lehengas: "👗",
  "coord-sets": "✨",
  streetwear: "🔥",
};

const Index = () => {
  const { data: featured, isLoading: fl } = useFeaturedProducts();
  const { data: trending, isLoading: tl } = useTrendingProducts();
  const { data: categories } = useCategories();

  return (
    <div className="animate-fade-in">
      {/* Hero - matches johera.in */}
      <section className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Luxury Meets Culture
        </h1>
        <p className="font-display text-lg md:text-xl text-muted-foreground">
          For Everyone
        </p>
        <Link
          to="/products"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10 transition-colors hover:bg-primary/90"
        >
          Shop Collection
        </Link>
      </section>

      {/* Shop by Category (moved above Featured) */}
      <section className="px-4 py-10">
        <h2 className="mb-4 text-center font-display text-2xl font-semibold">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/products/${cat.slug}`}
              className="rounded-2xl bg-accent px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl">
                    {categoryEmojis[cat.slug] ?? "🧵"}
                  </p>
                  <p className="font-display text-sm font-semibold">
                    {cat.name}
                  </p>
                </div>
                <span className="text-xs text-primary underline-offset-2 hover:underline">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-10">
        <h2 className="font-display text-2xl font-semibold mb-6">
          Featured Picks
        </h2>
        {fl ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featured?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section className="px-4 py-10">
        <h2 className="font-display text-2xl font-semibold mb-6">
          Trending Now
        </h2>
        {tl ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trending?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Our Collections (moved below Trending) */}
      <section className="px-4 py-12">
        <h2 className="mb-2 text-center font-display text-2xl font-semibold">
          Our Collections
        </h2>
        <p className="mb-8 text-center text-xs text-muted-foreground">
          Discover the lines that define Johera.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-accent px-5 py-4">
            <div>
              <h3 className="font-display text-sm font-semibold">
                The Streetwear Line
              </h3>
              <p className="text-xs text-muted-foreground">Bold, Graphic</p>
            </div>
            <Link
              to="/products/streetwear"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Explore
            </Link>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-accent px-5 py-4">
            <div>
              <h3 className="font-display text-sm font-semibold">
                The Luxury Line
              </h3>
              <p className="text-xs text-muted-foreground">Minimal, Premium</p>
            </div>
            <Link
              to="/products/luxury"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Explore
            </Link>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-accent px-5 py-4">
            <div>
              <h3 className="font-display text-sm font-semibold">
                The Ethnic Edit
              </h3>
              <p className="text-xs text-muted-foreground">Elegant, Occasion</p>
            </div>
            <Link
              to="/products/ethnic"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Explore
            </Link>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-primary/10 px-5 py-4 border border-primary/20">
            <div>
              <h3 className="font-display text-sm font-semibold">
                Co-creators
              </h3>
              <p className="text-xs text-muted-foreground">Sketch & sell your designs</p>
            </div>
            <Link
              to="/co-creators"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Create
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 text-center">
        <Link
          to="/stories"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Read Our Stories →
        </Link>
      </section>

      {/* About Johera */}
      <section className="border-t border-border bg-accent/40 px-4 py-12">
        <h2 className="mb-3 text-center font-display text-2xl font-semibold">
          About Johera
        </h2>
        <p className="mx-auto max-w-md text-center text-sm text-muted-foreground">
          Johera isn&apos;t just a brand. We merge streetwear, ethnic elegance,
          and luxury detailing. No peace, no rest until Johera is in your
          closet!
        </p>
      </section>
    </div>
  );
};

export default Index;
