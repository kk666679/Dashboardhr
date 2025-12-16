import React, { useState } from 'react';
import { 
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Wallet,
  FileCheck,
  BarChart3,
  Scale,
  HandshakeIcon,
  Globe,
  Sparkles,
  GraduationCap,
  Target,
  Database,
  Building2,
  Shield,
  Network,
  Settings,
  GitBranch,
  Zap,
  Workflow,
  LucideIcon
} from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  collapsed?: boolean;
}

interface MultilevelSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function MultilevelSidebar({ 
  activeTab, 
  onTabChange, 
  collapsed,
  onToggleCollapse 
}: MultilevelSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['core', 'organization', 'workflows'])
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['org-structure', 'reactflow'])
  );

  const menuSections: MenuSection[] = [
    {
      title: 'Core Modules',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', name: 'Employees', icon: Users },
        { id: 'leave', name: 'Leave Management', icon: Calendar },
        { id: 'attendance', name: 'Attendance', icon: Clock },
        { id: 'payroll', name: 'Payroll', icon: Wallet },
        { id: 'compliance', name: 'Compliance', icon: FileCheck },
        { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Advanced Features',
      items: [
        { 
          id: 'industrial-relations', 
          name: 'Industrial Relations', 
          icon: Scale,
          badge: 'AI',
          badgeColor: 'purple'
        },
        { 
          id: 'employee-relations', 
          name: 'Employee Relations', 
          icon: HandshakeIcon,
          badge: 'AI',
          badgeColor: 'purple'
        },
        { 
          id: 'foreign-workers', 
          name: 'Foreign Workers', 
          icon: Globe 
        },
        { 
          id: 'zakat', 
          name: 'Zakat Management', 
          icon: Sparkles,
          badge: 'Islamic',
          badgeColor: 'emerald'
        },
      ],
    },
    {
      title: 'Talent & Learning',
      items: [
        { id: 'talent', name: 'Talent Acquisition', icon: Users },
        { id: 'learning', name: 'Learning & Development', icon: GraduationCap },
        { id: 'performance', name: 'Performance Management', icon: Target },
        { id: 'calendar', name: 'Calendar View', icon: Calendar },
        { id: 'teacher-scheduling', name: 'Teacher Scheduling', icon: Calendar },
      ],
    },
    {
      title: 'Organization & Workflows',
      items: [
        {
          id: 'org-structure',
          name: 'Organization Structure',
          icon: Network,
          children: [
            { id: 'org-chart', name: 'Organization Chart', icon: Network },
            { id: 'department-view', name: 'Department View', icon: Building2 },
            { id: 'team-hierarchy', name: 'Team Hierarchy', icon: Users },
          ]
        },
        {
          id: 'reactflow',
          name: 'ReactFlow & Workflows',
          icon: GitBranch,
          badge: 'New',
          badgeColor: 'pink',
          children: [
            { id: 'reactflow-showcase', name: 'Components Showcase', icon: Sparkles },
            { id: 'workflow-builder', name: 'Workflow Builder', icon: Workflow },
            { id: 'process-automation', name: 'Process Automation', icon: Zap },
          ]
        },
      ],
    },
    {
      title: 'System Settings',
      items: [
        { id: 'database', name: 'Database Management', icon: Database },
        { id: 'tenant-management', name: 'Tenant Management', icon: Building2 },
        { id: 'role-management', name: 'Role Management', icon: Shield },
        { id: 'settings', name: 'Settings', icon: Settings },
      ],
    },
  ];

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getBadgeClasses = (color?: string) => {
    const colors: { [key: string]: string } = {
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[color || 'purple'] || colors.purple;
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeTab === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            } else {
              onTabChange(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
            depth > 0 ? 'pl-8' : ''
          } ${
            isActive
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50'
          }`}
        >
          {hasChildren && !collapsed && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
          <Icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-sm">{item.name}</span>
              {item.badge && (
                <span 
                  className={`px-2 py-0.5 text-xs rounded-full border ${getBadgeClasses(item.badgeColor)}`}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </button>

        {/* Render children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="border-l-2 border-pink-200 ml-6">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r-2 border-pink-200 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="px-4 py-6 border-b-2 border-pink-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent truncate">
                AI-HRMS
              </h1>
              <p className="text-xs text-gray-500 truncate">Malaysian Edition</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section) => {
          const isSectionExpanded = expandedSections.has(section.title);
          
          return (
            <div key={section.title} className="mb-2">
              {/* Section Header */}
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 hover:text-pink-600 transition-colors"
                >
                  <span className="uppercase tracking-wider">{section.title}</span>
                  {isSectionExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}

              {/* Section Items */}
              {(collapsed || isSectionExpanded) && (
                <div className="space-y-0.5">
                  {section.items.map(item => renderMenuItem(item))}
                </div>
              )}

              {/* Divider */}
              {!collapsed && isSectionExpanded && (
                <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent my-2"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-pink-200 p-4">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-lg transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-pink-600" />
          ) : (
            <>
              <ChevronRight className="w-4 h-4 text-pink-600 rotate-180" />
              <span className="text-sm text-pink-700 font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
