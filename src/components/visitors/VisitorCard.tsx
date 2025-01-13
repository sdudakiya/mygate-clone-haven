import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from '@/hooks/use-user-role';
import { Share2 } from 'lucide-react';

interface VisitorCardProps {
  visitor: {
    id: string;
    visitor_name: string;
    purpose: string;
    expected_arrival: string;
    status: string;
    otp?: string;
    unit_number: string;
    host_id?: string;
    otp_verified_at?: string;
  };
  onVerify: () => void;
}

export const VisitorCard: React.FC<VisitorCardProps> = ({ visitor, onVerify }) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { isSecurity, isUnitOwner } = useUserRole();
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

  const handleApproval = async () => {
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

  const handleShare = async () => {
    if (visitor.otp) {
      await navigator.clipboard.writeText(
        `Your OTP for visiting is: ${visitor.otp}. Please show this to security upon arrival.`
      );
      toast({
        title: "Success",
        description: "OTP copied to clipboard",
      });
    }
  };

  const showApproveButton = isUnitOwner && !visitor.host_id && visitor.status !== 'approved';
  const showShareButton = isUnitOwner && visitor.host_id === profile?.id && visitor.otp;
  const showVerifyButton = isSecurity && visitor.status !== 'approved';

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
          {isSecurity && (
            <p className="text-sm text-gray-500">Unit: {visitor.unit_number}</p>
          )}
          {isUnitOwner && visitor.otp && visitor.host_id === profile?.id && (
            <p className="text-sm font-medium text-blue-600">OTP: {visitor.otp}</p>
          )}
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
            {showVerifyButton && (
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
            )}
            {showApproveButton && (
              <Button onClick={handleApproval}>Approve</Button>
            )}
            {showShareButton && (
              <Button onClick={handleShare} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share OTP
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};