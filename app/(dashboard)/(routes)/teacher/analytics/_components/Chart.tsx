"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, YAxis, XAxis } from "recharts";

interface ChartProps {
  data: { name: string; total: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  data = [
    ...data,
    { name: "upcomming", total: 1500 },
    { name: "upcomming", total: 1200 },
    { name: "upcomming", total: 850 },
    { name: "upcomming", total: 550 },
    { name: "upcomming", total: 250 },
    { name: "upcomming", total: 100 },
    { name: "upcomming", total: 10 },
    { name: "-", total: 5 },
    { name: "-", total: 5 },
    { name: "-", total: 5 },
    { name: "-", total: 5 },
  ];
  return (
    <Card className="pt-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
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
          <Bar dataKey="total" fill="#0369a1" radius={[7, 7, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
export default Chart;
