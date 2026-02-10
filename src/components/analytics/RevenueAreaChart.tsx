"use client";

import { Area, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChartData } from "@/app/actions/analytics";

interface RevenueAreaChartProps {
  data: RevenueChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-lg text-sm">
        <p className="font-semibold mb-2">{label}</p>
        <p className="text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Revenue: ${payload[0].value}
        </p>
      </div>
    );
  }
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
            <ResponsiveContainer width="100%" height="100%">
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
                    tickFormatter={(value) => `$${value}`} 
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
