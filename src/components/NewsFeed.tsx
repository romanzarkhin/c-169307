import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
  id: number;
  content: string;
  timestamp: Date;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const exampleUpdates = [
      {
        id: 1,
        content: "Dana approved the latest AML policy update.",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        id: 2,
        content: "Lotem uploaded a new SAR template.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
    ];

    const taskActivity = [
      {
        id: 3,
        content: "Task 'Prepare audit summary' was assigned to Dana.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        id: 4,
        content: "Task 'Review SAR draft' marked complete by Lotem.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
    ];

    setNews([...taskActivity, ...exampleUpdates]);
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>News Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-4 text-sm">
        {news
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .map((item) => (
            <div key={item.id}>
              <div className="text-muted-foreground text-xs">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </div>
              <div>{item.content}</div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
