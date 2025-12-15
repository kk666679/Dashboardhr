import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Users,
  Briefcase,
  Home,
  DollarSign,
  GraduationCap,
  Heart,
  Plane,
  Car,
  Shield,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Building2,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  Award,
  Wallet,
  Target,
  Activity,
  UserCheck,
  BadgeCheck,
  Stethoscope,
  Receipt,
  School,
  Baby,
  Package,
  Languages,
  HandHeart,
  BarChart3,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'dashboard' | 'expatriates' | 'relocation' | 'compensation' | 'compliance' | 'tax' | 'benefits';

interface Expatriate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  nationality: string;
  homeCountry: string;
  passportNumber: string;
  employmentPassType: 'EP1' | 'EP2' | 'EP3';
  epStatus: 'Active' | 'Expiring Soon' | 'Renewal Required';
  epExpiry: string;
  salary: number;
  salaryGrade: string;
  assignmentStart: string;
  assignmentEnd: string;
  taxStatus: 'Resident' | 'Non-Resident' | 'Transitioning';
  dependents: number;
  housingAllowance: number;
  transportAllowance: number;
  educationAllowance: number;
  relocationStatus: 'Completed' | 'In Progress' | 'Pending';
  sponsor: string;
}

interface RelocationPackage {
  id: string;
  expatName: string;
  packageType: 'Standard' | 'Executive' | 'Senior Executive';
  status: 'Planning' | 'In Progress' | 'Completed';
  arrivalDate: string;
  components: {
    flights: boolean;
    temporaryHousing: boolean;
    househunting: boolean;
    shipment: boolean;
    settlingInSupport: boolean;
    orientation: boolean;
  };
  totalCost: number;
}

interface TaxProfile {
  expatId: string;
  expatName: string;
  taxYear: string;
  residencyStatus: 'Resident' | 'Non-Resident';
  taxableIncome: number;
  taxRate: number;
  estimatedTax: number;
  mtdDeductions: number;
  taxFilingStatus: 'Filed' | 'Pending' | 'Overdue';
  taxFilingDeadline: string;
}

export function ExpatriateManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const expatriates: Expatriate[] = [
    {
      id: 'EXP-001',
      name: 'James Anderson',
      email: 'james.anderson@company.my',
      phone: '+60 12-345 6789',
      position: 'Regional Director',
      department: 'Operations',
      nationality: 'British',
      homeCountry: 'United Kingdom',
      passportNumber: 'UK9876543',
      employmentPassType: 'EP1',
      epStatus: 'Active',
      epExpiry: '2026-06-30',
      salary: 35000,
      salaryGrade: 'E5',
      assignmentStart: '2023-07-01',
      assignmentEnd: '2026-06-30',
      taxStatus: 'Resident',
      dependents: 3,
      housingAllowance: 8000,
      transportAllowance: 2000,
      educationAllowance: 5000,
      relocationStatus: 'Completed',
      sponsor: 'Tech Solutions Sdn Bhd',
    },
    {
      id: 'EXP-002',
      name: 'Sarah Williams',
      email: 'sarah.williams@company.my',
      phone: '+60 12-456 7890',
      position: 'Chief Technology Officer',
      department: 'Technology',
      nationality: 'American',
      homeCountry: 'United States',
      passportNumber: 'US1234567',
      employmentPassType: 'EP1',
      epStatus: 'Active',
      epExpiry: '2025-12-31',
      salary: 42000,
      salaryGrade: 'E6',
      assignmentStart: '2022-01-01',
      assignmentEnd: '2025-12-31',
      taxStatus: 'Resident',
      dependents: 2,
      housingAllowance: 10000,
      transportAllowance: 2500,
      educationAllowance: 6000,
      relocationStatus: 'Completed',
      sponsor: 'Tech Solutions Sdn Bhd',
    },
    {
      id: 'EXP-003',
      name: 'Hans Mueller',
      email: 'hans.mueller@company.my',
      phone: '+60 12-567 8901',
      position: 'Engineering Manager',
      department: 'Engineering',
      nationality: 'German',
      homeCountry: 'Germany',
      passportNumber: 'DE7890123',
      employmentPassType: 'EP2',
      epStatus: 'Expiring Soon',
      epExpiry: '2025-03-15',
      salary: 28000,
      salaryGrade: 'E4',
      assignmentStart: '2023-03-15',
      assignmentEnd: '2026-03-15',
      taxStatus: 'Resident',
      dependents: 1,
      housingAllowance: 7000,
      transportAllowance: 1500,
      educationAllowance: 4000,
      relocationStatus: 'Completed',
      sponsor: 'Tech Solutions Sdn Bhd',
    },
    {
      id: 'EXP-004',
      name: 'Yuki Tanaka',
      email: 'yuki.tanaka@company.my',
      phone: '+60 12-678 9012',
      position: 'Senior Product Manager',
      department: 'Product',
      nationality: 'Japanese',
      homeCountry: 'Japan',
      passportNumber: 'JP4567890',
      employmentPassType: 'EP2',
      epStatus: 'Active',
      epExpiry: '2026-09-30',
      salary: 26000,
      salaryGrade: 'E3',
      assignmentStart: '2024-01-01',
      assignmentEnd: '2027-01-01',
      taxStatus: 'Non-Resident',
      dependents: 0,
      housingAllowance: 6000,
      transportAllowance: 1200,
      educationAllowance: 0,
      relocationStatus: 'In Progress',
      sponsor: 'Tech Solutions Sdn Bhd',
    },
    {
      id: 'EXP-005',
      name: 'Marie Dubois',
      email: 'marie.dubois@company.my',
      phone: '+60 12-789 0123',
      position: 'Financial Controller',
      department: 'Finance',
      nationality: 'French',
      homeCountry: 'France',
      passportNumber: 'FR2345678',
      employmentPassType: 'EP2',
      epStatus: 'Active',
      epExpiry: '2026-04-30',
      salary: 24000,
      salaryGrade: 'E3',
      assignmentStart: '2023-05-01',
      assignmentEnd: '2026-04-30',
      taxStatus: 'Resident',
      dependents: 2,
      housingAllowance: 6500,
      transportAllowance: 1500,
      educationAllowance: 4500,
      relocationStatus: 'Completed',
      sponsor: 'Tech Solutions Sdn Bhd',
    },
  ];

  const relocationPackages: RelocationPackage[] = [
    {
      id: 'REL-001',
      expatName: 'Yuki Tanaka',
      packageType: 'Executive',
      status: 'In Progress',
      arrivalDate: '2024-12-20',
      components: {
        flights: true,
        temporaryHousing: true,
        househunting: true,
        shipment: true,
        settlingInSupport: true,
        orientation: true,
      },
      totalCost: 45000,
    },
    {
      id: 'REL-002',
      expatName: 'New Hire - TBD',
      packageType: 'Senior Executive',
      status: 'Planning',
      arrivalDate: '2025-02-01',
      components: {
        flights: true,
        temporaryHousing: true,
        househunting: true,
        shipment: true,
        settlingInSupport: true,
        orientation: true,
      },
      totalCost: 65000,
    },
  ];

  const taxProfiles: TaxProfile[] = [
    {
      expatId: 'EXP-001',
      expatName: 'James Anderson',
      taxYear: '2024',
      residencyStatus: 'Resident',
      taxableIncome: 420000,
      taxRate: 24,
      estimatedTax: 100800,
      mtdDeductions: 75600,
      taxFilingStatus: 'Filed',
      taxFilingDeadline: '2025-04-30',
    },
    {
      expatId: 'EXP-002',
      expatName: 'Sarah Williams',
      taxYear: '2024',
      residencyStatus: 'Resident',
      taxableIncome: 504000,
      taxRate: 26,
      estimatedTax: 131040,
      mtdDeductions: 93840,
      taxFilingStatus: 'Filed',
      taxFilingDeadline: '2025-04-30',
    },
    {
      expatId: 'EXP-003',
      expatName: 'Hans Mueller',
      taxYear: '2024',
      residencyStatus: 'Resident',
      taxableIncome: 336000,
      taxRate: 21,
      estimatedTax: 70560,
      mtdDeductions: 50400,
      taxFilingStatus: 'Pending',
      taxFilingDeadline: '2025-04-30',
    },
  ];

  const totalExpatriates = expatriates.length;
  const expiringEP = expatriates.filter(e => e.epStatus === 'Expiring Soon').length;
  const activeAssignments = expatriates.filter(e => e.epStatus === 'Active').length;
  const totalCompensation = expatriates.reduce((sum, e) => sum + e.salary + e.housingAllowance + e.transportAllowance + e.educationAllowance, 0);

  const stats = [
    {
      label: 'Total Expatriates',
      value: totalExpatriates,
      change: '+1 this quarter',
      icon: Globe,
      gradient: 'from-blue-500/80 to-cyan-500/80',
    },
    {
      label: 'EP Expiring Soon',
      value: expiringEP,
      change: 'Action required',
      icon: AlertTriangle,
      gradient: 'from-orange-500/80 to-amber-500/80',
    },
    {
      label: 'Active Assignments',
      value: activeAssignments,
      change: `${Math.round((activeAssignments / totalExpatriates) * 100)}% retention`,
      icon: CheckCircle,
      gradient: 'from-green-500/80 to-emerald-500/80',
    },
    {
      label: 'Monthly Cost',
      value: Math.round(totalCompensation / 1000),
      prefix: 'RM ',
      suffix: 'K',
      change: 'Total compensation',
      icon: DollarSign,
      gradient: 'from-purple-500/80 to-violet-500/80',
    },
  ];

  // Analytics Data
  const nationalityData = [
    { name: 'British', value: 1, fill: '#8B5CF6' },
    { name: 'American', value: 1, fill: '#EC4899' },
    { name: 'German', value: 1, fill: '#10B981' },
    { name: 'Japanese', value: 1, fill: '#F59E0B' },
    { name: 'French', value: 1, fill: '#3B82F6' },
  ];

  const epTypeData = [
    { type: 'EP1 (>RM20K)', count: 2, avgSalary: 38500 },
    { type: 'EP2 (RM10K-20K)', count: 3, avgSalary: 26000 },
  ];

  const compensationTrendData = [
    { month: 'Jul', salary: 695, allowances: 225, total: 920 },
    { month: 'Aug', salary: 695, allowances: 225, total: 920 },
    { month: 'Sep', salary: 695, allowances: 225, total: 920 },
    { month: 'Oct', salary: 695, allowances: 225, total: 920 },
    { month: 'Nov', salary: 695, allowances: 225, total: 920 },
    { month: 'Dec', salary: 695, allowances: 225, total: 920 },
  ];

  const taxStatusData = [
    { status: 'Resident', count: 4, fill: '#10B981' },
    { status: 'Non-Resident', count: 1, fill: '#F59E0B' },
  ];

  const allowanceBreakdownData = [
    { type: 'Housing', amount: 37500, fill: '#8B5CF6' },
    { type: 'Transport', amount: 8700, fill: '#EC4899' },
    { type: 'Education', amount: 19500, fill: '#10B981' },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Filed':
      case 'Resident':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Expiring Soon':
      case 'In Progress':
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Renewal Required':
      case 'Overdue':
      case 'Planning':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Non-Resident':
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
              <span className="text-sm font-medium text-blue-900">New Expatriate</span>
            </button>
            <button
              onClick={() => setViewMode('relocation')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 transition-all"
            >
              <Plane className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Relocation</span>
            </button>
            <button
              onClick={() => setViewMode('tax')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 transition-all"
            >
              <Receipt className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Tax Filing</span>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expatriates by Nationality</h3>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Pass Types</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <BarChart data={epTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="type" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Compensation (RM '000)</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <AreaChart data={compensationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="salary" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Salary" />
                  <Area type="monotone" dataKey="allowances" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} name="Allowances" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Allowance Breakdown (RM '000)</h3>
            <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                <PieChart>
                  <Pie
                    data={allowanceBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="amount"
                    label={({ type, amount }) => `${type}: RM ${amount / 1000}K`}
                  >
                    {allowanceBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Expiring EP Alert */}
      {expiringEP > 0 && (
        <GlassmorphicCard gradient="from-red-50/80 to-orange-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">⚠️ {expiringEP} Employment Pass(es) Expiring Soon</h3>
                <p className="text-red-700 mb-4">
                  Initiate renewal process at least 3 months before expiry to avoid work disruption.
                </p>
                <div className="space-y-2">
                  {expatriates
                    .filter(e => e.epStatus === 'Expiring Soon')
                    .map(expat => (
                      <div key={expat.id} className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{expat.name}</p>
                          <p className="text-sm text-gray-600">
                            {expat.employmentPassType} expires: {expat.epExpiry}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                          Start Renewal
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

  const renderExpatriates = () => (
    <div className="space-y-6">
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expatriate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">EP Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">EP Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tax Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expatriates.map((expat, index) => (
                <motion.tr
                  key={expat.id}
                  className="border-b border-gray-100 hover:bg-white/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {expat.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{expat.name}</p>
                        <p className="text-sm text-gray-600">{expat.nationality}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{expat.position}</p>
                      <p className="text-sm text-gray-600">{expat.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200">
                      {expat.employmentPassType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(expat.epStatus)}`}>
                      {expat.epStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">RM {expat.salary.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Grade {expat.salaryGrade}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(expat.taxStatus)}`}>
                      {expat.taxStatus}
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

  const renderRelocation = () => (
    <div className="space-y-6">
      {/* Relocation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">1</p>
              </div>
              <Plane className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-green-50/80 to-emerald-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {relocationPackages.filter(r => r.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-purple-50/80 to-violet-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-purple-600">
                  RM {relocationPackages.reduce((sum, r) => sum + r.totalCost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Relocation Packages */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Relocation Packages</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" />
              New Package
            </button>
          </div>
          <div className="space-y-4">
            {relocationPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{pkg.expatName}</h4>
                      <p className="text-sm text-gray-600">{pkg.packageType} Package</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Arrival Date</p>
                    <p className="font-semibold text-gray-900">{pkg.arrivalDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Cost</p>
                    <p className="font-semibold text-gray-900">RM {pkg.totalCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold text-gray-900">{pkg.status}</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Package Components:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {pkg.components.flights && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Flight Tickets</span>
                      </div>
                    )}
                    {pkg.components.temporaryHousing && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Temp Housing</span>
                      </div>
                    )}
                    {pkg.components.househunting && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>House Hunting</span>
                      </div>
                    )}
                    {pkg.components.shipment && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Shipment</span>
                      </div>
                    )}
                    {pkg.components.settlingInSupport && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Settling Support</span>
                      </div>
                    )}
                    {pkg.components.orientation && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Orientation</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  const renderTax = () => (
    <div className="space-y-6">
      {/* Tax Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassmorphicCard gradient="from-green-50/80 to-emerald-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Filed Returns</p>
                <p className="text-3xl font-bold text-green-600">
                  {taxProfiles.filter(t => t.taxFilingStatus === 'Filed').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-orange-50/80 to-amber-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {taxProfiles.filter(t => t.taxFilingStatus === 'Pending').length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tax</p>
                <p className="text-3xl font-bold text-blue-600">
                  RM {taxProfiles.reduce((sum, t) => sum + t.estimatedTax, 0).toLocaleString()}
                </p>
              </div>
              <Receipt className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Tax Status Chart */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tax Residency Status</h3>
          <div style={{ width: '100%', height: '250px', minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
              <PieChart>
                <Pie
                  data={taxStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {taxStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Tax Profiles */}
      <GlassmorphicCard gradient="from-white/80 to-white/60" blur="xl">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tax Profiles (2024)</h3>
          <div className="space-y-4">
            {taxProfiles.map((profile, index) => (
              <motion.div
                key={profile.expatId}
                className="p-6 bg-white/50 rounded-lg border-2 border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{profile.expatName}</h4>
                      <p className="text-sm text-gray-600">Tax Year {profile.taxYear}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(profile.taxFilingStatus)}`}>
                    {profile.taxFilingStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Residency</p>
                    <p className="font-semibold text-gray-900">{profile.residencyStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Taxable Income</p>
                    <p className="font-semibold text-gray-900">RM {profile.taxableIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tax Rate</p>
                    <p className="font-semibold text-gray-900">{profile.taxRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Tax</p>
                    <p className="font-semibold text-gray-900">RM {profile.estimatedTax.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Filing deadline: {profile.taxFilingDeadline}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassmorphicCard>

      {/* Tax Information */}
      <GlassmorphicCard gradient="from-blue-50/80 to-cyan-50/60" blur="xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">🇲🇾 Malaysian Tax for Expatriates</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>✓ <strong>Resident:</strong> 183+ days in Malaysia = progressive tax rates (0-30%)</p>
                <p>✓ <strong>Non-Resident:</strong> Flat 30% tax rate on Malaysian income</p>
                <p>✓ <strong>MTD (Monthly Tax Deduction):</strong> Employer withholds monthly</p>
                <p>✓ <strong>Filing Deadline:</strong> April 30 (following year)</p>
                <p>✓ <strong>Tax Relief:</strong> Available for residents only</p>
                <p>✓ <strong>Double Taxation:</strong> Check DTA agreements with home country</p>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
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
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                🌍 Expatriate Management
              </motion.h1>
              <p className="text-gray-600 mt-2">Comprehensive expatriate lifecycle management</p>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </GlassButton>
              <GlassButton variant="primary" onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" />
                Add Expatriate
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
                          {stat.suffix}
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
                  { id: 'expatriates', name: 'Expatriates', icon: Users },
                  { id: 'relocation', name: 'Relocation', icon: Plane },
                  { id: 'compensation', name: 'Compensation', icon: DollarSign },
                  { id: 'compliance', name: 'Compliance', icon: Shield },
                  { id: 'tax', name: 'Tax', icon: Receipt },
                  { id: 'benefits', name: 'Benefits', icon: Heart },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${ 
                        viewMode === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
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
            {viewMode === 'expatriates' && renderExpatriates()}
            {viewMode === 'relocation' && renderRelocation()}
            {viewMode === 'tax' && renderTax()}
            {viewMode === 'compensation' && <div className="text-center p-12 text-gray-500">Compensation view coming soon</div>}
            {viewMode === 'compliance' && <div className="text-center p-12 text-gray-500">Compliance view coming soon</div>}
            {viewMode === 'benefits' && <div className="text-center p-12 text-gray-500">Benefits view coming soon</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}