import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart, useClearCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { user } = useAuth();
  const { data: cartItems } = useCart();
  const clearCart = useClearCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: "", line1: "", city: "", state: "", pincode: "", phone: "" });

  const subtotal = cartItems?.reduce((sum, item) => sum + item.products.price * item.quantity, 0) ?? 0;

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button variant="outline" onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.name || !address.line1 || !address.city || !address.pincode || !address.phone) {
      toast({ title: "Please fill all address fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Create order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: subtotal,
          status: "confirmed",
          shipping_address: address,
          payment_method: "COD",
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.products.price,
        selected_size: item.selected_size,
        selected_color: item.selected_color,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      // Clear cart
      await clearCart.mutateAsync();

      toast({ title: "Order placed successfully! 🎉" });
      navigate("/orders");
    } catch (err: any) {
      toast({ title: "Error placing order", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in px-4 py-6 pb-32">
      <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

      {/* Order summary */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <h2 className="font-body text-sm font-medium mb-3">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span className="text-muted-foreground">{item.products.name} × {item.quantity}</span>
            <span>₹{(item.products.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold border-t border-border pt-2 mt-2">
          <span>Total</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Shipping address */}
      <h2 className="font-body text-sm font-medium mb-3">Shipping Address</h2>
      <div className="space-y-3 mb-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="line1">Address Line</Label>
          <Input id="line1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <h2 className="font-body text-sm font-medium mb-2">Payment Method</h2>
        <p className="text-sm text-muted-foreground">Cash on Delivery (COD)</p>
      </div>

      <Button className="w-full" onClick={handlePlaceOrder} disabled={loading}>
        {loading ? "Placing Order..." : `Place Order · ₹${subtotal.toLocaleString()}`}
      </Button>
    </div>
  );
};

export default Checkout;
