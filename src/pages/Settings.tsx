import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    unit_number: profile?.unit_number || "",
    phone_number: profile?.phone_number || "",
  });

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="unit_number">Unit Number</Label>
                  <Input
                    id="unit_number"
                    value={formData.unit_number}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_number: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {profile?.full_name || "Not set"}
                </p>
                <p>
                  <span className="font-medium">Unit Number:</span>{" "}
                  {profile?.unit_number || "Not set"}
                </p>
                <p>
                  <span className="font-medium">Phone Number:</span>{" "}
                  {profile?.phone_number || "Not set"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Notifications</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <Shield className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Privacy & Security</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50">
              <HelpCircle className="h-6 w-6 text-gray-600" />
              <span className="flex-1 text-left">Help & Support</span>
            </button>
            <button
              onClick={signOut}
              className="w-full p-4 flex items-center space-x-4 text-red-600 hover:bg-gray-50"
            >
              <LogOut className="h-6 w-6" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;