"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { USER_GROWTH_SERIES } from "@/data/mock/analytics";

export function UserBarChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>
          Active, New, and Banned users per month.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={USER_GROWTH_SERIES}
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
                <Bar dataKey="active" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} animationDuration={1500} />
                <Bar dataKey="new" stackId="a" fill="hsl(var(--chart-2))" animationDuration={1500} animationBegin={200} />
                <Bar dataKey="banned" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} animationDuration={1500} animationBegin={400} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
