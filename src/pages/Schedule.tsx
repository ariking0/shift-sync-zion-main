
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Plus, Link } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const Schedule = () => {
  const { settings } = useAuth();
  
  // קישורים מההגדרות, עם ערכי ברירת מחדל במקרה שאין הגדרות
  const newScheduleLink = settings?.newScheduleLink || "https://docs.google.com/spreadsheets/create";
  const currentScheduleLink = settings?.currentScheduleLink || "https://docs.google.com/spreadsheets/d/example";
  const nextWeekScheduleLink = settings?.nextWeekScheduleLink || "https://docs.google.com/spreadsheets/d/example-next";
  
  const openGoogleSheet = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10 p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">סידור עבודה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Button
              className="flex items-center gap-2 bg-vibrant-orange text-white hover:bg-orange-600 justify-start h-14 text-lg"
              onClick={() => openGoogleSheet(newScheduleLink)}
            >
              <Plus className="h-5 w-5" />
              <span>הכנת סידור עבודה חדש</span>
            </Button>
            
            <Button 
              className="flex items-center gap-2 bg-vibrant-blue text-white hover:bg-blue-600 justify-start h-14 text-lg"
              onClick={() => openGoogleSheet(currentScheduleLink)}
            >
              <File className="h-5 w-5" />
              <span>צפה בסידור עבודה נוכחי</span>
            </Button>
            
            <Button 
              className="flex items-center gap-2 bg-vibrant-purple text-white hover:bg-purple-600 justify-start h-14 text-lg"
              onClick={() => openGoogleSheet(nextWeekScheduleLink)}
            >
              <File className="h-5 w-5" />
              <span>צפה בסידור עבודה לשבוע הבא</span>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mt-6 bg-gray-50 p-4 rounded-md">
            <p className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span>קישורים אלו מובילים לגיליונות גוגל שבהם מנוהל סידור העבודה</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
