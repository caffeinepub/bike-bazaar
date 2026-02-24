import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminDashboard from '../components/AdminDashboard';
import UsersManagement from '../components/UsersManagement';
import ContentModeration from '../components/ContentModeration';
import AdminSettings from '../components/AdminSettings';
import ContentEditor from '../components/ContentEditor';
import AdminRoute from '../components/AdminRoute';
import { toast } from 'sonner';

function AdminPanelContent() {
  const navigate = useNavigate();
  const { adminLogout, adminEmail } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    adminLogout();
    toast.success('Logged out successfully');
    navigate({ to: '/admin-login' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-primary mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">
                Logged in as: <span className="font-medium">{adminEmail}</span>
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="content-editor" className="gap-2">
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Listings</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="content-editor" className="space-y-6">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminRoute>
      <AdminPanelContent />
    </AdminRoute>
  );
}
