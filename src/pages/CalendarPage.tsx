import React, { useState } from "react";
import CalendarView from "@/components/CalendarView";
import TaskList from "@/components/TaskList";
import NewsFeed from "@/components/NewsFeed";

// LocalStorage keys for Calendar and Tasker
const CALENDAR_KEY = "calendar-events";
const TASKER_KEY = "calendar-tasker";

function saveCalendarToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadCalendarFromStorage<T>(key: string, fallback: T): T {
  const val = localStorage.getItem(key);
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

const CalendarPage: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState(/* initial value here */);
  const [tasker, setTasker] = useState(/* initial value here */);

  // Load from localStorage on mount
  React.useEffect(() => {
    setCalendarEvents(loadCalendarFromStorage(CALENDAR_KEY, calendarEvents));
    setTasker(loadCalendarFromStorage(TASKER_KEY, tasker));
  }, []);

  // Save to localStorage on change
  React.useEffect(() => {
    saveCalendarToStorage(CALENDAR_KEY, calendarEvents);
  }, [calendarEvents]);
  React.useEffect(() => {
    saveCalendarToStorage(TASKER_KEY, tasker);
  }, [tasker]);

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Calendar - 75% */}
      <div className="flex-[3] min-w-0">
        <CalendarView />
      </div>

      {/* Right Panel - 25% */}
      <div className="flex flex-col w-1/4 min-w-[250px] gap-4">
        <TaskList />
        <NewsFeed />
      </div>
    </div>
  );
};

export default CalendarPage;
