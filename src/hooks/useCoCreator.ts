import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CoCreatorDesign {
  id: string;
  user_id: string;
  title: string | null;
  image_url: string;
  source: "sketch" | "upload";
  status: "pending" | "approved" | "rejected";
  product_id: string | null;
  created_at: string;
}

const BUCKET = "co-creator-designs";

export const useHasSubscription = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return false;
      try {
        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .gt("expires_at", new Date().toISOString())
          .maybeSingle();
        if (error) return false;
        return !!data;
      } catch {
        return false;
      }
    },
    enabled: !!user?.id,
  });
};

export type CoCreatorDesignWithProduct = CoCreatorDesign & {
  products?: { slug: string } | null;
};

export const useApprovedDesigns = () => {
  return useQuery({
    queryKey: ["co-creator-designs", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("co_creator_designs")
        .select("*, products(slug)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data ?? []) as CoCreatorDesignWithProduct[];
    },
  });
};

export const useMyDesigns = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["co-creator-designs", "mine", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("co_creator_designs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data ?? []) as CoCreatorDesign[];
    },
    enabled: !!user?.id,
  });
};

export const useSubmitDesign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      imageFile,
      source,
      title,
    }: {
      imageFile: Blob | File;
      source: "sketch" | "upload";
      title?: string;
    }) => {
      if (!user) throw new Error("Sign in to submit designs");

      const ext = imageFile instanceof File ? imageFile.name.split(".").pop() || "png" : "png";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, imageFile, { upsert: true });

      if (uploadErr) throw uploadErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { data, error } = await supabase
        .from("co_creator_designs")
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          source,
          title: title || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data as CoCreatorDesign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["co-creator-designs"] });
    },
  });
};

export const useDeleteDesign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (designId: string) => {
      if (!user) throw new Error("Sign in to delete designs");
      const { error } = await supabase
        .from("co_creator_designs")
        .delete()
        .eq("id", designId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["co-creator-designs"] });
    },
  });
};
