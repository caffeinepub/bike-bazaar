import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { UsageStat } from '../backend';
import { TrendingUp } from 'lucide-react';

interface AnalyticsChartProps {
  data: UsageStat[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = data.map((stat) => ({
    date: new Date(Number(stat.timestamp) / 1000000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    visitors: Number(stat.visitors),
    users: Number(stat.users),
    listings: Number(stat.listings),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Usage Trends
        </CardTitle>
        <CardDescription>Platform activity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Visitors"
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="Users"
            />
            <Line
              type="monotone"
              dataKey="listings"
              stroke="#10b981"
              strokeWidth={2}
              name="Listings"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
