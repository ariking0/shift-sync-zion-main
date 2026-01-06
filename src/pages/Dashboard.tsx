
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { AdminDashboard } from "@/components/AdminDashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vibrant-purple/10 to-sky-blue/10">
      <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">דשבורד ניהול</h1>
        
        <Tabs defaultValue="users" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
            <TabsTrigger value="guards">מאבטחים</TabsTrigger>
            <TabsTrigger value="requests">בקשות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="guards">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="requests">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
