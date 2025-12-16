import React, { useState } from 'react';
import { TenantProvider } from './src/contexts/TenantContext';
import { RBACProvider } from './src/contexts/RBACContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { Dashboard } from './src/components/Dashboard';
import { EmployeeDirectory } from './src/components/EmployeeDirectory';
import { EmployeeDirectoryEnhanced } from './src/components/EmployeeDirectoryEnhanced';
import { LeaveManagement } from './src/components/LeaveManagement';
import { LeaveManagementEnhanced } from './src/components/LeaveManagementEnhanced';
import { AttendanceTracking } from './src/components/AttendanceTracking';
import { AttendanceTrackingEnhanced } from './src/components/AttendanceTrackingEnhanced';
import { PayrollOverview } from './src/components/PayrollOverview';
import { PayrollEnhanced } from './src/components/PayrollEnhanced';
import { ComplianceCenter } from './src/components/ComplianceCenter';
import { ComplianceEnhanced } from './src/components/ComplianceEnhanced';
import { ReportsAnalytics } from './src/components/ReportsAnalytics';
import { IndustrialRelations } from './src/components/IndustrialRelations';
import { EmployeeRelations } from './src/components/EmployeeRelations';
import { ForeignWorkers } from './src/components/ForeignWorkers';
import { ExpatriateManagement } from './src/components/ExpatriateManagement';
import { PerformanceManagement } from './src/components/PerformanceManagement';
import { ZakatManagement } from './src/components/ZakatManagement';
import { DatabaseManagement } from './src/components/DatabaseManagement';
import { TenantManagement } from './src/components/TenantManagement';
import { RoleManagement } from './src/components/RoleManagement';
import { TenantSwitcher } from './src/components/TenantSwitcher';
import { RoleSwitcher } from './src/components/RoleSwitcher';
import { ThemeToggle } from './src/components/ThemeToggle';
import { GlassmorphicCard } from './src/components/GlassmorphicCard';
import { OrganizationChart } from './src/components/OrganizationChart';
import { WorkFlowShowcase } from './src/components/reactflow/WorkFlowShowcase';
import { WorkflowBuilder } from './src/components/WorkflowBuilder';
import { MultilevelSidebar } from './src/components/MultilevelSidebar';
import { AIChat } from './src/components/AIChat';
import { LearningDevelopment } from './src/components/LearningDevelopment';
import { AnimatedDashboard } from './src/components/AnimatedDashboard';
import { CalendarView } from './src/components/CalendarView';
import { TeacherScheduling } from './src/components/TeacherScheduling';
import { ComingSoon } from './src/components/ComingSoon';
import { TalentAcquisition } from './src/components/TalentAcquisition';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  Wallet, 
  FileCheck, 
  BarChart3,
  Menu,
  X,
  Scale,
  HandshakeIcon,
  Globe,
  Sparkles,
  GraduationCap,
  Target,
  ChevronLeft,
  ChevronRight,
  Database,
  Settings,
  Bell,
  Building2,
  Shield,
  Network
} from 'lucide-react';

type Tab = 
  | 'dashboard' 
  | 'employees' 
  | 'leave' 
  | 'attendance' 
  | 'payroll' 
  | 'compliance' 
  | 'reports'
  | 'industrial-relations'
  | 'employee-relations'
  | 'foreign-workers'
  | 'expatriate-management'
  | 'performance'
  | 'zakat'
  | 'talent'
  | 'learning'
  | 'calendar'
  | 'teacher-scheduling'
  | 'database'
  | 'tenant-management'
  | 'role-management'
  | 'org-chart'
  | 'reactflow-showcase'
  | 'workflow-builder'
  | 'process-automation'
  | 'department-view'
  | 'team-hierarchy'
  | 'ai-chat'
  | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    // Core Modules
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: LayoutDashboard,
      section: 'main'
    },
    { 
      id: 'employees', 
      name: 'Employees', 
      icon: Users,
      section: 'main'
    },
    { 
      id: 'leave', 
      name: 'Leave Management', 
      icon: Calendar,
      section: 'main'
    },
    { 
      id: 'attendance', 
      name: 'Attendance', 
      icon: Clock,
      section: 'main'
    },
    { 
      id: 'payroll', 
      name: 'Payroll', 
      icon: Wallet,
      section: 'main'
    },
    { 
      id: 'compliance', 
      name: 'Compliance', 
      icon: FileCheck,
      section: 'main'
    },
    { 
      id: 'reports', 
      name: 'Reports & Analytics', 
      icon: BarChart3,
      section: 'main'
    },
    // Advanced Modules
    { 
      id: 'industrial-relations', 
      name: 'Industrial Relations', 
      icon: Scale,
      section: 'advanced',
      badge: 'AI'
    },
    { 
      id: 'employee-relations', 
      name: 'Employee Relations', 
      icon: HandshakeIcon,
      section: 'advanced',
      badge: 'AI'
    },
    { 
      id: 'foreign-workers', 
      name: 'Foreign Workers', 
      icon: Globe,
      section: 'advanced'
    },
    { 
      id: 'expatriate-management', 
      name: 'Expatriate Management', 
      icon: Globe,
      section: 'advanced'
    },
    { 
      id: 'performance', 
      name: 'Performance Management', 
      icon: Target,
      section: 'advanced',
      badge: 'AI'
    },
    { 
      id: 'zakat', 
      name: 'Zakat Management', 
      icon: Sparkles,
      section: 'advanced',
      badge: 'Islamic'
    },
    { 
      id: 'talent', 
      name: 'Talent Acquisition', 
      icon: Users,
      section: 'advanced',
      badge: 'AI'
    },
    { 
      id: 'learning', 
      name: 'Learning & Development', 
      icon: GraduationCap,
      section: 'advanced',
      badge: 'AI'
    },
    // Coming Soon
    { 
      id: 'calendar', 
      name: 'Calendar View', 
      icon: Calendar,
      section: 'coming-soon'
    },
    { 
      id: 'teacher-scheduling', 
      name: 'Teacher Scheduling', 
      icon: Calendar,
      section: 'coming-soon'
    },
    // Database Management
    { 
      id: 'database', 
      name: 'Database Management', 
      icon: Database,
      section: 'settings'
    },
    // Tenant Management
    { 
      id: 'tenant-management', 
      name: 'Tenant Management', 
      icon: Building2,
      section: 'settings'
    },
    // Role Management
    { 
      id: 'role-management', 
      name: 'Role Management', 
      icon: Shield,
      section: 'settings'
    },
    // Organization Chart
    { 
      id: 'org-chart', 
      name: 'Organization Chart', 
      icon: Network,
      section: 'settings'
    },
    // AI Chat
    { 
      id: 'ai-chat', 
      name: 'AI Chat', 
      icon: Sparkles,
      section: 'settings'
    },
    // Settings
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings,
      section: 'settings'
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnimatedDashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'employees':
        return <EmployeeDirectoryEnhanced />;
      case 'leave':
        return <LeaveManagementEnhanced />;
      case 'attendance':
        return <AttendanceTrackingEnhanced />;
      case 'payroll':
        return <PayrollEnhanced />;
      case 'compliance':
        return <ComplianceEnhanced />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'industrial-relations':
        return <IndustrialRelations />;
      case 'employee-relations':
        return <EmployeeRelations />;
      case 'foreign-workers':
        return <ForeignWorkers />;
      case 'expatriate-management':
        return <ExpatriateManagement />;
      case 'performance':
        return <PerformanceManagement />;
      case 'zakat':
        return <ZakatManagement />;
      case 'talent':
        return <TalentAcquisition />;
      case 'learning':
        return <LearningDevelopment />;
      case 'calendar':
        return <CalendarView />;
      case 'teacher-scheduling':
        return <TeacherScheduling />;
      case 'database':
        return <DatabaseManagement />;
      case 'tenant-management':
        return <TenantManagement />;
      case 'role-management':
        return <RoleManagement />;
      case 'org-chart':
        return <OrganizationChart />;
      case 'reactflow-showcase':
        return <WorkFlowShowcase />;
      case 'workflow-builder':
        return <WorkflowBuilder />;
      case 'process-automation':
        return <ComingSoon module="Process Automation" />;
      case 'department-view':
        return <ComingSoon module="Department View" />;
      case 'team-hierarchy':
        return <ComingSoon module="Team Hierarchy" />;
      case 'ai-chat':
        return <AIChat />;
      case 'settings':
        return <ComingSoon module="Settings" />;
      default:
        return <AnimatedDashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 border-r-4 shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        } w-72 bg-white dark:bg-gray-800 border-black dark:border-white`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between border-b-4 border-black dark:border-white bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
            sidebarCollapsed ? 'px-4 py-5' : 'px-6 py-5'
          }`}>
            <div className={`overflow-hidden transition-all duration-300 ${
              sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}>
              <h1 className="text-2xl text-white drop-shadow-lg whitespace-nowrap">AI-HRMS</h1>
              <p className="text-sm text-blue-100 whitespace-nowrap">Malaysia Edition</p>
            </div>
            
            {/* Collapsed Logo */}
            <div className={`transition-all duration-300 ${
              sidebarCollapsed ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-lg neo-shadow-sm">
                <span className="font-bold">AI</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:flex items-center justify-center text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 hover:scale-110 ${
                sidebarCollapsed ? 'ml-0' : 'ml-auto'
              }`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            sidebarCollapsed ? 'px-2' : 'px-4'
          }`}>
            {/* Core Modules */}
            <div className="mb-6">
              <div className={`flex items-center gap-2 mb-3 transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'px-2 opacity-0 h-0' : 'px-4 opacity-100 h-auto'
              }`}>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                  Core Modules
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>
              {navigation.filter(item => item.section === 'main').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative mb-1 border-2 ${
                      sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-blue-500 text-white border-blue-600 shadow-lg neo-shadow-sm dark:bg-blue-600 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className={`transition-all duration-300 whitespace-nowrap font-medium ${
                      sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {item.name}
                    </span>

                    {/* Active indicator */}
                    {isActive && !sidebarCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-3 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border-2 border-white dark:border-gray-500">
                        {item.name}
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-gray-700 rotate-45 border-l-2 border-b-2 border-white dark:border-gray-500"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Advanced Modules */}
            <div className="mb-6">
              <div className={`flex items-center gap-2 mb-3 transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'px-2 opacity-0 h-0' : 'px-4 opacity-100 h-auto'
              }`}>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-600 to-transparent"></div>
                <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider font-semibold">
                  Advanced
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-600 to-transparent"></div>
              </div>
              {navigation.filter(item => item.section === 'advanced').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative mb-1 border-2 ${
                      sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-purple-500 text-white border-purple-600 shadow-lg neo-shadow-sm dark:bg-purple-600 dark:border-purple-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-transparent hover:border-purple-200 dark:hover:border-purple-600'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className={`flex-1 text-left transition-all duration-300 whitespace-nowrap font-medium ${
                      sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {item.name}
                    </span>
                    {item.badge && !sidebarCollapsed && (
                      <span className={`px-2 py-1 text-xs rounded-md font-semibold border-2 transition-all duration-200 ${
                        item.badge === 'AI' 
                          ? isActive 
                            ? 'bg-white text-purple-600 border-white'
                            : 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700'
                          : isActive
                            ? 'bg-white text-green-600 border-white'
                            : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Active indicator */}
                    {isActive && !sidebarCollapsed && !item.badge && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}

                    {/* Badge indicator for collapsed state */}
                    {item.badge && sidebarCollapsed && (
                      <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                        item.badge === 'AI' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-3 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border-2 border-white dark:border-gray-500">
                        <div className="flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs rounded-md font-semibold ${
                              item.badge === 'AI' 
                                ? 'bg-purple-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-gray-700 rotate-45 border-l-2 border-b-2 border-white dark:border-gray-500"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Coming Soon */}
            <div>
              <p className={`py-2 text-xs text-gray-400 uppercase tracking-wider transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'px-2 opacity-0 h-0' : 'px-4 opacity-100 h-auto'
              }`}>
                Coming Soon
              </p>
              {navigation.filter(item => item.section === 'coming-soon').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${
                      sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 opacity-100'
                        : 'text-gray-700 hover:bg-gray-50 opacity-60'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`flex-1 text-left transition-all duration-300 whitespace-nowrap ${
                      sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {item.name}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                        Soon
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        <div className="flex items-center gap-2">
                          {item.name}
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-600 text-white">
                            Soon
                          </span>
                        </div>
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Settings */}
            <div>
              <p className={`py-2 text-xs text-gray-400 uppercase tracking-wider transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'px-2 opacity-0 h-0' : 'px-4 opacity-100 h-auto'
              }`}>
                Settings
              </p>
              {navigation.filter(item => item.section === 'settings').map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative ${
                      sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`flex-1 text-left transition-all duration-300 whitespace-nowrap ${
                      sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {item.name}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className={`border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            sidebarCollapsed ? 'px-3 py-4' : 'px-6 py-4'
          }`}>
            <div className={`flex items-center transition-all duration-300 ${
              sidebarCollapsed ? 'justify-center' : 'gap-3'
            }`}>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                HR
              </div>
              <div className={`transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}>
                <p className="text-sm whitespace-nowrap">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">admin@company.my</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-gray-900 dark:text-gray-100">
                    {navigation.find(n => n.id === activeTab)?.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your workforce efficiently</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <RoleSwitcher />
                <TenantSwitcher />
                <div className="hidden sm:block px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm transition-colors duration-300">
                  🇲🇾 Malaysia Compliance Ready
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <RBACProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </RBACProvider>
    </TenantProvider>
  );
}