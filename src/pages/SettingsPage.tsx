
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Settings page. Application and user preferences will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
