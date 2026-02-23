import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: Record<string, string> | null;
  payment_method: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  selected_size: string | null;
  selected_color: string | null;
  products: {
    id: string;
    name: string;
    image_url: string | null;
    slug: string;
  };
}

export const useOrders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });
};

export const useOrderItems = (orderId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["order-items", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*, products(id, name, image_url, slug)")
        .eq("order_id", orderId);
      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!user && !!orderId,
  });
};
