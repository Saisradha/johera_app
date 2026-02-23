import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const Wishlist = () => {
  const { user } = useAuth();
  const { data: items, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Your Wishlist</h1>
        <p className="text-muted-foreground mb-6">Sign in to save your favorites</p>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  if (isLoading) return <div className="px-4 py-6"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="animate-fade-in px-4 py-6">
      <h1 className="font-display text-2xl font-bold mb-6">Your Wishlist</h1>
      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No saved items yet</p>
          <Button variant="outline" asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
              <Link to={`/product/${item.products.slug}`} className="shrink-0 w-20 h-24 rounded-lg bg-accent overflow-hidden">
                {item.products.image_url ? (
                  <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl opacity-30">👗</div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.products.slug}`} className="font-body text-sm font-medium line-clamp-1">{item.products.name}</Link>
                <p className="font-body text-sm font-bold mt-1">₹{item.products.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1"
                    onClick={() => addToCart.mutate({ product_id: item.product_id })}
                  >
                    <ShoppingBag className="h-3 w-3" /> Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-muted-foreground"
                    onClick={() => toggleWishlist.mutate(item.product_id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
