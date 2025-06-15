import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface KRI {
  id: number;
  category: string;
  name: string;
  value: string;
  status: "green" | "yellow" | "red";
}

const DashboardPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("AML");
  const [kriData, setKriData] = useState<KRI[]>([]);
  const [wikiUpdates, setWikiUpdates] = useState<string[]>([]);
  const [monitoringHighlights, setMonitoringHighlights] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kriRes = await axios.get("/api/kri");
        const wikiRes = await axios.get("/api/wiki/updates");
        const monRes = await axios.get("/api/monitoring/highlights");
        setKriData(Array.isArray(kriRes.data) ? kriRes.data : []);
        setWikiUpdates(wikiRes.data);
        setMonitoringHighlights(monRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  const categories = Array.isArray(kriData)
    ? Array.from(new Set(kriData.map((k) => k.category)))
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Risk Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <ul className="space-y-2">
                  {kriData
                    .filter((k) => k.category === cat)
                    .map((k) => (
                      <li
                        key={k.id}
                        className="flex justify-between border-b py-1 text-sm"
                      >
                        <span>{k.name}</span>
                        <span
                          className={`font-medium ${
                            k.status === "green"
                              ? "text-green-600"
                              : k.status === "yellow"
                              ? "text-yellow-500"
                              : "text-red-600"
                          }`}
                        >
                          {k.value}
                        </span>
                      </li>
                    ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {monitoringHighlights.length ? (
              monitoringHighlights.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No recent highlights.</li>
            )}
          </ul>
          <Button variant="link" className="mt-2 px-0" asChild>
            <a href="/monitoring">Go to Monitoring</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WIKI Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {wikiUpdates.length ? (
              wikiUpdates.map((update, index) => <li key={index}>{update}</li>)
            ) : (
              <li>No recent changes.</li>
            )}
          </ul>
          <Button variant="link" className="mt-2 px-0" asChild>
            <a href="/wiki">Explore WIKI</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>✅ Quarterly compliance filing – June 30</li>
            <li>📌 Schedule team training on new policy</li>
            <li>🟡 3 alerts unresolved {">"} 7 days</li>
          </ul>
          <Button variant="link" className="mt-2 px-0" asChild>
            <a href="/calendar">Go to Calendar</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
