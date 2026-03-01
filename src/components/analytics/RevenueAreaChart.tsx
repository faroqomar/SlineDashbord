"use client";

import { Area, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChartData } from "@/features/analytics/models/analytics.schema";

interface RevenueAreaChartProps {
  data: RevenueChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">{payload[0].payload.name}</span>
            <span className="font-mono text-muted-foreground">
              IQD {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div> }
  return null;
};

export function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  return (
    <Card className="col-span-4 lg:col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue trends for the current fiscal year.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minHeight={0}>
            <AreaChart
                data={data}
                margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
                }}
            >
                <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `IQD ${value.toLocaleString()}`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    strokeWidth={2}
                    animationDuration={1500}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
