import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  data: { value: number; label?: string }[];
  color?: "primary" | "success" | "warning" | "destructive" | "info";
  height?: number;
  showTooltip?: boolean;
  className?: string;
}

const colorMap = {
  primary: "hsl(173, 58%, 39%)",
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  destructive: "hsl(0, 72%, 51%)",
  info: "hsl(199, 89%, 48%)",
};

export function MiniChart({
  data,
  color = "primary",
  height = 60,
  showTooltip = true,
  className,
}: MiniChartProps) {
  const chartColor = colorMap[color];

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-md px-2 py-1 shadow-md">
                      <p className="text-xs font-medium">{payload[0].value}</p>
                      {payload[0].payload.label && (
                        <p className="text-2xs text-muted-foreground">
                          {payload[0].payload.label}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={2}
            fill={`url(#gradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
