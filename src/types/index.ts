
export type Role = "admin" | "guard";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  email: string;
  position: string;
  restrictions: string;
  password: string;
  role: Role;
}

export type ShiftType = 
  | "morningMorning" 
  | "morningNight" 
  | "replacement" 
  | "afternoonAfternoon" 
  | "night" 
  | "all" 
  | "dayOff" 
  | "specialDayOff" 
  | "refresher";

export interface DayRequest {
  day: string;
  date: string;
  shiftType: ShiftType;
  specialReason?: string;
}

export interface WeeklyRequest {
  guardId: string;
  guardName: string;
  submitted: boolean;
  requestDate: string;
  weekStartDate: string;
  days: DayRequest[];
}

// התוספות החדשות
export type PositionType = 
  | "הולכי רגל" 
  | "רכבים" 
  | "סייר" 
  | "צ\"פים" 
  | "מרפאות"
  | "מתגבר מרפאות"
  | "ציפה" 
  | "שער עליון"
  | "מיון בוקר"
  | "מוקד בוקר"
  | "עמדת מחליף"
  | "מוקד צהריים"
  | "מיון צהריים"
  | "שער עליון לילה"
  | "מוקד לילה";

// עמדות עם שעות קבועות
export interface Position {
  name: PositionType;
  startTime?: string; // זמן התחלה (לדוגמה "06:00")
  endTime?: string;   // זמן סיום (לדוגמה "14:00")
  backgroundColor?: string; // צבע רקע לתצוגה
  daysAvailable?: string[]; // ימים בשבוע שהעמדה פעילה
}

// שיבוץ מאבטחים בעמדות
export interface ScheduleAssignment {
  id: string;
  positionId: string;
  guardId: string;
  date: string;
  shiftStartTime: string;
  shiftEndTime: string;
  notes?: string;
}

// For validation purposes
export interface ValidationRule {
  check: (request: WeeklyRequest) => boolean;
  message: string;
}
