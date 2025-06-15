
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="p-4 md:p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Welcome to Your Compliance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Here is a summary of your team's compliance status and activities. More widgets will be added soon!</p>
        </CardContent>
      </Card>
      {/* Add more summary cards here in the future */}
    </div>
  );
};

export default HomePage;
