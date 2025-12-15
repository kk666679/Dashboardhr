import React, { useState } from 'react';
import { TenantProvider } from './contexts/TenantContext';
import { RBACProvider } from './contexts/RBACContext';
import { Dashboard } from './components/Dashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { LeaveManagement } from './components/LeaveManagement';
import { AttendanceTracking } from './components/AttendanceTracking';
import { PayrollOverview } from './components/PayrollOverview';
import { ComplianceCenter } from './components/ComplianceCenter';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { IndustrialRelations } from './components/IndustrialRelations';
import { EmployeeRelations } from './components/EmployeeRelations';
import { ForeignWorkers } from './components/ForeignWorkers';
import { ZakatManagement } from './components/ZakatManagement';
import { DatabaseManagement } from './components/DatabaseManagement';
import { TenantManagement } from './components/TenantManagement';
import { RoleManagement } from './components/RoleManagement';
import { TenantSwitcher } from './components/TenantSwitcher';
import { OrganizationChart } from './components/OrganizationChart';
import { WorkFlowShowcase } from './components/reactflow/WorkFlowShowcase';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { MultilevelSidebar } from './components/MultilevelSidebar';
import { AIChat } from './components/AIChat';
import { LearningDevelopment } from './components/LearningDevelopment';
import { CalendarView } from './components/CalendarView';
import { TeacherScheduling } from './components/TeacherScheduling';
import { ComingSoon } from './components/ComingSoon';
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
  | 'zakat'
  | 'talent'
  | 'learning'
  | 'performance'
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
      id: 'zakat', 
      name: 'Zakat Management', 
      icon: Sparkles,
      section: 'advanced',
      badge: 'Islamic'
    },
    // Coming Soon
    { 
      id: 'talent', 
      name: 'Talent Acquisition', 
      icon: Users,
      section: 'coming-soon'
    },
    { 
      id: 'learning', 
      name: 'Learning & Development', 
      icon: GraduationCap,
      section: 'coming-soon'
    },
    { 
      id: 'performance', 
      name: 'Performance Management', 
      icon: Target,
      section: 'coming-soon'
    },
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
    // ReactFlow Showcase
    { 
      id: 'reactflow-showcase', 
      name: 'ReactFlow Showcase', 
      icon: Sparkles,
      section: 'settings',
      badge: 'New'
    },
    // Learning Development
    { 
      id: 'learning-development', 
      name: 'Learning Development', 
      icon: GraduationCap,
      section: 'settings'
    },
    // Calendar View
    { 
      id: 'calendar-view', 
      name: 'Calendar View', 
      icon: Calendar,
      section: 'settings'
    },
    // Teacher Scheduling
    { 
      id: 'teacher-scheduling', 
      name: 'Teacher Scheduling', 
      icon: Calendar,
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
        return <Dashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'employees':
        return <EmployeeDirectory />;
      case 'leave':
        return <LeaveManagement />;
      case 'attendance':
        return <AttendanceTracking />;
      case 'payroll':
        return <PayrollOverview />;
      case 'compliance':
        return <ComplianceCenter />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'industrial-relations':
        return <IndustrialRelations />;
      case 'employee-relations':
        return <EmployeeRelations />;
      case 'foreign-workers':
        return <ForeignWorkers />;
      case 'zakat':
        return <ZakatManagement />;
      case 'talent':
        return <ComingSoon module="Talent Acquisition" />;
      case 'learning':
        return <LearningDevelopment />;
      case 'performance':
        return <ComingSoon module="Performance Management" />;
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
        return <Dashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between border-b border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? 'px-4 py-4' : 'px-6 py-4'
          }`}>
            <div className={`overflow-hidden transition-all duration-300 ${
              sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}>
              <h1 className="text-blue-600 whitespace-nowrap">AI-HRMS</h1>
              <p className="text-xs text-gray-500 whitespace-nowrap">HR Management System</p>
            </div>
            
            {/* Collapsed Logo */}
            <div className={`transition-all duration-300 ${
              sidebarCollapsed ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                AI
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:block text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition-all duration-300 ${
                sidebarCollapsed ? 'ml-0' : 'ml-auto'
              }`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            sidebarCollapsed ? 'px-2' : 'px-4'
          }`}>
            {/* Core Modules */}
            <div className="mb-4">
              <p className={`py-2 text-xs text-gray-400 uppercase tracking-wider transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'px-2 opacity-0 h-0' : 'px-4 opacity-100 h-auto'
              }`}>
                Core Modules
              </p>
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
                    <span className={`transition-all duration-300 whitespace-nowrap ${
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

            {/* Advanced Modules */}
            <div className="mb-4">
              <p className={`py-2 text-xs text-gray-400 uppercase tracking-wider transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'px-2 opacity-0 h-0' : 'px-4 opacity-100 h-auto'
              }`}>
                Advanced Modules
              </p>
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
                    {item.badge && !sidebarCollapsed && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        item.badge === 'AI' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Badge indicator for collapsed state */}
                    {item.badge && sidebarCollapsed && (
                      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                        item.badge === 'AI' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        <div className="flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              item.badge === 'AI' 
                                ? 'bg-purple-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
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
          <div className={`border-t border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? 'px-3 py-4' : 'px-6 py-4'
          }`}>
            <div className={`flex items-center transition-all duration-300 ${
              sidebarCollapsed ? 'justify-center' : 'gap-3'
            }`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                HR
              </div>
              <div className={`transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}>
                <p className="text-sm whitespace-nowrap">Admin User</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">admin@company.my</p>
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-gray-900">
                    {navigation.find(n => n.id === activeTab)?.name}
                  </h2>
                  <p className="text-sm text-gray-500">Manage your workforce efficiently</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
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
        <AppContent />
      </RBACProvider>
    </TenantProvider>
  );
}