
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/supabase-auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated, isAdmin, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-purple mx-auto mb-4"></div>
          <p>טוען...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/dashboard" : "/requests"} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">מערכת סידור עבודה</CardTitle>
          <CardDescription>ברוכים הבאים למערכת ניהול סידורי העבודה</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            כדי להיכנס למערכת, עליך להתחבר עם חשבון Google שלך
          </p>
          <Button 
            onClick={signInWithGoogle}
            className="w-full bg-vibrant-purple hover:bg-purple-600"
          >
            התחבר עם Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
