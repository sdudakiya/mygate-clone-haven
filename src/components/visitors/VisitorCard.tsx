import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface VisitorCardProps {
  visitor: {
    id: string;
    visitor_name: string;
    purpose: string;
    expected_arrival: string;
    status: string;
    otp?: string;
    otp_verified_at?: string;
  };
  onVerify: () => void;
}

export const VisitorCard: React.FC<VisitorCardProps> = ({ visitor, onVerify }) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('visitors')
        .update({
          status: 'approved',
          otp_verified_at: new Date().toISOString(),
          otp_verified_by: profile?.id
        })
        .eq('id', visitor.id)
        .eq('otp', otp);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Visitor verified successfully",
      });
      onVerify();
      setIsVerifying(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  const handleSecurityApproval = async () => {
    try {
      const { error } = await supabase
        .from('visitors')
        .update({
          status: 'approved',
          otp_verified_at: new Date().toISOString(),
          otp_verified_by: profile?.id
        })
        .eq('id', visitor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Visitor approved successfully",
      });
      onVerify();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve visitor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 flex items-center justify-between border-b">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div>
          <h3 className="font-medium">{visitor.visitor_name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(visitor.expected_arrival).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{visitor.purpose}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            visitor.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
        </span>
        {visitor.status !== 'approved' && (
          <>
            <Dialog open={isVerifying} onOpenChange={setIsVerifying}>
              <DialogTrigger asChild>
                <Button variant="outline">Verify OTP</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Visitor OTP</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <React.Fragment key={index}>
                            <InputOTPSlot {...slot} />
                            {index !== slots.length - 1 && <InputOTPSeparator />}
                          </React.Fragment>
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                  <Button onClick={handleVerifyOTP}>Verify</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSecurityApproval}>Security Approve</Button>
          </>
        )}
      </div>
    </div>
  );
};