import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill?: { email?: string };
}

interface RazorpayInstance {
  open: () => void;
}

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: 299,
    period: "month",
    features: ["Unlimited design submissions", "Sketch & upload", "Priority review", "Co-creators access"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 2499,
    period: "year",
    savings: "Save 30%",
    features: ["Everything in Monthly", "12 months access", "Early access to new features", "Exclusive badges"],
  },
];

const Subscribe = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const loadRazorpay = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan: (typeof PLANS)[0]) => {
    if (!user) {
      toast({ title: "Please sign in first", variant: "destructive" });
      return;
    }

    setLoading(plan.id);

    try {
      await loadRazorpay();

      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          plan: plan.id,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Johera",
        description: `Co-creators ${plan.name}`,
        order_id: data.orderId,
        prefill: { email: user.email || undefined },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${apiBase}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Verification failed");
            }

            toast({ title: "Subscription activated! Welcome to Co-creators." });
            window.location.href = "/co-creators";
          } catch (e) {
            toast({ title: "Verification failed", description: (e as Error).message, variant: "destructive" });
          } finally {
            setLoading(null);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-3">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">Subscribe to Co-creators</h1>
        <p className="text-muted-foreground text-sm mb-6 text-center">Sign in to subscribe</p>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-4 py-6 pb-24">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold">Co-creators Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Subscribe to submit designs, get them approved, and sell them.
        </p>
      </div>

      <div className="space-y-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl border border-border bg-card p-5 overflow-hidden"
          >
            {plan.savings && (
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full inline-block mb-3">
                {plan.savings}
              </div>
            )}
            <h2 className="font-display text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1">
              <span className="text-2xl font-bold">₹{plan.price.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm">/{plan.period}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full mt-5"
              onClick={() => handleSubscribe(plan)}
              disabled={loading !== null}
            >
              {loading === plan.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Subscribe — ₹{plan.price}
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Secure payment via Razorpay. Cancel anytime.
      </p>
    </div>
  );
};

export default Subscribe;
