import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useAddToCart } from "@/hooks/useCart";
import { useToggleWishlist, useIsInWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id: slug } = useParams();
  const { data: product, isLoading } = useProduct(slug ?? "");
  const { user } = useAuth();
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const isInWishlist = useIsInWishlist(product?.id ?? "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (isLoading) {
    return (
      <div className="px-4 py-6 space-y-4">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <span className="text-5xl mb-4">😕</span>
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button variant="outline" asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="animate-fade-in pb-24">
      {/* Back button */}
      <div className="px-4 py-3">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Image */}
      <div className="aspect-[3/4] bg-accent flex items-center justify-center mx-4 rounded-2xl overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl opacity-30">👗</span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-6 space-y-4">
        <div>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.categories?.name} · {product.mythology_theme}
          </p>
          <h1 className="font-display text-2xl font-bold">{product.name}</h1>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <>
              <span className="text-base text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
              <span className="text-sm font-medium text-secondary">-{discount}%</span>
            </>
          )}
        </div>

        {/* Story */}
        {product.story && (
          <blockquote className="font-story text-base italic text-muted-foreground border-l-2 border-primary/30 pl-4">
            {product.story}
          </blockquote>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div>
            <p className="font-body text-sm font-medium mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    selectedSize === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-card-foreground hover:border-primary/50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div>
            <p className="font-body text-sm font-medium mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    selectedColor === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-card-foreground hover:border-primary/50"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div>
            <p className="font-body text-sm font-medium mb-1">Description</p>
            <p className="font-body text-sm text-muted-foreground">{product.description}</p>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-background/90 backdrop-blur border-t border-border px-4 py-3 flex gap-3">
        {user && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleWishlist.mutate(product.id)}
            className="shrink-0"
          >
            <Heart className={cn("h-5 w-5", isInWishlist && "fill-primary text-primary")} />
          </Button>
        )}
        <Button
          className="flex-1 gap-2"
          onClick={() => {
            if (!user) {
              window.location.href = "/login";
              return;
            }
            addToCart.mutate({
              product_id: product.id,
              selected_size: selectedSize || undefined,
              selected_color: selectedColor || undefined,
            });
          }}
          disabled={addToCart.isPending}
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
