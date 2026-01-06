
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/supabase-auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'admin' | 'guard';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function UserManagement() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      setUsers((data || []) as UserProfile[]);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('שגיאה בטעינת רשימת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      ));

      toast.success(`המשתמש ${status === 'approved' ? 'אושר' : 'נדחה'} בהצלחה`);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error('שגיאה בעדכון סטטוס המשתמש');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">מאושר</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">נדחה</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500 text-white">ממתין</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? <Badge className="bg-vibrant-purple text-white">מנהל</Badge>
      : <Badge className="bg-vibrant-blue text-white">מאבטח</Badge>;
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>אין הרשאה</CardTitle>
          <CardDescription>אין לך הרשאות לצפות בדף זה</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ניהול משתמשים</CardTitle>
          <CardDescription>טוען רשימת משתמשים...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ניהול משתמשים</CardTitle>
            <CardDescription>אישור וניהול גישות למערכת</CardDescription>
          </div>
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            רענן
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם</TableHead>
              <TableHead className="text-right">אימייל</TableHead>
              <TableHead className="text-right">תפקיד</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {user.avatar_url && (
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {user.first_name} {user.last_name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateUserStatus(user.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          אשר
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateUserStatus(user.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          דחה
                        </Button>
                      </>
                    )}
                    {user.status === 'rejected' && (
                      <Button
                        size="sm"
                        onClick={() => updateUserStatus(user.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        אשר
                      </Button>
                    )}
                    {user.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateUserStatus(user.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        דחה גישה
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
