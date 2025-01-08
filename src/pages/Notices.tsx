import { ArrowLeft, Bell, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";

const Notices = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    category: "",
  });

  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addNoticeMutation = useMutation({
    mutationFn: async (noticeData: any) => {
      const { data, error } = await supabase.from("notices").insert([
        {
          ...noticeData,
          posted_by: profile?.id,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      setIsAddingNotice(false);
      setNewNotice({
        title: "",
        content: "",
        category: "",
      });
      toast({
        title: "Success",
        description: "Notice added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add notice",
        variant: "destructive",
      });
    },
  });

  const handleAddNotice = () => {
    addNoticeMutation.mutate(newNotice);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
            </div>
            {profile?.is_admin && (
              <Dialog open={isAddingNotice} onOpenChange={setIsAddingNotice}>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Notice
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Notice</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newNotice.title}
                        onChange={(e) =>
                          setNewNotice({ ...newNotice, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newNotice.category}
                        onChange={(e) =>
                          setNewNotice({ ...newNotice, category: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newNotice.content}
                        onChange={(e) =>
                          setNewNotice({ ...newNotice, content: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={handleAddNotice}>Add Notice</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : notices?.length === 0 ? (
            <div className="text-center text-gray-500">No notices found</div>
          ) : (
            notices?.map((notice) => (
              <div key={notice.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notice.title}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notice.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {notice.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Posted by: {notice.profiles?.full_name || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Notices;