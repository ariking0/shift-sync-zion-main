
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, User } from "lucide-react";

// הסכימה המעודכנת עם אימות נתונים
const guardSchema = z.object({
  firstName: z.string().min(2, { message: "שם פרטי חייב להכיל לפחות 2 תווים" }),
  lastName: z.string().min(2, { message: "שם משפחה חייב להכיל לפחות 2 תווים" }),
  idNumber: z.string().min(9, { message: "מספר ת.ז חייב להכיל לפחות 9 ספרות" }),
  // הגבלת מספר טלפון ל-10 ספרות בדיוק
  phone: z.string().refine((val) => /^\d{10}$/.test(val), {
    message: "מספר טלפון חייב להכיל בדיוק 10 ספרות",
  }),
  email: z.string().email({ message: "אימייל לא תקין" }),
  position: z.string().optional(),
  restrictions: z.string().optional(),
  password: z.string().min(6, { message: "סיסמה חייבת להכיל לפחות 6 תווים" }),
});

type GuardFormData = z.infer<typeof guardSchema>;

// סכימה מצומצת לשלב הראשון של התהליך
const emailOnlySchema = z.object({
  firstName: z.string().min(2, { message: "שם פרטי חייב להכיל לפחות 2 תווים" }),
  lastName: z.string().min(2, { message: "שם משפחה חייב להכיל לפחות 2 תווים" }),
  email: z.string().email({ message: "אימייל לא תקין" }),
});

type EmailOnlyFormData = z.infer<typeof emailOnlySchema>;

interface AddGuardFormProps {
  onComplete: () => void;
}

export function AddGuardForm({ onComplete }: AddGuardFormProps) {
  const { addUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1 - רק אימייל, 2 - טופס מלא
  const [fullFormMode, setFullFormMode] = useState(false); // מצב טופס מלא

  // טופס שלב ראשון - רק אימייל
  const emailOnlyForm = useForm<EmailOnlyFormData>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // טופס מלא עם כל השדות
  const fullForm = useForm<GuardFormData>({
    resolver: zodResolver(guardSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      phone: "",
      email: "",
      position: "",
      restrictions: "",
      password: "",
    },
  });

  // שליחת הזמנה במייל (רק אימייל)
  const handleEmailInvite = (data: EmailOnlyFormData) => {
    // בפרודקשן: כאן תבוא לוגיקת שליחת המייל האמיתית
    toast({
      title: "נשלחה הזמנה למאבטח",
      description: `הזמנה נשלחה ל${data.firstName} ${data.lastName} באימייל ${data.email}`,
    });
    console.log("שליחת הזמנה במייל למאבטח:", data);
    onComplete();
  };

  // הוספת מאבטח ידנית (כל השדות)
  const handleSubmitFull = (data: GuardFormData) => {
    const newGuard = {
      id: Math.random().toString(36).substring(2, 11),
      firstName: data.firstName,
      lastName: data.lastName,
      idNumber: data.idNumber,
      phone: data.phone,
      email: data.email,
      position: data.position || "",
      restrictions: data.restrictions || "",
      password: data.password,
      role: "guard" as const,
    };

    addUser(newGuard);
    toast({
      title: "מאבטח נוסף בהצלחה",
      description: `המאבטח ${data.firstName} ${data.lastName} נוסף בהצלחה`,
    });
    onComplete();
  };

  // יצירת סיסמא רנדומלית
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    fullForm.setValue("password", password);
  };

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {fullFormMode ? "הוספת מאבטח חדש - מילוי פרטים מלאים" : "הוספת מאבטח חדש - שליחת הזמנה"}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setFullFormMode(!fullFormMode)}
            className="text-sm"
          >
            {fullFormMode ? "מעבר למשלוח הזמנה" : "מעבר למילוי פרטים מלא"}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onComplete}
            className="text-muted-foreground text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            חזרה
          </Button>
        </div>
      </div>

      {!fullFormMode ? (
        // טופס מצומצם - שם ואימייל בלבד
        <form onSubmit={emailOnlyForm.handleSubmit(handleEmailInvite)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">שם פרטי</Label>
            <Input 
              id="firstName" 
              {...emailOnlyForm.register("firstName")} 
              className={emailOnlyForm.formState.errors.firstName ? "border-red-500" : ""}
              placeholder="הכנס שם פרטי"
              dir="rtl"
            />
            {emailOnlyForm.formState.errors.firstName && (
              <p className="text-red-500 text-xs">{emailOnlyForm.formState.errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName">שם משפחה</Label>
            <Input 
              id="lastName" 
              {...emailOnlyForm.register("lastName")} 
              className={emailOnlyForm.formState.errors.lastName ? "border-red-500" : ""}
              placeholder="הכנס שם משפחה"
              dir="rtl"
            />
            {emailOnlyForm.formState.errors.lastName && (
              <p className="text-red-500 text-xs">{emailOnlyForm.formState.errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">אימייל</Label>
            <Input 
              id="email" 
              type="email"
              {...emailOnlyForm.register("email")} 
              className={emailOnlyForm.formState.errors.email ? "border-red-500" : ""}
              placeholder="הכנס כתובת אימייל"
              dir="ltr"
            />
            {emailOnlyForm.formState.errors.email && (
              <p className="text-red-500 text-xs">{emailOnlyForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full flex items-center gap-2 bg-vibrant-purple hover:bg-purple-600">
              <Mail className="h-4 w-4" />
              <span>שלח הזמנה למאבטח</span>
            </Button>
            <p className="text-sm text-muted-foreground text-center mt-2">
              המאבטח יקבל מייל עם קישור להשלמת הרישום
            </p>
          </div>
        </form>
      ) : (
        // טופס מלא
        <form onSubmit={fullForm.handleSubmit(handleSubmitFull)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">שם פרטי</Label>
              <Input 
                id="firstName" 
                {...fullForm.register("firstName")} 
                className={fullForm.formState.errors.firstName ? "border-red-500" : ""}
                placeholder="הכנס שם פרטי"
                dir="rtl"
              />
              {fullForm.formState.errors.firstName && (
                <p className="text-red-500 text-xs">{fullForm.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName">שם משפחה</Label>
              <Input 
                id="lastName" 
                {...fullForm.register("lastName")} 
                className={fullForm.formState.errors.lastName ? "border-red-500" : ""}
                placeholder="הכנס שם משפחה"
                dir="rtl"
              />
              {fullForm.formState.errors.lastName && (
                <p className="text-red-500 text-xs">{fullForm.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="idNumber">מספר ת.ז.</Label>
              <Input 
                id="idNumber" 
                {...fullForm.register("idNumber")} 
                className={fullForm.formState.errors.idNumber ? "border-red-500" : ""}
                placeholder="הכנס מספר ת.ז."
                dir="rtl"
              />
              {fullForm.formState.errors.idNumber && (
                <p className="text-red-500 text-xs">{fullForm.formState.errors.idNumber.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">מספר טלפון</Label>
              <Input 
                id="phone" 
                {...fullForm.register("phone")} 
                className={fullForm.formState.errors.phone ? "border-red-500" : ""}
                placeholder="הכנס מספר טלפון (10 ספרות)"
                maxLength={10}
                dir="ltr"
              />
              {fullForm.formState.errors.phone && (
                <p className="text-red-500 text-xs">{fullForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="email">אימייל</Label>
              <Input 
                id="email" 
                type="email"
                {...fullForm.register("email")} 
                className={fullForm.formState.errors.email ? "border-red-500" : ""}
                placeholder="הכנס כתובת אימייל"
                dir="ltr"
              />
              {fullForm.formState.errors.email && (
                <p className="text-red-500 text-xs">{fullForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="position">תפקיד</Label>
              <Input 
                id="position" 
                {...fullForm.register("position")} 
                placeholder="הכנס תפקיד"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="restrictions">הגבלות</Label>
            <Input 
              id="restrictions" 
              {...fullForm.register("restrictions")} 
              placeholder="הכנס הגבלות אם יש"
              dir="rtl"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">סיסמה</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={generatePassword}
                className="text-xs"
              >
                צור סיסמה אקראית
              </Button>
            </div>
            <Input 
              id="password" 
              type="text"
              {...fullForm.register("password")} 
              className={fullForm.formState.errors.password ? "border-red-500" : ""}
              placeholder="הכנס סיסמה (לפחות 6 תווים)"
            />
            {fullForm.formState.errors.password && (
              <p className="text-red-500 text-xs">{fullForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full flex items-center gap-2 bg-vibrant-purple hover:bg-purple-600">
              <User className="h-4 w-4" />
              <span>הוסף מאבטח</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
