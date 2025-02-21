
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Filter,
  NetworkIcon,
  Calendar,
  MessageCircle,
} from "lucide-react";
import NetworkGraph from "@/components/NetworkGraph";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NetworkIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">CollabGraph</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stakeholders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card className="p-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Stakeholders</h2>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    All Stakeholders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Recent Activity
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Engagements
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Network View */}
          <div className="col-span-9">
            <Card className="h-[calc(100vh-12rem)]">
              <NetworkGraph />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
