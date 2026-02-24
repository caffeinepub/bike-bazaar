import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminDashboardMetrics, useRecentActivity, useGetAnalyticsData } from '../hooks/useQueries';
import { Users, FileText, ShoppingCart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import AnalyticsChart from './AnalyticsChart';

export default function AdminDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useAdminDashboardMetrics();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAnalyticsData();

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: analyticsData ? Number(analyticsData.totalVisitors) : 0,
      icon: Users,
      description: 'All-time visitors',
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Active Listings',
      value: analyticsData ? Number(analyticsData.activeListings) : metrics?.totalListings || 0,
      icon: FileText,
      description: 'Currently available',
      trend: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Registered Users',
      value: analyticsData ? Number(analyticsData.registeredUsers) : metrics?.totalUsers || 0,
      icon: ShoppingCart,
      description: 'Total user accounts',
      trend: '+15%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Recent Activity',
      value: metrics?.recentActivityCount || 0,
      icon: Activity,
      description: 'Last 24 hours',
      trend: '+5%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <img
            src="/assets/generated/admin-dashboard-hero.dim_800x400.png"
            alt="Admin Dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center">
            <div className="container px-6">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                Welcome to Admin Dashboard
              </h2>
              <p className="text-white/90">
                Monitor and manage your marketplace with real-time insights
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">
                  {stat.title}
                </CardDescription>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Chart */}
      {!analyticsLoading && analyticsData && analyticsData.usageStats.length > 0 && (
        <AnalyticsChart data={analyticsData.usageStats} />
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest actions and updates in your marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity && recentActivity.length > 0 ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(Number(activity.timestamp) / 1000000), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
