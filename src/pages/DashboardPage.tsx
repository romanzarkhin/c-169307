import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const mockKRIs = [
  { id: 1, name: "High-Risk Transactions", value: 12, category: "Transactions" },
  { id: 2, name: "Sanctions Matches", value: 3, category: "Sanctions" },
  { id: 3, name: "Customer Onboarding Delays", value: 7, category: "Customers" },
  { id: 4, name: "Unresolved Alerts", value: 5, category: "Monitoring" },
];

const categories = ["All", "Transactions", "Sanctions", "Customers", "Monitoring"];

// Mock data for charts
const highRiskTransactionsData = [
  { month: "Jan", count: 8 },
  { month: "Feb", count: 12 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 10 },
  { month: "May", count: 18 },
  { month: "Jun", count: 14 },
];

const unresolvedAlertsData = [
  { month: "Apr", count: 7 },
  { month: "May", count: 5 },
  { month: "Jun", count: 9 },
];

const DashboardPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredKRIs = selectedCategory === "All"
    ? mockKRIs
    : mockKRIs.filter(kri => kri.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* KRI Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Key Risk Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 items-center">
            <label htmlFor="category" className="text-sm">Filter by Category:</label>
            <select
              className="border px-2 py-1 rounded text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <ul className="mt-2 space-y-1">
            {filteredKRIs.map((kri) => (
              <li
                key={kri.id}
                className="border p-2 rounded bg-muted/30 flex justify-between text-sm"
              >
                <span>{kri.name}</span>
                <span className="font-bold">{kri.value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Monitoring Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>⚠️ 5 new alerts today</li>
            <li>🟡 3 alerts unresolved {" > "} 7 days</li>
            <li><Link to="/monitoring" className="text-blue-600 underline">Go to Monitoring</Link></li>
          </ul>
        </CardContent>
      </Card>

      {/* WIKI Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>WIKI Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>📘 “How to report a SAR” - edited 2 days ago</li>
            <li>📘 “CDD vs. EDD” - new entry</li>
            <li><Link to="/wiki" className="text-blue-600 underline">Open WIKI</Link></li>
          </ul>
        </CardContent>
      </Card>

      {/* High Risk Transactions Graph */}
      <Card>
        <CardHeader>
          <CardTitle>High Risk Transactions (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={highRiskTransactionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="High Risk Transactions" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Unresolved Alerts Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Unresolved Alerts (Last 3 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={unresolvedAlertsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Unresolved Alerts" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li>📅 Review weekly sanctions report</li>
            <li>📅 Audit overdue onboarding cases</li>
            <li><Link to="/calendar" className="text-blue-600 underline">Open Calendar</Link></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
