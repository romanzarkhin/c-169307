import React from "react";
import CalendarView from "@/components/CalendarView";
import TaskList from "@/components/TaskList";
import NewsFeed from "@/components/NewsFeed";

const CalendarPage: React.FC = () => {
  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Calendar - 50% */}
      <div className="flex-1 min-w-0">
        <CalendarView />
      </div>

      {/* Tasker - 25% */}
      <div className="w-1/4 min-w-[250px]">
        <TaskList />
      </div>

      {/* News Feed - 25% */}
      <div className="w-1/4 min-w-[250px]">
        <NewsFeed />
      </div>
    </div>
  );
};

export default CalendarPage;
