"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGrowthChartData } from "@/app/actions/analytics";

interface UserBarChartProps {
  data: UserGrowthChartData[];
}

export function UserBarChart({ data }: UserBarChartProps) {
  return (
    <Card className="col-span-3 lg:col-span-3">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>
          New user signups per month.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                />
                <Legend iconType="circle" />
                <Bar name="New Users" dataKey="newUsers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
