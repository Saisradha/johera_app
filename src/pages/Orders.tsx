import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-secondary/20 text-secondary",
  confirmed: "bg-primary/20 text-primary",
  shipped: "bg-primary/30 text-primary",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-destructive/20 text-destructive",
};

const Orders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-6">Sign in to view orders</p>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  if (isLoading) return <div className="px-4 py-6"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="animate-fade-in px-4 py-6">
      <h1 className="font-display text-2xl font-bold mb-6">Order History</h1>
      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Button variant="outline" asChild><Link to="/products">Start Shopping</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                  {order.status}
                </span>
              </div>
              <p className="font-body text-sm font-bold">₹{Number(order.total_amount).toLocaleString()}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Order #{order.id.slice(0, 8)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
