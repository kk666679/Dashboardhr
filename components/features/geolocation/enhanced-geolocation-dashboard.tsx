import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ChartCard } from "@/components/charts";
import { Activity, MapPin, Users, AlertTriangle } from "lucide-react";

const locationData = [
  { day: "Mon", active: 45, alerts: 2 },
  { day: "Tue", active: 52, alerts: 1 },
  { day: "Wed", active: 48, alerts: 3 },
  { day: "Thu", active: 55, alerts: 0 },
  { day: "Fri", active: 60, alerts: 2 },
];

export function EnhancedGeolocationDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Geolocation Dashboard</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Active Devices</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Geofence Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Tracked Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Active Geofences</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Daily Activity">
          <BarChart data={locationData} xKey="day" yKey={["active", "alerts"]} />
        </ChartCard>
        <ChartCard title="Alert Trend">
          <LineChart data={locationData} xKey="day" yKey="alerts" />
        </ChartCard>
      </div>
    </div>
  );
}
