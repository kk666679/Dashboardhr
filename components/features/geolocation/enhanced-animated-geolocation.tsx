"use client";
import {
  containerVariants,
  itemVariants,
  pulseVariants,
  radarVariants,
} from "@/lib/motion-variants";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Users,
  AlertTriangle,
  Shield,
  Clock,
  Activity,
  Smartphone,
  Zap,
  RefreshCw,
  Settings,
  Phone,
  Navigation,
  Target,
  Radar,
  Satellite,
  Globe,
  Battery,
  Signal,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Square,
  Building2 as Building,
} from "lucide-react";

import type { FeatureCollection, Polygon } from "geojson";

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  status: string;
}

interface WorkerData {
  id: string;
  name: string;
  location: string;
  status: string;
  battery: number;
  signal: number;
  lastUpdate: string;
  coordinates: { lat: number; lng: number };
}

interface GeofenceData {
  name: string;
  type: string;
  status: string;
  workers: number;
  alerts: number;
}

interface GeoApiResponse {
  workers: WorkerData[];
  geofences: GeofenceData[];
  activeTrackers: number;
}

export function EnhancedAnimatedGeolocation() {
  const [isTracking, setIsTracking] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null);
  const [viewMode, setViewMode] = useState("map");
  const [refreshing, setRefreshing] = useState(false);
  const [geoData, setGeoData] = useState<GeoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const workersRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true });
  const isWorkersInView = useInView(workersRef, { once: true });

  useEffect(() => {
    fetch("/api/geolocation")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GeoApiResponse>;
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const workers = geoData?.workers ?? [];
  const geofences = geoData?.geofences ?? [];
  const activeTrackers = geoData?.activeTrackers ?? 0;

  const stats: Stat[] = [
    {
      title: "Active Trackers",
      value: activeTrackers.toString(),
      change: "+12 since last hour",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      status: "live",
    },
    {
      title: "Geofence Alerts",
      value: geofences.reduce((sum, g) => sum + g.alerts, 0).toString(),
      change: "Requires attention",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      status: "warning",
    },
    {
      title: "Emergency SOS",
      value: "3",
      change: "Immediate response needed",
      icon: Phone,
      color: "text-red-600",
      bgColor: "bg-red-100",
      status: "critical",
    },
    {
      title: "Coverage Areas",
      value: geofences.length.toString(),
      change: "+2 new zones added",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100",
      status: "normal",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-medium">Failed to load geolocation data</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/geolocation");
      const data = (await res.json()) as GeoApiResponse;
      setGeoData(data);
    } catch {
      // keep existing data
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto" ref={statsRef}>
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                variants={radarVariants}
                animate="scan"
                className="text-green-600"
              >
                <Radar className="w-8 h-8" />
              </motion.div>
              <span>Live Tracking</span>
              <motion.div variants={pulseVariants} animate="pulse">
                <Badge className="bg-green-500 text-white">LIVE</Badge>
              </motion.div>
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Real-time GPS monitoring with geofencing and emergency response
            </motion.p>
          </div>

          <motion.div
            className="flex items-center space-x-3 mt-4 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Tracking</span>
              <Switch checked={isTracking} onCheckedChange={setIsTracking} />
            </div>

            <select
              value={viewMode}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setViewMode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <option value="map">Map View</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    <div className="mt-2">
                      <Badge
                        variant={
                          stat.status === "critical"
                            ? "destructive"
                            : stat.status === "warning"
                            ? "secondary"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {stat.status === "live"
                          ? "Live"
                          : stat.status === "critical"
                          ? "Critical"
                          : stat.status === "warning"
                          ? "Warning"
                          : "Normal"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Workers Section */}
        <motion.div
          ref={workersRef}
          variants={containerVariants}
          initial="hidden"
          animate={isWorkersInView ? "visible" : "hidden"}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Tracked Workers ({workers.length})</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Signal className="w-4 h-4 text-green-500" />
              <span>All active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.length > 0 ? (
              workers.map((worker) => (
                <motion.div
                  key={worker.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedWorker(worker)}
                >
                  <Card
                    className={`transition-all duration-300 ${
                      selectedWorker?.id === worker.id
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{worker.name}</p>
                            <p className="text-xs text-muted-foreground">{worker.location}</p>
                          </div>
                        </div>
                        <Badge
                          variant={worker.status === "active" ? "default" : "secondary"}
                          className={worker.status === "active" ? "bg-green-500" : ""}
                        >
                          {worker.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Battery className="w-3 h-3" />
                          <span>{worker.battery}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Signal className="w-3 h-3" />
                          <span>{worker.signal}%</span>
                        </div>
                        <div className="flex items-center space-x-1 col-span-2">
                          <Clock className="w-3 h-3" />
                          <span>Updated: {worker.lastUpdate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No workers being tracked currently.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Geofences Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span>Geofence Zones ({geofences.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geofences.length > 0 ? (
              geofences.map((geofence, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{geofence.name}</h3>
                        <Badge
                          variant={
                            geofence.status === "active"
                              ? "default"
                              : geofence.status === "warning"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {geofence.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{geofence.workers} workers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{geofence.alerts} alerts</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No geofence zones configured.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-green-500" />
              <span>System Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>GPS Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-purple-500" />
              <span>Encrypted</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Satellite className="w-3 h-3" />
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}