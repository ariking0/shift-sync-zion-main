import { useState } from "react";
import { User } from "@/types";
import { useAuth } from "@/context/auth-context";
import { useRequests } from "@/context/requests-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Trash, Eye, Edit, Key, BellRing, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export function GuardsList() {
  const { users, removeUser, updateUser } = useAuth() as any;
  const { requests } = useRequests();
  const [selectedGuard, setSelectedGuard] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const guards = users.filter((user: User) => user.role === "guard");
  
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      phone: "",
      email: "",
      position: "",
      restrictions: "",
    }
  });

  const handleRemoveGuard = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את המאבטח?")) {
      removeUser(id);
      toast.success("המאבטח הוסר בהצלחה");
    }
  };
  
  const hasSubmittedRequest = (guardId: string) => {
    const request = requests.find(req => req.guardId === guardId);
    return request?.submitted || false;
  };

  const handleEditGuard = (guard: User) => {
    setSelectedGuard(guard);
    setIsEditing(true);
    form.reset({
      firstName: guard.firstName,
      lastName: guard.lastName,
      idNumber: guard.idNumber,
      phone: guard.phone,
      email: guard.email,
      position: guard.position,
      restrictions: guard.restrictions,
    });
  };

  const handleSaveEdit = () => {
    const formValues = form.getValues();
    if (selectedGuard) {
      const updatedGuard = {
        ...selectedGuard,
        ...formValues,
      };
      updateUser(updatedGuard);
      toast.success("פרטי המאבטח עודכנו בהצלחה");
      setIsEditing(false);
      setSelectedGuard(null);
    }
  };

  const handleResetPassword = (guard: User) => {
    setSelectedGuard(guard);
    setIsResettingPassword(true);
    setNewPassword("");
  };

  const handleSaveNewPassword = () => {
    if (selectedGuard && newPassword) {
      const updatedGuard = {
        ...selectedGuard,
        password: newPassword,
      };
      updateUser(updatedGuard);
      toast.success("הסיסמה אופסה בהצלחה");
      setIsResettingPassword(false);
      setSelectedGuard(null);
    } else {
      toast.error("נא להזין סיסמה חדשה");
    }
  };
  
  // פונקציה לשליחת התראת SMS למאבטח יחיד
  const handleSendSingleSmsReminder = (guard: User) => {
    // בפרודקשן היינו משלבים כאן שירות SMS אמיתי
    // כרגע נציג רק הודעה שהתזכורת נשלחה
    toast.success(`התראת SMS נשלחה ל-${guard.firstName} ${guard.lastName}`);
    
    console.log(`שליחת תזכורת SMS למאבטח: ${guard.firstName} ${guard.lastName} (${guard.phone})`);
  };
  
  return (
    <div className="animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">שם מלא</TableHead>
            <TableHead className="text-right">טלפון</TableHead>
            <TableHead className="text-right">מספר ת.ז</TableHead>
            <TableHead className="text-right">הגבלות</TableHead>
            <TableHead className="text-right">סטטוס בקשה</TableHead>
            <TableHead className="text-right">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guards.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                אין מאבטחים במערכת
              </TableCell>
            </TableRow>
          ) : (
            guards.map((guard: User) => (
              <TableRow key={guard.id}>
                <TableCell className="font-medium">
                  {guard.firstName} {guard.lastName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {guard.phone}
                  </div>
                </TableCell>
                <TableCell>{guard.idNumber}</TableCell>
                <TableCell>{guard.restrictions || "אין"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={hasSubmittedRequest(guard.id) ? "bg-green-500" : "bg-orange-500"}>
                      {hasSubmittedRequest(guard.id) ? "הוגש" : "לא הוגש"}
                    </Badge>
                    {!hasSubmittedRequest(guard.id) && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSendSingleSmsReminder(guard)}
                        title="שלח תזכורת SMS"
                        className="h-6 w-6 bg-vibrant-purple text-white hover:bg-purple-600 rounded-full"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedGuard(guard)}
                      title="צפייה בפרטים"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditGuard(guard)}
                      title="עריכת פרטים"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleResetPassword(guard)}
                      title="איפוס סיסמה"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveGuard(guard.id)}
                      className="text-destructive hover:text-destructive"
                      title="מחיקת מאבטח"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* View Guard Dialog */}
      {selectedGuard && !isEditing && !isResettingPassword && (
        <Dialog open={!!selectedGuard && !isEditing && !isResettingPassword} onOpenChange={() => setSelectedGuard(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>פרטי מאבטח</DialogTitle>
              <DialogDescription>
                מידע מלא על המאבטח
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 text-right">
              <div>
                <h3 className="font-medium">שם מלא</h3>
                <p>{selectedGuard.firstName} {selectedGuard.lastName}</p>
              </div>
              
              <div>
                <h3 className="font-medium">מספר תעודת זהות</h3>
                <p>{selectedGuard.idNumber}</p>
              </div>
              
              <div>
                <h3 className="font-medium">טלפון</h3>
                <p>{selectedGuard.phone}</p>
              </div>
              
              <div>
                <h3 className="font-medium">אימייל</h3>
                <p>{selectedGuard.email || "לא צוין"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">תפקיד</h3>
                <p>{selectedGuard.position || "לא צוין"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">הגבלות</h3>
                <p>{selectedGuard.restrictions || "אין"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">שם משתמש למערכת</h3>
                <p>{selectedGuard.email || "לא צוין"}</p>
              </div>
              
              <div>
                <h3 className="font-medium">סיסמה למערכת</h3>
                <p>{selectedGuard.password}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Guard Dialog */}
      {isEditing && selectedGuard && (
        <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>עריכת פרטי מאבטח</DialogTitle>
              <DialogDescription>
                עדכון מידע של המאבטח
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">שם פרטי</Label>
                  <Input 
                    id="firstName"
                    {...form.register("firstName")}
                    defaultValue={selectedGuard.firstName}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">שם משפחה</Label>
                  <Input 
                    id="lastName"
                    {...form.register("lastName")}
                    defaultValue={selectedGuard.lastName}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idNumber">מספר תעודת זהות</Label>
                <Input 
                  id="idNumber"
                  {...form.register("idNumber")}
                  defaultValue={selectedGuard.idNumber}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון</Label>
                <Input 
                  id="phone"
                  {...form.register("phone")}
                  defaultValue={selectedGuard.phone}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input 
                  id="email"
                  {...form.register("email")}
                  defaultValue={selectedGuard.email}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">תפקיד</Label>
                <Input 
                  id="position"
                  {...form.register("position")}
                  defaultValue={selectedGuard.position}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restrictions">הגבלות</Label>
                <Input 
                  id="restrictions"
                  {...form.register("restrictions")}
                  defaultValue={selectedGuard.restrictions}
                />
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                ביטול
              </Button>
              <Button onClick={handleSaveEdit} className="bg-vibrant-purple hover:bg-vibrant-purple/90">
                שמור שינויים
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reset Password Dialog */}
      {isResettingPassword && selectedGuard && (
        <Dialog open={isResettingPassword} onOpenChange={() => setIsResettingPassword(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>איפוס סיסמה</DialogTitle>
              <DialogDescription>
                הגדרת סיסמה חדשה עבור {selectedGuard.firstName} {selectedGuard.lastName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 text-right">
              <div className="space-y-2">
                <Label htmlFor="newPassword">סיסמה חדשה</Label>
                <Input 
                  id="newPassword"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button variant="ghost" onClick={() => setIsResettingPassword(false)}>
                ביטול
              </Button>
              <Button onClick={handleSaveNewPassword} className="bg-vibrant-purple hover:bg-vibrant-purple/90">
                שמור סיסמה חדשה
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
