
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users, FileText, LogOut, BellRing, Calendar, Settings } from "lucide-react";
import { AddGuardForm } from "./AddGuardForm";
import { GuardsList } from "./GuardsList";
import { RequestsSummary } from "./RequestsSummary";
import { useRequests } from "@/context/requests-context";
import { useToast } from "@/hooks/use-toast";
import { AdminSettingsModal } from "./admin/AdminSettingsModal";

export function AdminDashboard() {
  const { logout, users } = useAuth();
  const { requests } = useRequests();
  const { toast } = useToast();
  const [isAddingGuard, setIsAddingGuard] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // פונקציה לשליחת התראות SMS
  const handleSendSmsReminder = () => {
    // מצא מאבטחים שלא הגישו בקשות
    const guardsWithoutRequests = users.filter(user => 
      user.role === "guard" && 
      !requests.some(req => req.guardId === user.id && req.submitted)
    );
    
    // בפרודקשן היינו משלבים כאן שירות SMS אמיתי
    // כרגע נציג רק הודעה שהתזכורות נשלחו
    toast({
      title: "התראות נשלחו",
      description: `נשלחו תזכורות SMS ל-${guardsWithoutRequests.length} מאבטחים שטרם הגישו בקשות`,
      duration: 5000,
    });
    
    console.log("שליחת תזכורות SMS למאבטחים:", 
      guardsWithoutRequests.map(g => `${g.firstName} ${g.lastName} (${g.phone})`));
  };
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">דשבורד ניהול</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>הגדרות מנהל</span>
          </Button>
          <Button 
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>התנתק</span>
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6">
        <Link to="/schedule">
          <Button className="flex items-center gap-2 bg-vibrant-blue text-white hover:bg-blue-600">
            <Calendar className="h-4 w-4" />
            <span>גישה לגיליונות סידור עבודה</span>
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="guards" className="animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="guards" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>מאבטחים</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>בקשות</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="guards">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle>רשימת מאבטחים</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={handleSendSmsReminder}
                    variant="outline"
                    className="flex items-center gap-2 bg-vibrant-purple text-white hover:bg-purple-600"
                  >
                    <BellRing className="h-4 w-4" />
                    <span>שלח תזכורות SMS</span>
                  </Button>
                  <Button 
                    onClick={() => setIsAddingGuard(!isAddingGuard)} 
                    variant="outline"
                    className="flex items-center gap-2 bg-vibrant-orange text-white hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span>הוסף מאבטח</span>
                  </Button>
                </div>
              </div>
              <CardDescription>
                ניהול פרטי המאבטחים במערכת
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingGuard ? (
                <AddGuardForm onComplete={() => setIsAddingGuard(false)} />
              ) : (
                <ScrollArea className="h-[60vh]">
                  <GuardsList />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>סיכום בקשות שבועי</CardTitle>
                <Button 
                  onClick={handleSendSmsReminder}
                  variant="outline"
                  className="flex items-center gap-2 bg-vibrant-purple text-white hover:bg-purple-600"
                >
                  <BellRing className="h-4 w-4" />
                  <span>שלח תזכורות SMS</span>
                </Button>
              </div>
              <CardDescription>
                טבלת ריכוז בקשות לסידור העבודה
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <RequestsSummary />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AdminSettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
