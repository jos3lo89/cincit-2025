"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface UsersPieChartProps {
  data: ChartData[];
}

const COLORS = [
  "oklch(66.6% 0.179 58.318)",
  "oklch(54.6% 0.245 262.881)",
  "oklch(62.7% 0.194 149.214)",
  "oklch(55.8% 0.288 302.321)",
];

export function UsersPieChart({ data }: UsersPieChartProps) {
  return (
    <Card className="rounded-lg shadow-md w-full">
      <CardHeader>
        <CardTitle>Distribución de Usuarios por Rol</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={(entry) => `${entry.name} (${entry.value})`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
