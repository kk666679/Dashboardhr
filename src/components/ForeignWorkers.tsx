import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Building2,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  Activity,
  Brain,
  Zap,
  Flag,
  Shield,
  XCircle,
  Upload,
  FileCheck,
  BellRing,
  Heart,
  Stethoscope,
  Pill,
  Home,
  Bed,
  DollarSign,
  Phone,
  Mail,
  Briefcase,
  User,
  UserCheck,
  ClipboardCheck,
  Hospital,
  Siren,
  Plane,
  BadgeCheck,
  Receipt,
} from 'lucide-react';
import {
  GlassmorphicCard,
  StaggerContainer,
  StaggerItem,
  SlideIn,
  GlassButton,
  AnimatedCounter,
  GlassInput,
} from './GlassmorphicCard';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'workers' | 'permits' | 'fomema' | 'special-pass' | 'compliance' | 'analytics';

interface ForeignWorker {
  id: string;
  name: string;
  nationality: string;
  position: string;
  department: string;
  passportNumber: string;
  visaType: 'EP' | 'WP' | 'DP' | 'SP' | 'PLKS' | 'PVP';
  visaStatus: 'Active' | 'Expiring Soon' | 'Expired' | 'Pending Renewal';
  visaExpiry: string;
  employmentStart: string;
  sponsor: string;
  levy: number;
  workPermitStatus: 'Valid' | 'Expiring' | 'Expired' | 'Processing';
  fomemaStatus?: 'Fit' | 'Unfit' | 'Pending' | 'Expired';
  fomemaExpiry?: string;
  lastMedicalCheck?: string;
  specialPass?: 'Active' | 'None' | 'Expired';
  specialPassType?: string;
  specialPassExpiry?: string;
}

interface FomemaRecord {
  id: string;
  workerName: string;
  workerPassport: string;
  registrationDate: string;
  medicalDate: string;
  expiryDate: string;
  status: 'Fit' | 'Unfit' | 'Pending' | 'Expired';
  clinic: string;
  cost: number;
  diseases?: string[];
}

interface SpecialPass {
  id: string;
  workerName: string;
  passType: 'Immigration Special Pass' | 'Social Visit Pass' | 'Emergency Pass' | 'PLKS';
  reason: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  referenceNumber: string;
}

export function ForeignWorkers() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const workers: ForeignWorker[] = [
    {
      id: 'FW-001',
      name: 'Michael Chen Wei',
      nationality: 'Singapore',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      passportNumber: 'S1234567A',
      visaType: 'EP',
      visaStatus: 'Active',
      visaExpiry: '2025-06-30',
      employmentStart: '2023-07-01',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 0,
      workPermitStatus: 'Valid',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2025-07-01',
      lastMedicalCheck: '2024-06-15',
      specialPass: 'None',
    },
    {
      id: 'FW-002',
      name: 'Ramesh Kumar',
      nationality: 'India',
      position: 'Data Analyst',
      department: 'Analytics',
      passportNumber: 'L9876543',
      visaType: 'EP',
      visaStatus: 'Expiring Soon',
      visaExpiry: '2025-01-15',
      employmentStart: '2022-01-15',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 0,
      workPermitStatus: 'Expiring',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2025-02-01',
      lastMedicalCheck: '2024-01-20',
      specialPass: 'None',
    },
    {
      id: 'FW-003',
      name: 'Nguyen Thi Mai',
      nationality: 'Vietnam',
      position: 'Production Worker',
      department: 'Manufacturing',
      passportNumber: 'B4567890',
      visaType: 'WP',
      visaStatus: 'Active',
      visaExpiry: '2025-09-20',
      employmentStart: '2023-09-20',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 1850,
      workPermitStatus: 'Valid',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2025-09-20',
      lastMedicalCheck: '2023-09-10',
      specialPass: 'None',
    },
    {
      id: 'FW-004',
      name: 'John David Smith',
      nationality: 'United Kingdom',
      position: 'Business Consultant',
      department: 'Operations',
      passportNumber: 'UK123456',
      visaType: 'EP',
      visaStatus: 'Active',
      visaExpiry: '2026-03-15',
      employmentStart: '2024-03-15',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 0,
      workPermitStatus: 'Valid',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2026-03-15',
      lastMedicalCheck: '2024-03-10',
      specialPass: 'None',
    },
    {
      id: 'FW-005',
      name: 'Yuki Tanaka',
      nationality: 'Japan',
      position: 'Quality Assurance Manager',
      department: 'Quality Control',
      passportNumber: 'JP7890123',
      visaType: 'EP',
      visaStatus: 'Active',
      visaExpiry: '2025-11-30',
      employmentStart: '2023-11-30',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 0,
      workPermitStatus: 'Valid',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2025-11-30',
      lastMedicalCheck: '2023-11-15',
      specialPass: 'None',
    },
    {
      id: 'FW-006',
      name: 'Rahman Bin Abdullah',
      nationality: 'Indonesia',
      position: 'Warehouse Assistant',
      department: 'Logistics',
      passportNumber: 'ID5432109',
      visaType: 'WP',
      visaStatus: 'Expiring Soon',
      visaExpiry: '2024-12-25',
      employmentStart: '2022-12-25',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 1850,
      workPermitStatus: 'Expiring',
      fomemaStatus: 'Pending',
      fomemaExpiry: '2024-12-25',
      lastMedicalCheck: '2022-12-15',
      specialPass: 'Active',
      specialPassType: 'Immigration Special Pass',
      specialPassExpiry: '2024-12-31',
    },
    {
      id: 'FW-007',
      name: 'Siti Aminah',
      nationality: 'Bangladesh',
      position: 'Cleaner',
      department: 'Facilities',
      passportNumber: 'BD9876543',
      visaType: 'WP',
      visaStatus: 'Active',
      visaExpiry: '2025-08-15',
      employmentStart: '2023-08-15',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 1850,
      workPermitStatus: 'Valid',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2025-08-15',
      lastMedicalCheck: '2023-08-10',
      specialPass: 'None',
    },
    {
      id: 'FW-008',
      name: 'Kumar Sharma',
      nationality: 'Nepal',
      position: 'Security Guard',
      department: 'Security',
      passportNumber: 'NP1234567',
      visaType: 'WP',
      visaStatus: 'Active',
      visaExpiry: '2025-05-20',
      employmentStart: '2023-05-20',
      sponsor: 'Tech Solutions Sdn Bhd',
      levy: 1850,
      workPermitStatus: 'Valid',
      fomemaStatus: 'Fit',
      fomemaExpiry: '2025-05-20',
      lastMedicalCheck: '2023-05-15',
      specialPass: 'None',
    },
  ];

  const fomemaRecords: FomemaRecord[] = [
    {
      id: 'FOMEMA-001',
      workerName: 'Nguyen Thi Mai',
      workerPassport: 'B4567890',
      registrationDate: '2023-08-15',
      medicalDate: '2023-09-10',
      expiryDate: '2025-09-20',
      status: 'Fit',
      clinic: 'Klinik Kesihatan Panel FOMEMA Putrajaya',
      cost: 220,
    },
    {
      id: 'FOMEMA-002',
      workerName: 'Rahman Bin Abdullah',
      workerPassport: 'ID5432109',
      registrationDate: '2024-11-01',
      medicalDate: '2024-11-15',
      expiryDate: '2024-12-25',
      status: 'Pending',
      clinic: 'Klinik Panel FOMEMA KL',
      cost: 220,
    },
    {
      id: 'FOMEMA-003',
      workerName: 'Siti Aminah',
      workerPassport: 'BD9876543',
      registrationDate: '2023-08-01',
      medicalDate: '2023-08-10',
      expiryDate: '2025-08-15',
      status: 'Fit',
      clinic: 'Klinik Panel FOMEMA Selangor',
      cost: 220,
    },
    {
      id: 'FOMEMA-004',
      workerName: 'Kumar Sharma',
      workerPassport: 'NP1234567',
      registrationDate: '2023-05-10',
      medicalDate: '2023-05-15',
      expiryDate: '2025-05-20',
      status: 'Fit',
      clinic: 'Klinik Kesihatan FOMEMA Johor',
      cost: 220,
    },
  ];

  const specialPasses: SpecialPass[] = [
    {
      id: 'SP-001',
      workerName: 'Rahman Bin Abdullah',
      passType: 'Immigration Special Pass',
      reason: 'Work permit renewal in progress',
      issueDate: '2024-11-25',
      expiryDate: '2024-12-31',
      status: 'Active',
      referenceNumber: 'ISP-2024-001234',
    },
    {
      id: 'SP-002',
      workerName: 'Mohamed Ali',
      passType: 'Social Visit Pass',
      reason: 'Family visit during permit processing',
      issueDate: '2024-10-15',
      expiryDate: '2024-12-15',
      status: 'Expired',
      referenceNumber: 'SVP-2024-005678',
    },
  ];

  const totalWorkers = workers.length;
  const expiringVisa = workers.filter(w => w.visaStatus === 'Expiring Soon' || w.workPermitStatus === 'Expiring').length;
  const activePermits = workers.filter(w => w.visaStatus === 'Active').length;
  const totalLevy = workers.reduce((sum, w) => sum + w.levy, 0);
  const fomemaFit = workers.filter(w => w.fomemaStatus === 'Fit').length;
  const fomemaPending = workers.filter(w => w.fomemaStatus === 'Pending').length;
  const specialPassActive = workers.filter(w => w.specialPass === 'Active').length;

  const stats = [
    {
      label: 'Total Foreign Workers',
      value: totalWorkers,
      change: '+2 this quarter',
      icon: Users,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'Expiring Soon',
      value: expiringVisa,
      change: 'Requires renewal',
      icon: AlertTriangle,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
    {
      label: 'FOMEMA Fit',
      value: fomemaFit,
      change: `${fomemaPending} pending`,
      icon: Stethoscope,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Monthly Levy',
      value: totalLevy,
      prefix: 'RM ',
      change: 'Per month',
      icon: DollarSign,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
  ];

  // Analytics Data
  const nationalityData = [
    { name: 'Indonesia', value: 2, fill: '#8B5CF6' },
    { name: 'Vietnam', value: 1, fill: '#EC4899' },
    { name: 'Bangladesh', value: 1, fill: '#10B981' },
    { name: 'Nepal', value: 1, fill: '#F59E0B' },
    { name: 'Others', value: 3, fill: '#3B82F6' },
  ];

  const visaTypeData = [
    { type: 'EP (Employment Pass)', count: 4, levy: 0 },
    { type: 'WP (Work Permit)', count: 4, levy: 7400 },
  ];

  const monthlyLevyData = [
    { month: 'Jul', levy: 7400, workers: 4 },
    { month: 'Aug', levy: 7400, workers: 4 },
    { month: 'Sep', levy: 7400, workers: 4 },
    { month: 'Oct', levy: 7400, workers: 4 },
    { month: 'Nov', levy: 7400, workers: 4 },
    { month: 'Dec', levy: 7400, workers: 4 },
  ];

  const expiryTimelineData = [
    { month: 'Dec 24', expiring: 2 },
    { month: 'Jan 25', expiring: 1 },
    { month: 'Feb 25', expiring: 0 },
    { month: 'Mar 25', expiring: 0 },
    { month: 'Apr 25', expiring: 0 },
    { month: 'May 25', expiring: 1 },
  ];

  const fomemaStatusData = [
    { status: 'Fit', count: fomemaFit, fill: '#10B981' },
    { status: 'Pending', count: fomemaPending, fill: '#F59E0B' },
    { status: 'Expired', count: 0, fill: '#EF4444' },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  const getVisaStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Valid':
      case 'Fit':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Expiring Soon':
      case 'Expiring':
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Expired':
      case 'Unfit':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 transition-all">
              <Plus className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Add Worker</span>
            </button>
            <button
              onClick={() => setViewMode('fomema')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 transition-all"
            >
              <Stethoscope className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">FOMEMA</span>
            </button>
            <button
              onClick={() => setViewMode('special-pass')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 transition-all"
            >
              <BadgeCheck className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Special Pass</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 transition-all">
              <Download className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Reports</span>
            </button>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Workers by Nationality</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <PieChart>
                  <Pie
                    data={nationalityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {nationalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Visa Type Distribution</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <BarChart data={visaTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="type" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Levy Payments (RM)</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <AreaChart data={monthlyLevyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="levy" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Permit Expiry Timeline</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <LineChart data={expiryTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="expiring" stroke="#EF4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Expiring Permits Alert */}
      {expiringVisa > 0 && (
        <GlassmorphicCard gradient="from-red-50/80 to-orange-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">⚠️ Urgent: {expiringVisa} Permits Expiring Soon</h3>
                <p className="text-red-700 mb-4">
                  The following workers have permits expiring within 30 days. Immediate action required to avoid penalties.
                </p>
                <div className="space-y-2">
                  {workers
                    .filter(w => w.visaStatus === 'Expiring Soon' || w.workPermitStatus === 'Expiring')
                    .map(worker => (
                      <div key={worker.id} className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{worker.name}</p>
                          <p className="text-sm text-gray-600">
                            {worker.visaType} expires: {worker.visaExpiry}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                          Renew Now
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      )}
    </div>
  );

  const renderWorkers = () => (
    <div className="space-y-6">
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Worker</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nationality</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Visa Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Visa Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">FOMEMA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker, index) => (
                <motion.tr
                  key={worker.id}
                  className="border-b border-gray-100 hover:bg-white/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{worker.name}</p>
                      <p className="text-sm text-gray-600">{worker.position}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{worker.nationality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                      {worker.visaType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getVisaStatusColor(worker.visaStatus)}`}>
                      {worker.visaStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{worker.visaExpiry}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getVisaStatusColor(worker.fomemaStatus || 'None')}`}>
                      {worker.fomemaStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderFomema = () => (
    <div className="space-y-6">
      {/* FOMEMA Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassmorphicCard gradient="from-green-50/80 to-emerald-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fit Workers</p>
                <p className="text-3xl font-bold text-green-600">{fomemaFit}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-orange-50/80 to-amber-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tests</p>
                <p className="text-3xl font-bold text-orange-600">{fomemaPending}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-blue-600">RM {fomemaRecords.reduce((sum, r) => sum + r.cost, 0)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* FOMEMA Status Chart */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">FOMEMA Status Distribution</h3>
          <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <PieChart>
                <Pie
                  data={fomemaStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {fomemaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>

      {/* FOMEMA Records */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">FOMEMA Medical Records</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
              <Plus className="w-4 h-4" />
              Register Medical Check
            </button>
          </div>
          <div className="space-y-4">
            {fomemaRecords.map((record, index) => (
              <motion.div
                key={record.id}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{record.workerName}</h4>
                        <p className="text-sm text-gray-600">Passport: {record.workerPassport}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getVisaStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Registration</p>
                        <p className="font-semibold text-gray-900">{record.registrationDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Medical Date</p>
                        <p className="font-semibold text-gray-900">{record.medicalDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expiry Date</p>
                        <p className="font-semibold text-gray-900">{record.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cost</p>
                        <p className="font-semibold text-gray-900">RM {record.cost}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <Hospital className="w-4 h-4 inline mr-1" />
                        {record.clinic}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>

      {/* FOMEMA Information */}
      <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">📋 About FOMEMA Medical Examination</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>✓ Mandatory for all foreign workers in Malaysia</p>
                <p>✓ Cost: RM 220 per examination (as of 2024)</p>
                <p>✓ Valid for the duration of work permit</p>
                <p>✓ Tests include: HIV, TB, Hepatitis B, Malaria, Drug screening, Pregnancy test</p>
                <p>✓ Results available within 3-5 working days</p>
                <p>✓ Must be conducted at FOMEMA-registered clinics only</p>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderSpecialPass = () => (
    <div className="space-y-6">
      {/* Special Pass Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassmorphicCard gradient="from-purple-50/80 to-violet-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Passes</p>
                <p className="text-3xl font-bold text-purple-600">{specialPassActive}</p>
              </div>
              <BadgeCheck className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-orange-50/80 to-amber-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-orange-600">1</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Issued</p>
                <p className="text-3xl font-bold text-blue-600">{specialPasses.length}</p>
              </div>
              <FileCheck className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Special Pass Records */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Special Pass Records</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
              <Plus className="w-4 h-4" />
              Apply Special Pass
            </button>
          </div>
          <div className="space-y-4">
            {specialPasses.map((pass, index) => (
              <motion.div
                key={pass.id}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BadgeCheck className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{pass.workerName}</h4>
                        <p className="text-sm text-gray-600">{pass.passType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getVisaStatusColor(pass.status)}`}>
                        {pass.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Issue Date</p>
                        <p className="font-semibold text-gray-900">{pass.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expiry Date</p>
                        <p className="font-semibold text-gray-900">{pass.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reference No.</p>
                        <p className="font-semibold text-gray-900">{pass.referenceNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-semibold text-gray-900">{pass.status}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-900">
                        <strong>Reason:</strong> {pass.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>

      {/* Special Pass Types Information */}
      <GlassmorphicCard gradient="from-purple-50/80 to-violet-50/60" blur="xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 mb-3">📋 Types of Special Pass in Malaysia</h3>
              <div className="space-y-3 text-sm text-purple-800">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">🔷 Immigration Special Pass (ISP)</p>
                  <p>Issued during work permit renewal or processing period. Validity: 1-3 months.</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">🔷 Social Visit Pass (SVP)</p>
                  <p>Temporary pass for family visits or short stays. Validity: Up to 6 months.</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">🔷 Emergency Pass</p>
                  <p>For workers with expired passes pending resolution. Validity: 14-30 days.</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">🔷 PLKS (Program Legalisasi Khas)</p>
                  <p>Special legalization program for undocumented workers. Validity: Varies by program.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <SlideIn direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                🌏 Foreign Workers Management
              </motion.h1>
              <p className="text-gray-600 mt-2">Manage work permits, FOMEMA, and compliance</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </GlassButton>
              <GlassButton variant="primary" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Worker
              </GlassButton>
            </div>
          </div>
        </SlideIn>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={index}>
                <GlassmorphicCard
                  gradient={`${stat.gradient.replace('/80', '/10')} backdrop-blur-xl`}
                  animation="scale"
                  delay={index * 0.1}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <motion.p
                          className="text-3xl font-bold text-gray-900"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                        >
                          {stat.prefix}
                          <AnimatedCounter value={stat.value} duration={2} />
                        </motion.p>
                      </div>
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600">{stat.change}</p>
                  </div>
                </GlassmorphicCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Navigation */}
        <SlideIn direction="down" delay={0.1}>
          <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
            <div className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                  { id: 'workers', name: 'Workers', icon: Users },
                  { id: 'permits', name: 'Permits', icon: FileCheck },
                  { id: 'fomema', name: 'FOMEMA', icon: Stethoscope },
                  { id: 'special-pass', name: 'Special Pass', icon: BadgeCheck },
                  { id: 'compliance', name: 'Compliance', icon: Shield },
                  { id: 'analytics', name: 'Analytics', icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${ 
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-white/30 text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassmorphicCard>
        </SlideIn>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'dashboard' && renderDashboard()}
            {viewMode === 'workers' && renderWorkers()}
            {viewMode === 'fomema' && renderFomema()}
            {viewMode === 'special-pass' && renderSpecialPass()}
            {viewMode === 'permits' && <div className="text-center p-12 text-gray-500">Permits view coming soon</div>}
            {viewMode === 'compliance' && <div className="text-center p-12 text-gray-500">Compliance view coming soon</div>}
            {viewMode === 'analytics' && <div className="text-center p-12 text-gray-500">Analytics view coming soon</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}