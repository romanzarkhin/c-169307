import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const suggestedPrompts = [
  "Summarize today's compliance tasks",
  "Check document review status",
  "Suggest follow-up actions for overdue reports",
  "What are the flagged issues this week?"
];

const AgentChatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const callMistral = async (prompt: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: prompt }]);

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer vM9hqQvYmkB5wBbMI0mbkTa9dZiKOHUm`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [
          { role: "system", content: "You are a helpful assistant integrated into a compliance monitoring app. Answer with actionable, relevant compliance insights." },
          ...messages.map((msg) => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text })),
          { role: "user", content: prompt }
        ]
      })
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
    <Card className="h-full max-w-3xl mx-auto p-4">
      <CardHeader>
        <CardTitle>Compliance Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 overflow-y-auto border rounded p-4 bg-muted/10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 text-sm ${msg.sender === "user" ? "text-right" : "text-left text-blue-700"}`}>
              <strong>{msg.sender === "user" ? "You" : "Agent"}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <Input
            className="flex-grow"
            placeholder="Ask the assistant..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading}>
            Send
          </Button>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">Suggested prompts:</div>
        <div className="flex flex-wrap gap-2 text-sm">
          {suggestedPrompts.map((prompt, i) => (
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
      </CardContent>
    </Card>
  );
};

export default AgentChatbot;
