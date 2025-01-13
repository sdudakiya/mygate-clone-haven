import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data.map((r) => r.role);
    },
  });

  const isAdmin = roles.includes("admin");
  const isSecurity = roles.includes("security");
  const isUnitOwner = roles.includes("unit_owner");

  return {
    roles,
    isAdmin,
    isSecurity,
    isUnitOwner,
    isLoading,
  };
};