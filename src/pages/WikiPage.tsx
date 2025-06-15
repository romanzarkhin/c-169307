
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WikiPage = () => {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>WIKI</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the WIKI page. We can build out a document repository here, similar to Google Drive.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WikiPage;
