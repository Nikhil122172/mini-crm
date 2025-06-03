import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get("https://mini-crmb.onrender.com/campaigns").then((res) => {
      setCampaigns(res.data);
      console.log("ye camp hai",res.data);
      
    });
  }, []);

  const totalAudience = campaigns.reduce(
    (acc, c) => acc + (c.audienceSize || 0),
    0
  );
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent || 0), 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failed || 0), 0);

  const pieData = [
    { name: "Delivered", value: totalSent },
    { name: "Failed", value: totalFailed },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-white via-slate-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">📊 Campaign Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="shadow-2xl rounded-2xl bg-white hover:scale-[1.01] transition-transform">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Campaigns</h2>
            <p className="text-4xl font-bold text-blue-600">{campaigns.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xl rounded-2xl bg-white hover:scale-[1.01] transition-transform">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Audience Reached</h2>
            <p className="text-4xl font-bold text-green-600">{totalAudience}</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xl rounded-2xl bg-white hover:scale-[1.01] transition-transform">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Delivery Success Rate</h2>
            <p className="text-4xl font-bold text-purple-600">
              {totalAudience === 0
                ? "0%"
                : `${Math.round((totalSent / totalAudience) * 100)}%`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <Card className="shadow-xl rounded-2xl bg-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Delivery Report</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaigns} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#00C49F" name="Sent" radius={[10, 10, 0, 0]} />
                <Bar dataKey="failed" fill="#FF8042" name="Failed" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-2xl bg-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Delivery Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
