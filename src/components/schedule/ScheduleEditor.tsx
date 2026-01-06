
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { positions } from "@/data/positions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Download, Plus, Save, Trash } from "lucide-react";
import { toast } from "sonner";

// דף עריכת סידור עבודה במסך מלא
export function ScheduleEditor() {
  const { users } = useAuth();
  const guards = users.filter(user => user.role === "guard");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    // יצירת הימים לשבוע הנוכחי
    const daysArray = [];
    const startDate = new Date(currentDate);
    
    // נעבור לתחילת השבוע (יום ראשון)
    startDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    // נייצר 7 ימים מתחילת השבוע
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dateString = day.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
      const dayName = day.toLocaleDateString('he-IL', { weekday: 'short' });
      daysArray.push(`${dayName} ${dateString}`);
    }
    
    setDays(daysArray);
    initializeSchedule(daysArray);
  }, [currentDate]);

  const initializeSchedule = (daysArray: string[]) => {
    const initialSchedule: Record<string, Record<string, string>> = {};
    
    positions.forEach(position => {
      initialSchedule[position.name] = {};
      daysArray.forEach(day => {
        initialSchedule[position.name][day] = "";
      });
    });
    
    setSchedule(initialSchedule);
  };

  const handleAssignGuard = (position: string, day: string, guardId: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      newSchedule[position][day] = guardId;
      return newSchedule;
    });
  };

  const handleSaveSchedule = () => {
    // בפרודקשן: כאן תבוא הלוגיקה לשמירת המידע בשרת/מסד נתונים
    localStorage.setItem('workSchedule', JSON.stringify({
      weekStartDate: days[0],
      schedule
    }));
    
    toast.success("סידור העבודה נשמר בהצלחה");
  };

  const handleGenerateSchedule = () => {
    toast.info("פונקציונליות זו בפיתוח");
    // כאן תבוא הלוגיקה לסידור אוטומטי
  };

  const handleAddPosition = () => {
    // פתיחת חלונית להוספת עמדה חדשה
    toast.info("פונקציונליות הוספת עמדה בפיתוח");
  };

  const getShiftTimes = (position: typeof positions[0]) => {
    if (position.startTime && position.endTime) {
      return `${position.startTime} - ${position.endTime}`;
    }
    return "";
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">סידור עבודה שבועי</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateSchedule}
            className="flex items-center gap-2 bg-vibrant-orange text-white hover:bg-orange-600"
          >
            <AlertCircle className="h-4 w-4" />
            <span>הכנת סידור אוטומטי</span>
          </Button>
          <Button
            onClick={handleSaveSchedule}
            className="flex items-center gap-2 bg-vibrant-purple text-white hover:bg-purple-600"
          >
            <Save className="h-4 w-4" />
            <span>שמור סידור עבודה</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>ייצא לאקסל</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>סידור עבודה לשבוע: {days[0]} - {days[6]}</CardTitle>
          <Button
            onClick={handleAddPosition}
            size="sm"
            className="flex items-center gap-2 bg-vibrant-blue text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            <span>הוסף עמדה</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[150px]">עמדה / יום</TableHead>
                  <TableHead className="text-right min-w-[100px]">שעות משמרת</TableHead>
                  {days.map(day => (
                    <TableHead key={day} className="text-right min-w-[150px]">{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.name}>
                    <TableCell 
                      className="font-medium"
                      style={{ backgroundColor: position.backgroundColor || "#ffffff" }}
                    >
                      {position.name}
                    </TableCell>
                    <TableCell>{getShiftTimes(position)}</TableCell>
                    
                    {days.map(day => (
                      <TableCell key={`${position.name}-${day}`} className="p-1">
                        <Select
                          value={schedule[position.name]?.[day] || "unassigned"}
                          onValueChange={(value) => handleAssignGuard(position.name, day, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="בחר מאבטח" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="unassigned">לא משובץ</SelectItem>
                              {guards.map(guard => (
                                <SelectItem key={guard.id} value={guard.id}>
                                  {guard.firstName} {guard.lastName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
