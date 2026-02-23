import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    slug: string;
  };
}

export const useWishlist = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*, products(id, name, price, original_price, image_url, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });
};

export const useToggleWishlist = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (product_id: string) => {
      if (!user) throw new Error("Please sign in to save items");
      // Check if exists
      const { data } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product_id)
        .maybeSingle();
      if (data) {
        await supabase.from("wishlist_items").delete().eq("id", data.id);
        return { added: false };
      } else {
        await supabase.from("wishlist_items").insert({ user_id: user.id, product_id });
        return { added: true };
      }
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: result.added ? "Added to wishlist ♥" : "Removed from wishlist" });
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
};

export const useIsInWishlist = (product_id: string) => {
  const { data: wishlist } = useWishlist();
  return wishlist?.some((item) => item.product_id === product_id) ?? false;
};
