import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Platform configuration and content management</p>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will include content management, site settings, and other configuration options in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
