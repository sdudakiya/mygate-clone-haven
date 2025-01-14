import { ArrowLeft, UserPlus, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
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
import { VisitorList } from "@/components/visitors/VisitorList";

const Visitors = () => {
  const { profile, session } = useAuth();
  const { isSecurity } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const [isAddingVisitor, setIsAddingVisitor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newVisitor, setNewVisitor] = useState({
    visitor_name: "",
    purpose: "",
    expected_arrival: "",
    unit_number: "",
  });

  const { data: visitors, isLoading } = useQuery({
    queryKey: ["visitors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch visitors",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!session,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    let mounted = true;
    let currentChannel: any = null;

    const setupRealtimeSubscription = async () => {
      if (!session || !mounted) return;

      try {
        // Clean up existing subscription if any
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        // Create new subscription
        const channel = supabase.channel('visitors-changes', {
          config: {
            broadcast: { self: true },
            presence: { key: session.user.id },
          },
        });

        currentChannel = channel;
        channelRef.current = channel;

        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'visitors'
            },
            (payload) => {
              if (mounted) {
                console.log('Change received!', payload);
                queryClient.invalidateQueries({ queryKey: ["visitors"] });
              }
            }
          )
          .subscribe(async (status) => {
            if (!mounted) return;

            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to visitors changes');
            }
            if (status === 'CLOSED') {
              console.log('Subscription closed');
            }
            if (status === 'CHANNEL_ERROR') {
              console.error('Error in channel subscription');
              if (mounted) {
                toast({
                  title: "Connection Error",
                  description: "Failed to connect to real-time updates",
                  variant: "destructive",
                });
              }
            }
          });
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
        if (mounted) {
          toast({
            title: "Connection Error",
            description: "Failed to setup real-time updates",
            variant: "destructive",
          });
        }
      }
    };

    setupRealtimeSubscription();

    // Cleanup function
    return () => {
      mounted = false;
      const cleanup = async () => {
        if (currentChannel) {
          try {
            await supabase.removeChannel(currentChannel);
          } catch (error) {
            console.error('Error cleaning up channel:', error);
          }
          currentChannel = null;
          channelRef.current = null;
        }
      };
      cleanup();
    };
  }, [session, queryClient, toast]);

  const addVisitorMutation = useMutation({
    mutationFn: async (visitorData: any) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { data, error } = await supabase.from("visitors").insert([
        {
          ...visitorData,
          host_id: isSecurity ? null : profile?.id,
          unit_number: isSecurity ? visitorData.unit_number : profile?.unit_number,
          otp: otp,
        },
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      setIsAddingVisitor(false);
      setNewVisitor({
        visitor_name: "",
        purpose: "",
        expected_arrival: "",
        unit_number: "",
      });
      toast({
        title: "Success",
        description: "Visitor added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add visitor",
        variant: "destructive",
      });
    },
  });

  const handleAddVisitor = () => {
    if (!newVisitor.visitor_name || !newVisitor.purpose || !newVisitor.expected_arrival || (isSecurity && !newVisitor.unit_number)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addVisitorMutation.mutate(newVisitor);
  };

  const filteredVisitors = visitors?.filter((visitor) =>
    visitor.visitor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = () => {
    queryClient.invalidateQueries({ queryKey: ["visitors"] });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Visitors</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search visitors..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Dialog open={isAddingVisitor} onOpenChange={setIsAddingVisitor}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center justify-center gap-2 p-4"
                variant="default"
              >
                <UserPlus className="h-6 w-6" />
                <span>Add Visitor</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Visitor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="visitor_name">Visitor Name</Label>
                  <Input
                    id="visitor_name"
                    value={newVisitor.visitor_name}
                    onChange={(e) =>
                      setNewVisitor({
                        ...newVisitor,
                        visitor_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    value={newVisitor.purpose}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, purpose: e.target.value })
                    }
                  />
                </div>
                {isSecurity && (
                  <div>
                    <Label htmlFor="unit_number">Unit Number</Label>
                    <Input
                      id="unit_number"
                      value={newVisitor.unit_number}
                      onChange={(e) =>
                        setNewVisitor({
                          ...newVisitor,
                          unit_number: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="expected_arrival">Expected Arrival</Label>
                  <Input
                    id="expected_arrival"
                    type="datetime-local"
                    value={newVisitor.expected_arrival}
                    onChange={(e) =>
                      setNewVisitor({
                        ...newVisitor,
                        expected_arrival: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleAddVisitor}>Add Visitor</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2 p-4"
          >
            <Clock className="h-6 w-6" />
            <span>Pre-approve</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Visitors</h2>
          </div>
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <VisitorList visitors={filteredVisitors || []} onVerify={handleVerify} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Visitors;
