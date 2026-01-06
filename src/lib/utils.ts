
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, format } from "date-fns";
import { DayRequest, ShiftType, ValidationRule, WeeklyRequest } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWeekDates(startDate: Date = new Date()): { day: string; date: string }[] {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Find the most recent Sunday (Israeli week starts on Sunday)
  const dayOfWeek = startDate.getDay();
  const diff = dayOfWeek === 0 ? 7 : dayOfWeek; // If today is Sunday, we want next Sunday
  const nextSunday = addDays(startDate, 7 - diff);
  
  // Generate the week
  return daysOfWeek.map((day, index) => {
    const date = addDays(nextSunday, index);
    return {
      day,
      date: format(date, "yyyy-MM-dd")
    };
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy");
}

export function generateEmptyWeeklyRequest(guardId: string, guardName: string): WeeklyRequest {
  const weekDates = getWeekDates();
  const weekStartDate = weekDates[0].date;
  
  return {
    guardId,
    guardName,
    submitted: false,
    requestDate: format(new Date(), "yyyy-MM-dd"),
    weekStartDate,
    days: weekDates.map(({ day, date }) => ({
      day,
      date,
      shiftType: "dayOff" // Default to day off
    }))
  };
}

export function translateShiftType(shiftType: ShiftType): string {
  const translations: Record<ShiftType, string> = {
    morningMorning: "בוקר בוקר",
    morningNight: "בוקר לילה",
    replacement: "מחליף",
    afternoonAfternoon: "צהרים צהרים, לילה",
    night: "לילה",
    all: "הכל",
    dayOff: "חופש",
    specialDayOff: "חופש מיוחד",
    refresher: "רעינון"
  };
  
  return translations[shiftType] || shiftType;
}

export const validationRules: ValidationRule[] = [
  {
    check: (request: WeeklyRequest) => {
      // Rule: Maximum 3 night shifts per week
      const nightShifts = request.days.filter(day => 
        day.shiftType === "night" || 
        day.shiftType === "morningNight"
      ).length;
      
      return nightShifts <= 3;
    },
    message: "אין לאפשר מעל 3 משמרות לילה בשבוע"
  },
  {
    check: (request: WeeklyRequest) => {
      // Rule: No night shift followed by morning shift
      for (let i = 0; i < request.days.length - 1; i++) {
        const today = request.days[i];
        const tomorrow = request.days[i + 1];
        
        if ((today.shiftType === "night" || today.shiftType === "morningNight") && 
            (tomorrow.shiftType === "morningMorning" || tomorrow.shiftType === "morningNight")) {
          return false;
        }
      }
      return true;
    },
    message: "אין לאפשר משמרת לילה ויום למחרת בוקר"
  },
  {
    check: (request: WeeklyRequest) => {
      // Rule: Maximum 1 special day off per week
      const specialDaysOff = request.days.filter(day => 
        day.shiftType === "specialDayOff"
      ).length;
      
      return specialDaysOff <= 1;
    },
    message: "אין לאפשר יותר מיום חופש מיוחד אחד בשבוע"
  }
];

export function validateRequest(request: WeeklyRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const rule of validationRules) {
    if (!rule.check(request)) {
      errors.push(rule.message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Check if the current date is within the allowed edit window
export function isWithinEditWindow(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
  const hourOfDay = now.getHours();
  
  // Edit window is from Friday (5) to Wednesday (3) at 6:00 AM
  return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0 || 
         dayOfWeek === 1 || dayOfWeek === 2 || 
         (dayOfWeek === 3 && hourOfDay < 6);
}

// Generate a password
export function generatePassword(): string {
  return Math.random().toString(36).slice(-8);
}
