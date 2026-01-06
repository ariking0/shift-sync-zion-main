
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, profile, loading, isAuthenticated, isAdmin, isApproved, signInWithGoogle } = useSupabaseAuth();

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">מערכת סידור עבודה</CardTitle>
            <CardDescription>התחבר עם חשבון Google שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>שגיאה בטעינת פרופיל</CardTitle>
            <CardDescription>לא ניתן לטעון את פרטי המשתמש</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (profile.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>ממתין לאישור</CardTitle>
            <CardDescription>
              החשבון שלך ממתין לאישור מהמנהל. אנא פנה למנהל המערכת.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">פרטי החשבון:</p>
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>גישה נדחתה</CardTitle>
            <CardDescription>
              הגישה שלך למערכת נדחתה. אנא פנה למנהל המערכת.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/requests" replace />;
  }

  return <>{children}</>;
}
