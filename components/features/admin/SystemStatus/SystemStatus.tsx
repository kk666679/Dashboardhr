import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  { name: "Database", status: "Healthy", uptime: "99.9%" },
  { name: "API Server", status: "Healthy", uptime: "99.8%" },
  { name: "Redis Cache", status: "Healthy", uptime: "99.9%" },
  { name: "File Storage", status: "Degraded", uptime: "99.5%" },
  { name: "Email Service", status: "Healthy", uptime: "99.7%" },
];

export function SystemStatus() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Status</h2>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2GB / 8GB</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120GB / 256GB</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {services.map((s) => (
              <div key={s.name} className="flex justify-between items-center p-2 border-b last:border-0">
                <span>{s.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{s.uptime}</span>
                  <Badge variant={s.status === "Healthy" ? "success" : s.status === "Degraded" ? "warning" : "destructive"}>
                    {s.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
