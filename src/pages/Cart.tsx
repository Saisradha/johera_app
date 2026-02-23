import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { user } = useAuth();
  const { data: items, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground mb-6">Sign in to view your cart</p>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="px-4 py-6"><p className="text-muted-foreground">Loading...</p></div>;
  }

  const subtotal = items?.reduce((sum, item) => sum + item.products.price * item.quantity, 0) ?? 0;

  return (
    <div className="animate-fade-in px-4 py-6 pb-44">
      <h1 className="font-display text-2xl font-bold mb-6">Your Cart</h1>

      {!items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button variant="outline" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
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
                <Link to={`/product/${item.products.slug}`} className="font-body text-sm font-medium line-clamp-1">
                  {item.products.name}
                </Link>
                {(item.selected_size || item.selected_color) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {[item.selected_size, item.selected_color].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="font-body text-sm font-bold mt-1">₹{item.products.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                    className="rounded-md border border-border p-1 hover:bg-accent"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                    className="rounded-md border border-border p-1 hover:bg-accent"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    className="ml-auto rounded-md p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky checkout bar */}
      {items && items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-30 bg-background/90 backdrop-blur border-t border-border px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold">₹{subtotal.toLocaleString()}</span>
          </div>
          <Button className="w-full" asChild>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
