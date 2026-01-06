import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Role, User } from "@/types";
import { toast } from "sonner";

// Interface for schedule link settings
interface ScheduleSettings {
  newScheduleLink: string;
  currentScheduleLink: string;
  nextWeekScheduleLink: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (idNumber: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (id: string) => void;
  updateAdminPassword: (currentPassword: string, newPassword: string) => boolean;
  settings: ScheduleSettings | null;
  updateSettings: (newSettings: ScheduleSettings) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default settings for Google Sheets links
const defaultSettings: ScheduleSettings = {
  newScheduleLink: "https://docs.google.com/spreadsheets/create",
  currentScheduleLink: "https://docs.google.com/spreadsheets/d/example",
  nextWeekScheduleLink: "https://docs.google.com/spreadsheets/d/example-next"
};

// Mock users data - in a real app, this would come from a database
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "אדמין",
    lastName: "ראשי",
    idNumber: "123456789",
    phone: "0501234567",
    email: "admin@example.com",
    position: "מנהל",
    restrictions: "",
    password: "admin123",
    role: "admin"
  },
  {
    id: "2",
    firstName: "ישראל",
    lastName: "ישראלי",
    idNumber: "987654321",
    phone: "0527654321",
    email: "guard@example.com",
    position: "מאבטח",
    restrictions: "שומר שבת",
    password: "guard123",
    role: "guard"
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : mockUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Add settings state
  const [settings, setSettings] = useState<ScheduleSettings>(() => {
    const storedSettings = localStorage.getItem("scheduleSettings");
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  // Add effect to store settings in localStorage
  useEffect(() => {
    localStorage.setItem("scheduleSettings", JSON.stringify(settings));
  }, [settings]);

  const login = (idNumber: string, password: string): boolean => {
    // Try to login with email first
    let user = users.find(u => u.email === idNumber && u.password === password);
    
    // If not found, try with ID number (for backward compatibility)
    if (!user) {
      user = users.find(u => u.idNumber === idNumber && u.password === password);
    }
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Add a new user to the system
  const addUser = (user: User) => {
    const existingUser = users.find(
      u => u.idNumber === user.idNumber || u.email === user.email
    );

    if (existingUser) {
      toast.error("כבר קיים משתמש עם מספר ת.ז. או אימייל זהים");
      return;
    }

    setUsers(prev => [...prev, user]);
    toast.success(`המשתמש ${user.firstName} ${user.lastName} נוסף בהצלחה`);
  };
  
  // Update existing user
  const updateUser = (updatedUser: User) => {
    setUsers(prev => 
      prev.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    
    // Update currentUser if it's the user being edited
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }

    toast.success(`פרטי המשתמש ${updatedUser.firstName} ${updatedUser.lastName} עודכנו בהצלחה`);
  };
  
  // Remove a user
  const removeUser = (id: string) => {
    const userToRemove = users.find(user => user.id === id);
    if (userToRemove) {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success(`המשתמש ${userToRemove.firstName} ${userToRemove.lastName} הוסר בהצלחה`);
    }
  };

  // Update admin password
  const updateAdminPassword = (currentPassword: string, newPassword: string): boolean => {
    if (!currentUser || currentUser.role !== "admin") {
      toast.error("אין לך הרשאות לשנות סיסמת מנהל");
      return false;
    }

    if (currentUser.password !== currentPassword) {
      toast.error("הסיסמה הנוכחית שהוזנה אינה נכונה");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("סיסמה חדשה חייבת להכיל לפחות 6 תווים");
      return false;
    }

    // עדכון הסיסמה
    const updatedUser = {
      ...currentUser,
      password: newPassword
    };

    updateUser(updatedUser);
    toast.success("סיסמת המנהל עודכנה בהצלחה");
    return true;
  };

  // Add function to update settings
  const updateSettings = (newSettings: ScheduleSettings) => {
    setSettings(newSettings);
    toast.success("הגדרות סידור העבודה עודכנו בהצלחה");
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: currentUser !== null,
    isAdmin: currentUser?.role === "admin",
    users,
    addUser,
    updateUser,
    removeUser,
    updateAdminPassword,
    settings,
    updateSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
