"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  conteo: number;
}

interface InscriptionsBarChartProps {
  data: ChartData[];
}

export function InscriptionsBarChart({ data }: InscriptionsBarChartProps) {
  return (
    <Card className="rounded-lg shadow-md w-full">
      <CardHeader>
        <CardTitle>Estado de Inscripciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                backgroundColor: "#fefefe",
                color: "#000",
              }}
            />
            {/* <Legend /> */}
            <Bar
              dataKey="conteo"
              fill="oklch(54.6% 0.245 262.881)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
