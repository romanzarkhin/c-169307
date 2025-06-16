import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  assignedTo?: string;
  accepted: boolean;
}

const mockSuggestedTasks: Task[] = [
  { id: 1001, title: "Review SAR draft", completed: false, accepted: false },
  { id: 1002, title: "Update vendor list", completed: false, accepted: false },
  { id: 1003, title: "Prepare audit summary", completed: false, accepted: false },
];

const teamMembers = ["Dana", "Lotem", "Yossi"];

const TASKS_KEY = "calendar-tasks";
function saveTasksToStorage(value: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(value));
}
function loadTasksFromStorage(): Task[] {
  const val = localStorage.getItem(TASKS_KEY);
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [suggested, setSuggested] = useState<Task[]>(mockSuggestedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [assignee, setAssignee] = useState<string>("");

  const acceptTask = (task: Task) => {
    const accepted = { ...task, accepted: true };
    setTasks([accepted, ...tasks]);
    setSuggested(suggested.filter((t) => t.id !== task.id));
    setSelectedTask(accepted);
  };

  const assignTask = () => {
    if (!selectedTask || !assignee) return;
    setTasks(
      tasks.map((t) =>
        t.id === selectedTask.id ? { ...t, assignedTo: assignee } : t
      )
    );
    setSelectedTask(null);
    setAssignee("");
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Save to localStorage on change
  React.useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-4">
        {/* Suggested Tasks */}
        {suggested.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Suggested Tasks</h4>
            {suggested.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-sm border rounded p-2"
              >
                <span>{task.title}</span>
                <Button size="sm" onClick={() => acceptTask(task)}>Accept</Button>
              </div>
            ))}
          </div>
        )}

        {/* Assign selected task */}
        {selectedTask && (
          <div className="space-y-2 border p-3 rounded">
            <h4 className="text-sm font-semibold">Assign: {selectedTask.title}</h4>
            <Label htmlFor="assignee">Assign to</Label>
            <select
              id="assignee"
              className="w-full border rounded p-1"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Select user</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
            <Button size="sm" onClick={assignTask}>Confirm Assignment</Button>
          </div>
        )}

        {/* Active Task List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between text-sm border rounded p-2"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleComplete(task.id)}
                />
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </span>
              </div>
              {task.assignedTo && (
                <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
