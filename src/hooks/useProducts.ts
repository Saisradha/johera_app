import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  story: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  images: string[];
  category_id: string | null;
  mythology_theme: string | null;
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export type ProductWithCategory = Product & { categories: { name: string; slug: string } | null };

export const useProducts = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["products", categorySlug],
    queryFn: async () => {
      let query;
      if (categorySlug) {
        query = supabase
          .from("products")
          .select("*, categories!inner(name, slug)")
          .eq("categories.slug", categorySlug);
      } else {
        query = supabase.from("products").select("*, categories(name, slug)");
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithCategory[];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as unknown as ProductWithCategory;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_featured", true)
        .limit(6);
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithCategory[];
    },
  });
};

export const useTrendingProducts = () => {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_trending", true)
        .limit(6);
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithCategory[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data as Category[];
    },
  });
};
