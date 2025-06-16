import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  format,
  addWeeks,
} from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

interface Event {
  id: number;
  date: string;
  title: string;
  recurring?: "weekly" | "none";
}

interface NewEvent {
  title: string;
  date: string;
  recurring: "weekly" | "none";
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CALENDAR_EVENTS_KEY = "calendar-events";
function saveCalendarEventsToStorage(value: Event[]) {
  localStorage.setItem(CALENDAR_EVENTS_KEY, JSON.stringify(value));
}
function loadCalendarEventsFromStorage(): Event[] {
  const val = localStorage.getItem(CALENDAR_EVENTS_KEY);
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

const CalendarView: React.FC = () => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const totalDays = 42;
  const calendarDays = Array.from({ length: totalDays }, (_, i) => addDays(calendarStart, i));

  const [events, setEvents] = useState<Event[]>(() => loadCalendarEventsFromStorage());
  const [newEvent, setNewEvent] = useState<NewEvent>({ title: "", date: format(today, "yyyy-MM-dd"), recurring: "none" });
  const [hoverWeek, setHoverWeek] = useState<number | null>(null);

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    const baseDate = new Date(newEvent.date);
    const instances: Event[] = [
      {
        id: Date.now(),
        title: newEvent.title,
        date: newEvent.date,
        recurring: newEvent.recurring,
      },
    ];

    if (newEvent.recurring === "weekly") {
      for (let i = 1; i < 5; i++) {
        const futureDate = addWeeks(baseDate, i);
        instances.push({
          id: Date.now() + i,
          title: `${newEvent.title} (wk ${i + 1})`,
          date: format(futureDate, "yyyy-MM-dd"),
          recurring: "weekly",
        });
      }
    }

    setEvents((prev: Event[]) => [...instances, ...prev]);
    setNewEvent({ title: "", date: format(today, "yyyy-MM-dd"), recurring: "none" });
  };

  // Save to localStorage on change
  React.useEffect(() => {
    saveCalendarEventsToStorage(events);
  }, [events]);

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>This Month</CardTitle>
        <a
          href="https://accounts.google.com/o/oauth2/v2/auth"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <FaGoogle className="text-lg" />
          Sign in with Google
        </a>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Event UI */}
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            className="w-1/3"
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <Input
            type="date"
            className="w-1/3"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <select
            className="border px-2 py-1 rounded"
            value={newEvent.recurring}
            onChange={(e) => setNewEvent({ ...newEvent, recurring: e.target.value as "none" | "weekly" })}
          >
            <option value="none">One-time</option>
            <option value="weekly">Repeat weekly</option>
          </select>
          <Button onClick={addEvent}>Add</Button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 text-xs font-semibold text-center">
          {weekdayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 6 }).map((_, weekIndex) => {
            const weekDays = calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7);
            const isHovered = hoverWeek === weekIndex;

            return (
              <div
                key={weekIndex}
                className="contents"
                onMouseEnter={() => setHoverWeek(weekIndex)}
                onMouseLeave={() => setHoverWeek(null)}
              >
                {weekDays.map((day) => {
                  const dayISO = format(day, "yyyy-MM-dd");
                  const dayEvents = events.filter((e) => e.date === dayISO);
                  const isDimmed = hoverWeek !== null && !isHovered;

                  return (
                    <div
                      key={dayISO}
                      className={`p-2 border rounded text-xs min-h-[80px] transition-all duration-200 ${
                        isDimmed ? "blur-[2px] opacity-50" : ""
                      } ${isHovered ? "scale-[1.02] bg-muted/10" : ""}`}
                    >
                      <div className="font-semibold text-center">
                        {format(day, "d")}
                      </div>
                      <ul className="mt-1 list-disc list-inside">
                        {dayEvents.map((e) => (
                          <li key={e.id}>{e.title}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
