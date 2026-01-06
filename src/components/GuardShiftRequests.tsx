import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRequests } from "@/context/requests-context";
import { isWithinEditWindow, formatDate, validateRequest, translateShiftType } from "@/lib/utils";
import { ShiftType, WeeklyRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertTriangle, Check, FileClock, LogOut, File } from "lucide-react";

export function GuardShiftRequests() {
  const { currentUser, logout, settings } = useAuth();
  const { getRequestByGuardId, saveRequest, createEmptyRequest } = useRequests();

  const [request, setRequest] = useState<WeeklyRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  
  // Initialize request data
  useEffect(() => {
    if (currentUser) {
      const existingRequest = getRequestByGuardId(currentUser.id);
      
      if (existingRequest) {
        setRequest(existingRequest);
      } else {
        // Create new request
        const newRequest = createEmptyRequest(
          currentUser.id, 
          `${currentUser.firstName} ${currentUser.lastName}`
        );
        setRequest(newRequest);
      }
      
      // Check if within edit window
      setCanEdit(isWithinEditWindow() || !existingRequest?.submitted);
    }
    
    setLoading(false);
  }, [currentUser, getRequestByGuardId, createEmptyRequest]);

  // Handle shift type change
  const handleShiftChange = (dayIndex: number, value: ShiftType) => {
    if (!request || !canEdit) return;
    
    const updatedDays = [...request.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      shiftType: value,
      // Clear special reason if not a special day off
      specialReason: value === "specialDayOff" ? updatedDays[dayIndex].specialReason : undefined
    };
    
    const updatedRequest = {
      ...request,
      days: updatedDays
    };
    
    // Validate the updated request
    const validation = validateRequest(updatedRequest);
    setErrors(validation.errors);
    
    setRequest(updatedRequest);
  };

  // Handle special reason change
  const handleSpecialReasonChange = (dayIndex: number, reason: string) => {
    if (!request || !canEdit) return;
    
    const updatedDays = [...request.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      specialReason: reason
    };
    
    setRequest({
      ...request,
      days: updatedDays
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!request) return;
    
    const validation = validateRequest(request);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    const updatedRequest = {
      ...request,
      submitted: true,
      requestDate: new Date().toISOString().split('T')[0]
    };
    
    saveRequest(updatedRequest);
    setRequest(updatedRequest);
    setCanEdit(false);
    toast.success("הבקשות נשמרו בהצלחה");
  };

  // Open Google Sheets links
  const openScheduleSheet = (type: 'current' | 'next') => {
    // Use settings from auth context to get the proper links
    const scheduleLinks = {
      current: settings?.currentScheduleLink || "https://docs.google.com/spreadsheets/d/example-current",
      next: settings?.nextWeekScheduleLink || "https://docs.google.com/spreadsheets/d/example-next"
    };
    
    window.open(scheduleLinks[type], "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <div className="text-center p-8">טוען...</div>;
  }

  const shiftTypeOptions: { value: ShiftType; label: string }[] = [
    { value: "morningMorning", label: "בוקר בוקר" },
    { value: "morningNight", label: "בוקר לילה" },
    { value: "replacement", label: "מחליף" },
    { value: "afternoonAfternoon", label: "צהרים צהרים, לילה" },
    { value: "night", label: "לילה" },
    { value: "all", label: "הכל" },
    { value: "dayOff", label: "חופש" },
    { value: "specialDayOff", label: "חופש מיוחד" },
    { value: "refresher", label: "רעינון" }
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">בקשות לסידור עבודה</h1>
          <p className="text-muted-foreground">
            שלום {currentUser?.firstName}, כאן תוכל לרשום את העדפותיך לסידור העבודה
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>התנתק</span>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>צפייה בסידורי עבודה</CardTitle>
          <CardDescription>לחץ לצפייה בסידורי העבודה בגוגל שיטס</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="flex items-center gap-2 bg-vibrant-blue text-white hover:bg-blue-600 w-full justify-start"
            onClick={() => openScheduleSheet('current')}
          >
            <File className="h-5 w-5" />
            <span>צפה בסידור עבודה נוכחי</span>
          </Button>
          
          <Button 
            className="flex items-center gap-2 bg-vibrant-purple text-white hover:bg-purple-600 w-full justify-start"
            onClick={() => openScheduleSheet('next')}
          >
            <File className="h-5 w-5" />
            <span>צפה בסידור עבודה לשבוע הבא</span>
          </Button>
        </CardContent>
      </Card>
      
      {!canEdit && request?.submitted && (
        <Alert className="mb-6 bg-sky-50 border-sky-200">
          <FileClock className="h-4 w-4" />
          <AlertDescription>
            הבקשות שלך הוגשו בתאריך {formatDate(request.requestDate || "")}.
            ניתן לערוך בקשות מיום שישי עד יום רביעי בשעה 06:00 בבוקר של השבוע לפני שבוע הסידור.
          </AlertDescription>
        </Alert>
      )}
      
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle>בקשות לשבוע {request && formatDate(request.weekStartDate)}</CardTitle>
          <CardDescription>
            בחר את העדפותיך לכל יום בשבוע
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {request?.days.map((day, index) => (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {day.day} ({formatDate(day.date)})
                  </h3>
                  <div className="w-64">
                    <Select
                      value={day.shiftType}
                      onValueChange={(value) => handleShiftChange(index, value as ShiftType)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger className={canEdit ? "" : "bg-muted"}>
                        <SelectValue placeholder="בחר משמרת" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {shiftTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {day.shiftType === "specialDayOff" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground ml-2">סיבה:</span>
                    <Input
                      value={day.specialReason || ""}
                      onChange={(e) => handleSpecialReasonChange(index, e.target.value)}
                      placeholder="סיבה לחופש מיוחד (עד 5 מילים)"
                      maxLength={50}
                      className="w-64 text-right"
                      dir="rtl"
                      disabled={!canEdit}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {canEdit ? (
            <Button 
              onClick={handleSubmit}
              className="bg-vibrant-blue hover:bg-blue-600 flex items-center gap-2 button-hover"
            >
              <Check className="h-4 w-4" />
              <span>שלח בקשות</span>
            </Button>
          ) : (
            <Button disabled>הבקשות נשלחו</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
