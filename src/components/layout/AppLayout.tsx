import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FaHome,
  FaCalendarAlt,
  FaCogs,
  FaBrain,
  FaChartLine,
  FaBook,
  FaFileAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { NetworkIcon } from "lucide-react";

const floatingPrompts = [
  "How do I create a SAR report?",
  "Show me recent compliance alerts",
  "How do I assign a task?",
  "Where can I find the latest policy?",
];

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/monitoring", icon: <FaChartLine />, label: "Monitoring" },
    { path: "/wiki", icon: <FaBook />, label: "Wiki" },
    { path: "/reporting", icon: <FaFileAlt />, label: "Reporting" },
    { path: "/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
    { path: "/agent", icon: <FaBrain />, label: "Agent" },
    { path: "/settings", icon: <FaCogs />, label: "Settings" },
  ];

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const callMistral = async (prompt: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: prompt }]);
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer vM9hqQvYmkB5wBbMI0mbkTa9dZiKOHUm`,
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant integrated into a compliance monitoring app. Answer with actionable, relevant compliance insights.",
          },
          ...messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          { role: "user", content: prompt },
        ],
      }),
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    setMessages((prev) => [...prev, { sender: "agent", text: reply }]);
    setLoading(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    callMistral(input);
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background shadow-sm">
        {/* Left: App icon + name */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          <NetworkIcon className="text-xl text-blue-600" />
          <span>ComplianceApp</span>
        </div>

        {/* Center: Nav Icons */}
        <nav className="flex gap-6 text-lg">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 transition-colors ${
                isActive(item.path)
                  ? "text-blue-600 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </nav>

        {/* Right: Dark mode toggle + User dropdown */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="" alt="user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Navigate to account")}>
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Logging out...")}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
        {/* Floating Agent (not on AgentPage) */}
        {location.pathname !== "/agent" && (
          <div>
            <div
              className="fixed bottom-6 right-6 z-50 cursor-pointer"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <FaQuestionCircle
                size={48}
                className="text-blue-600 drop-shadow-lg hover:scale-110 transition-transform"
              />
              {open && (
                <div className="absolute bottom-16 right-0 w-80 bg-white border rounded-lg shadow-xl p-4 space-y-3 animate-fade-in">
                  <div className="font-semibold text-base mb-1">
                    Don't know where to start?
                  </div>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                    placeholder="Ask the assistant..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                  />
                  <div className="flex flex-wrap gap-2 mb-2">
                    {floatingPrompts.map((prompt, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(prompt);
                          callMistral(prompt);
                        }}
                        disabled={loading}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                  <div className="h-32 overflow-y-auto border rounded p-2 bg-muted/10 text-xs">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`mb-2 ${
                          msg.sender === "user"
                            ? "text-right"
                            : "text-left text-blue-700"
                        }`}
                      >
                        <strong>
                          {msg.sender === "user" ? "You" : "Agent"}:
                        </strong>{" "}
                        {msg.sender === "agent" ? (
                          <div
                            className="whitespace-pre-wrap"
                            style={{ wordBreak: "break-word" }}
                            dangerouslySetInnerHTML={{
                              __html: msg.text
                                .replace(/\n/g, "<br/>")
                                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                .replace(/\* (.*?)\n/g, "<li>$1</li>")
                                .replace(/\n{2,}/g, "<br/><br/>"),
                            }}
                          />
                        ) : (
                          msg.text
                        )}
                      </div>
                    ))}
                    {loading && (
                      <div className="text-muted-foreground">Thinking...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;