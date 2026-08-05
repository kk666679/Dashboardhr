"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Award,
  Building,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Coins,
  CreditCard,
  Database,
  FileCheck,
  FileScan,
  FileText,
  Fingerprint,
  Flame,
  Globe,
  Grid,
  HardHat,
  GraduationCap,
  HelpCircle,
  Heart,
  Hospital,
  Landmark,
  Layers,
  Mail,
  MessageSquare,
  Microscope,
  Network,
  Phone,
  PiggyBank,
  Pill,
  QrCode,
  Receipt,
  RefreshCw,
  ScanFace,
  Scale,
  Server,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Syringe,
  TestTube,
  Truck,
  Users,
  UsersRound,
  UserCheck,
  Briefcase,
  Wrench,
  Warehouse,
  Factory,
  Activity,
  BookOpen,
  MapPin,
  ExternalLink,
  Zap,
  Activity as ActivityIcon,
} from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Separator } from "@/components/ui/separator";
import {
  Link as LinkIcon,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";

interface IntegrationService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "jtk"
    | "eppax"
    | "immigration"
    | "hrdc"
    | "niosh"
    | "jpp"
    | "kwsp"
    | "perkeso"
    | "fomema"
    | "medical"
    | "other";
  enabled: boolean;
  requiresIntegration: boolean;
  isIntegrated: boolean;
  endpoint?: string;
  lastSync?: string;
  status?: "active" | "pending" | "error" | "inactive";
  website?: string;
  hotline?: string;
}

// NOTE: Based on the UI structure provided by the user/task request.
const ALL_SERVICES: IntegrationService[] = [
  {
    id: "jtk-workplace-registration",
    name: "Pendaftaran Tempat Pekerjaan (JTK)",
    description: "Daftar tempat pekerjaan di bawah Seksyen 63A, Akta Kerja 1955",
    icon: <Building className="h-5 w-5" />,
    category: "jtk",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://jtksm.mohr.gov.my/api/v1/registration",
    website: "https://jtksm.mohr.gov.my",
    hotline: "+603-8000 8000",
  },
  {
    id: "jtk-foreign-worker-employment",
    name: "Penggajian Pekerja Asing (JTK)",
    description: "Pengurusan penggajian pekerja asing di Malaysia",
    icon: <Users className="h-5 w-5" />,
    category: "jtk",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://jtksm.mohr.gov.my/api/v1/employment",
    website: "https://jtksm.mohr.gov.my",
    hotline: "+603-8000 8000",
  },
  {
    id: "eppax-foreign-worker",
    name: "Sistem Pengurusan Pekerja Asing Bersepadu (ePPAX)",
    description:
      "Sistem bersepadu untuk pengurusan pekerja asing termasuk permohonan dan pembaharuan",
    icon: <Globe className="h-5 w-5" />,
    category: "eppax",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.eppax.gov.my/eppax/api/v1",
    website: "https://www.eppax.gov.my/eppax",
  },
  {
    id: "immigration-foreign-worker",
    name: "Sistem Imigresen Pekerja Asing",
    description:
      "Pengurusan pasport, visa, dan permit pekerja asing melalui Jabatan Imigresen Malaysia",
    icon: <FileText className="h-5 w-5" />,
    category: "immigration",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.imi.gov.my/api/v1",
    website: "https://www.imi.gov.my",
    hotline: "+603-8000 8000",
  },
  {
    id: "hrdc-levy",
    name: "HRDC Levy System",
    description:
      "Pengurusan levi HRDC (Human Resource Development Corporation) untuk pekerja",
    icon: <Award className="h-5 w-5" />,
    category: "hrdc",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.hrdcorp.gov.my/api/v1",
    website: "https://www.hrdcorp.gov.my",
    hotline: "+603-2093 2000",
  },
  {
    id: "niosh-safety",
    name: "NIOSH Safety Management",
    description:
      "Pengurusan keselamatan dan kesihatan pekerjaan melalui NIOSH",
    icon: <HardHat className="h-5 w-5" />,
    category: "niosh",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.niosh.com.my/api/v1",
    website: "https://www.niosh.com.my",
    hotline: "+603-2776 8600",
  },
  {
    id: "jpp-procurement",
    name: "JPP Procurement System",
    description:
      "Sistem perolehan dan kontrak Jabatan Perkhidmatan Pembinaan",
    icon: <Truck className="h-5 w-5" />,
    category: "jpp",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.jpp.gov.my/api/v1",
    website: "https://www.jpp.gov.my",
    hotline: "+603-2172 4000",
  },
  {
    id: "kwsp-contribution",
    name: "KWSP Caruman Pekerja",
    description:
      "Pengurusan caruman KWSP (Kumpulan Wang Simpanan Pekerja) untuk pekerja",
    icon: <PiggyBank className="h-5 w-5" />,
    category: "kwsp",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.kwsp.gov.my/api/v1",
    website: "https://www.kwsp.gov.my",
    hotline: "+603-8922 6000",
  },
  {
    id: "perkeso-socso",
    name: "PERKESO SOCSO System",
    description:
      "Pengurusan caruman SOCSO (Sistem Keselamatan Sosial) melalui PERKESO",
    icon: <ShieldCheck className="h-5 w-5" />,
    category: "perkeso",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.perkeso.gov.my/api/v1",
    website: "https://www.perkeso.gov.my",
    hotline: "+603-4264 5555",
  },
  {
    id: "fomema-screening",
    name: "FOMEMA Medical Screening",
    description:
      "Sistem saringan kesihatan pekerja asing melalui FOMEMA",
    icon: <Microscope className="h-5 w-5" />,
    category: "fomema",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.fomema.com.my/api/v1",
    website: "https://www.fomema.com.my",
    hotline: "+603-5511 3000",
  },
  {
    id: "medical-health-record",
    name: "Sistem Rekod Kesihatan",
    description: "Pengurusan rekod kesihatan pekerja secara digital",
    icon: <ClipboardList className="h-5 w-5" />,
    category: "medical",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.moh.gov.my/api/v1/record",
    website: "https://www.moh.gov.my",
    hotline: "+603-8883 4000",
  },
  {
    id: "mydigital-id",
    name: "MyDigital ID System",
    description: "Sistem identiti digital untuk pengesahan pekerja",
    icon: <Fingerprint className="h-5 w-5" />,
    category: "other",
    enabled: true,
    requiresIntegration: true,
    isIntegrated: false,
    endpoint: "https://www.mydigitalid.gov.my/api/v1",
    website: "https://www.mydigitalid.gov.my",
  },
];

export default function GovernmentsAgenciesIntegrationPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");
  const [services, setServices] = useState<IntegrationService[]>(ALL_SERVICES);

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      activeCategory === "all" || service.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q.length === 0 ||
      service.name.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      jtk: "JTK",
      eppax: "ePPAX",
      immigration: "Immigration",
      hrdc: "HRDC",
      niosh: "NIOSH",
      jpp: "JPP",
      kwsp: "KWSP",
      perkeso: "PERKESO",
      fomema: "FOMEMA",
      medical: "Medical",
      other: "Other",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "jtk":
        return <Building className="h-4 w-4" />;
      case "eppax":
        return <Globe className="h-4 w-4" />;
      case "immigration":
        return <FileText className="h-4 w-4" />;
      case "hrdc":
        return <Award className="h-4 w-4" />;
      case "niosh":
        return <HardHat className="h-4 w-4" />;
      case "jpp":
        return <Truck className="h-4 w-4" />;
      case "kwsp":
        return <PiggyBank className="h-4 w-4" />;
      case "perkeso":
        return <ShieldCheck className="h-4 w-4" />;
      case "fomema":
        return <Microscope className="h-4 w-4" />;
      case "medical":
        return <Stethoscope className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      jtk: "border-blue-500 bg-blue-50 dark:bg-blue-950",
      eppax: "border-green-500 bg-green-50 dark:bg-green-950",
      immigration: "border-purple-500 bg-purple-50 dark:bg-purple-950",
      hrdc: "border-orange-500 bg-orange-50 dark:bg-orange-950",
      niosh: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
      jpp: "border-cyan-500 bg-cyan-50 dark:bg-cyan-950",
      kwsp: "border-pink-500 bg-pink-50 dark:bg-pink-950",
      perkeso: "border-red-500 bg-red-50 dark:bg-red-950",
      fomema: "border-teal-500 bg-teal-50 dark:bg-teal-950",
      medical: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
      other: "border-gray-500 bg-gray-50 dark:bg-gray-950",
    };
    return colors[category] || "border-gray-500 bg-gray-50 dark:bg-gray-950";
  };

  const getStatusBadge = (service: IntegrationService) => {
    if (!service.enabled) return <Badge variant="outline">Disabled</Badge>;
    if (service.requiresIntegration && !service.isIntegrated)
      return <Badge variant="destructive">Not Connected</Badge>;
    if (service.requiresIntegration && service.isIntegrated)
      return <Badge className="bg-green-600 hover:bg-green-600">Connected</Badge>;
    return <Badge variant="default">Available</Badge>;
  };

  const toggleService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  const handleConnect = (serviceId: string) => {
    // Simulated connect
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isIntegrated: true } : s))
    );
  };

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus("syncing");
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => ({ ...s, isIntegrated: true, status: "active" }))
      );
      setIsSyncing(false);
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 2500);
    }, 2500);
  };

  const categoryStats = services.reduce(
    (acc, service) => {
      const cat = service.category;
      if (!acc[cat]) acc[cat] = { total: 0, connected: 0 };
      acc[cat].total += 1;
      if (service.isIntegrated) acc[cat].connected += 1;
      return acc;
    },
    {} as Record<string, { total: number; connected: number }>
  );

  return (
    <PageShell className="space-y-6 p-6">
      <PageHeader
        title="Government Agencies Integration"
        description="Manage and connect integrations with Malaysian government agencies for foreign worker management."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing || syncStatus === "syncing"}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync All
            </Button>
          </div>
        }
        badge={<Share2 className="h-5 w-5 text-primary" />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(categoryStats).map(([category, stats]) => (
          <Card key={category} className="p-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <span className="text-xs font-medium">{getCategoryLabel(category)}</span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold">{stats.connected}</span>
              <span className="text-xs text-muted-foreground ml-1">/ {stats.total}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${(stats.connected / stats.total) * 100}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search agencies/services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            All
          </Button>
          {Object.keys(categoryStats).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`border-l-4 ${getCategoryColor(service.category)}`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${getCategoryColor(service.category)}`}>
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{service.name}</h4>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {getCategoryLabel(service.category)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {service.description}
                    </p>
                    {service.website && (
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  {getStatusBadge(service)}
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {service.hotline && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {service.hotline}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {service.requiresIntegration && (
                    <Button
                      size="sm"
                      variant={service.isIntegrated ? "outline" : "default"}
                      onClick={() => handleConnect(service.id)}
                      disabled={service.isIntegrated}
                      className="text-xs"
                    >
                      {service.isIntegrated ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                  <Switch
                    checked={service.enabled}
                    onCheckedChange={() => toggleService(service.id)}
                    disabled={service.requiresIntegration && !service.isIntegrated}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found matching your criteria</p>
        </div>
      )}
    </PageShell>
  );
}

