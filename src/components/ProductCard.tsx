import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { useToggleWishlist, useIsInWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const toggleWishlist = useToggleWishlist();
  const isInWishlist = useIsInWishlist(product.id);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative rounded-xl overflow-hidden bg-card border border-border transition-shadow hover:shadow-lg">
      {/* Wishlist button */}
      {user && (
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist.mutate(product.id);
          }}
          className="absolute top-2 right-2 z-10 rounded-full bg-background/80 backdrop-blur p-1.5 transition-colors hover:bg-background"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={cn("h-4 w-4", isInWishlist ? "fill-primary text-primary" : "text-muted-foreground")}
          />
        </button>
      )}

      {/* Discount badge */}
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
          -{discount}%
        </span>
      )}

      <Link to={`/product/${product.slug}`}>
        {/* Image */}
        <div className="aspect-[3/4] bg-accent flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
          ) : (
            <span className="text-4xl opacity-30">👗</span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.mythology_theme}
          </p>
          <h3 className="font-display text-sm font-semibold text-card-foreground line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-body text-sm font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            {product.original_price && (
              <span className="font-body text-xs text-muted-foreground line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
