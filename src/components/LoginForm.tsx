
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginForm() {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (idNumber.length !== 9) {
      toast.error("מספר ת.ז חייב להיות 9 ספרות");
      return;
    }
    
    const success = login(idNumber, password);
    
    if (success) {
      toast.success("התחברת בהצלחה!");
    } else {
      toast.error("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <Card className="w-full max-w-md animate-scale-in card-hover">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">מערכת סידור עבודה</CardTitle>
        <CardDescription>התחבר עם מספר זהות וסיסמה</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="idNumber" className="text-sm font-medium">מספר תעודת זהות</label>
            <Input
              id="idNumber"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="הכנס מספר תעודת זהות"
              required
              className="text-right"
              dir="rtl"
              maxLength={9}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">סיסמה</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הכנס סיסמה"
              required
              className="text-right"
              dir="rtl"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-vibrant-purple hover:bg-violet-600 button-hover"
          >
            התחבר
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        למעבר למסך ניהול: משתמש: 123456789, סיסמה: admin123
      </CardFooter>
    </Card>
  );
}
