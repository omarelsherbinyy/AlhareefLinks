import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface DashboardHeaderProps {
  onLogout: () => Promise<void>;
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleChangePassword = async () => {
    try {
      if (newPassword.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setIsChangePasswordOpen(false);
      setNewPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          variant="default" 
          onClick={() => setIsChangePasswordOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white"
        >
          Change Password
        </Button>
        <Button 
          variant="destructive" 
          onClick={onLogout}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </div>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Change Password</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white text-black"
              />
            </div>
            <Button 
              onClick={handleChangePassword} 
              className="w-full bg-primary hover:bg-primary-hover text-white"
            >
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};