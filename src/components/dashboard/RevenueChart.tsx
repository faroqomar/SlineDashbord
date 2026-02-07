"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenuePoint } from "@/data/mock/overview";
import { Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RevenueChartProps {
  data: RevenuePoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-4 lg:col-span-4 border-none shadow-medium">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
