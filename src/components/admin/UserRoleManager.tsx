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

type Role = "admin" | "security" | "unit_owner";

const UserRoleManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | "">("");

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("user_roles").insert({
        user_id: selectedUser,
        role: selectedRole as Role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
      setSelectedUser("");
      setSelectedRole("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Assign User Roles</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select User</label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Role</label>
          <Select value={selectedRole} onValueChange={setSelectedRole as (value: string) => void}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="unit_owner">Unit Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => assignRoleMutation.mutate()}
          disabled={!selectedUser || !selectedRole}
        >
          Assign Role
        </Button>
      </div>
    </div>
  );
};

export default UserRoleManager;