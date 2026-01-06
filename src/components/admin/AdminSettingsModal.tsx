
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, FileText, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSettingsModal({ isOpen, onClose }: AdminSettingsModalProps) {
  const { updateAdminPassword, currentUser, settings, updateSettings } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Add state for schedule settings
  const [newScheduleLink, setNewScheduleLink] = useState(settings?.newScheduleLink || "");
  const [currentScheduleLink, setCurrentScheduleLink] = useState(settings?.currentScheduleLink || "");
  const [nextWeekScheduleLink, setNextWeekScheduleLink] = useState(settings?.nextWeekScheduleLink || "");

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("יש למלא את כל השדות");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("אימות סיסמה אינו תואם");
      return;
    }
    
    const success = updateAdminPassword(currentPassword, newPassword);
    
    if (success) {
      // Reset the form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };
  
  // Handle schedule settings form submission
  const handleScheduleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URLs
    if (!isValidUrl(newScheduleLink) || !isValidUrl(currentScheduleLink) || !isValidUrl(nextWeekScheduleLink)) {
      toast.error("יש להזין כתובות URL תקינות");
      return;
    }
    
    updateSettings({
      newScheduleLink,
      currentScheduleLink,
      nextWeekScheduleLink
    });
  };
  
  // Helper function to validate URLs
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>הגדרות מנהל</DialogTitle>
          <DialogDescription>
            ניהול סיסמאות וקישורים לסידורי עבודה
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="password" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>סיסמת מנהל</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>סידורי עבודה</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <form onSubmit={handlePasswordSubmit} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="הזן סיסמה נוכחית"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">סיסמה חדשה</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="הזן סיסמה חדשה (לפחות 6 תווים)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אימות סיסמה</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="הזן שוב את הסיסמה החדשה"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit"
                  className="bg-vibrant-purple hover:bg-purple-600 flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>עדכן סיסמה</span>
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="schedule">
            <form onSubmit={handleScheduleSettingsSubmit} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newScheduleLink">קישור ליצירת סידור עבודה חדש</Label>
                  <Input
                    id="newScheduleLink"
                    type="url"
                    value={newScheduleLink}
                    onChange={(e) => setNewScheduleLink(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentScheduleLink">קישור לסידור עבודה נוכחי</Label>
                  <Input
                    id="currentScheduleLink"
                    type="url"
                    value={currentScheduleLink}
                    onChange={(e) => setCurrentScheduleLink(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextWeekScheduleLink">קישור לסידור עבודה לשבוע הבא</Label>
                  <Input
                    id="nextWeekScheduleLink"
                    type="url"
                    value={nextWeekScheduleLink}
                    onChange={(e) => setNextWeekScheduleLink(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit"
                  className="bg-vibrant-blue hover:bg-blue-600 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>עדכן קישורים</span>
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        {currentUser && (
          <div className="rounded-md bg-muted p-4 mt-4">
            <div className="font-medium">פרטי חשבון נוכחי</div>
            <div className="mt-1 text-sm">
              שם: {currentUser.firstName} {currentUser.lastName}<br />
              אימייל: {currentUser.email}<br />
              הרשאה: {currentUser.role === "admin" ? "מנהל" : "מאבטח"}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
