import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Role = "admin" | "security" | "unit_owner";

interface UserWithRoles {
  id: string;
  full_name: string | null;
  email: string | null;
  roles: Role[];
}

const UserRoleManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<Role | "">("");

  // Fetch all users and their current roles
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Get all profiles (RLS will ensure only admins can access this)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
      if (profilesError) throw profilesError;

      // Get all roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
      if (rolesError) throw rolesError;

      // Map profiles with their roles
      return profiles.map((profile): UserWithRoles => {
        return {
          id: profile.id,
          full_name: profile.full_name,
          email: null, // We can't get emails directly due to auth restrictions
          roles: roles
            .filter((role) => role.user_id === profile.id)
            .map((role) => role.role as Role),
        };
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: Role;
    }) => {
      // First check if the role already exists
      const { data: existingRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", role);

      // If role doesn't exist, insert it
      if (!existingRoles?.length) {
        const { error } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: role,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
      setSelectedRole("");
    },
    onError: (error) => {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: Role;
    }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "Role removed successfully",
      });
    },
    onError: (error) => {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    },
  });

  if (isLoadingUsers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manage User Roles</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Current Roles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || "Unnamed User"}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {user.roles?.map((role: Role) => (
                    <div
                      key={role}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {role}
                      <button
                        onClick={() =>
                          removeRoleMutation.mutate({ userId: user.id, role })
                        }
                        className="hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as Role)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="unit_owner">Unit Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      if (selectedRole) {
                        assignRoleMutation.mutate({
                          userId: user.id,
                          role: selectedRole as Role,
                        });
                      }
                    }}
                    disabled={!selectedRole}
                    size="sm"
                  >
                    Assign
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserRoleManager;
