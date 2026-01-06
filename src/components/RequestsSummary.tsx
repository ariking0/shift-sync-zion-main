
import { useRequests } from "@/context/requests-context";
import { formatDate } from "@/lib/utils";
import { WeeklyRequest, DayRequest, ShiftType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { translateShiftType } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";

export function RequestsSummary() {
  const { requests } = useRequests();
  const [showDialog, setShowDialog] = useState(false);
  const [activeDays, setActiveDays] = useState<DayRequest[]>([]);
  const [activeGuard, setActiveGuard] = useState<string>("");
  
  const submittedRequests = requests.filter(req => req.submitted);
  
  if (submittedRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">טרם התקבלו בקשות לסידור העבודה</p>
      </div>
    );
  }
  
  const weekStartDate = submittedRequests[0]?.weekStartDate;
  
  const getShiftTypeClassName = (shiftType: ShiftType) => {
    switch (shiftType) {
      case "dayOff":
        return "bg-gray-100";
      case "specialDayOff":
        return "bg-vibrant-orange bg-opacity-20";
      case "night":
      case "morningNight":
        return "bg-blue-100";
      default:
        return "";
    }
  };
  
  const handleShowSpecialReasons = (request: WeeklyRequest) => {
    const specialDays = request.days.filter(d => d.shiftType === "specialDayOff");
    if (specialDays.length > 0) {
      setActiveDays(specialDays);
      setActiveGuard(request.guardName);
      setShowDialog(true);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          סיכום בקשות לשבוע: {weekStartDate && formatDate(weekStartDate)}
        </h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">מאבטח</TableHead>
            {submittedRequests[0]?.days.map((day) => (
              <TableHead key={day.date} className="text-right">
                {day.day}<br />{formatDate(day.date)}
              </TableHead>
            ))}
            <TableHead className="text-right">הערות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submittedRequests.map((request) => (
            <TableRow key={request.guardId}>
              <TableCell className="font-medium">{request.guardName}</TableCell>
              
              {request.days.map((day) => (
                <TableCell 
                  key={day.date} 
                  className={getShiftTypeClassName(day.shiftType)}
                >
                  {translateShiftType(day.shiftType)}
                </TableCell>
              ))}
              
              <TableCell>
                {request.days.some(d => d.shiftType === "specialDayOff") ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShowSpecialReasons(request)}
                    className="text-xs"
                  >
                    הצג סיבות
                  </Button>
                ) : (
                  "אין"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>סיבות לחופש מיוחד</DialogTitle>
            <DialogDescription>
              פירוט סיבות לבקשת חופש מיוחד עבור {activeGuard}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {activeDays.map(day => (
              <div key={day.date} className="p-3 bg-accent rounded-md">
                <h4 className="font-medium">{day.day} ({formatDate(day.date)})</h4>
                <p className="mt-1">סיבה: {day.specialReason || "לא צוינה סיבה"}</p>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={() => setShowDialog(false)}
          >
            סגור
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
