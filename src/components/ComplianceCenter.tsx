import React from 'react';
import { FileCheck, AlertTriangle, CheckCircle, Clock, Shield, BookOpen } from 'lucide-react';

export function ComplianceCenter() {
  const complianceItems = [
    {
      category: 'Employment Act 1955',
      status: 'compliant',
      items: [
        { name: 'Working Hours', status: 'compliant', description: 'Max 48 hours/week' },
        { name: 'Overtime Calculation', status: 'compliant', description: '1.5x rate applied' },
        { name: 'Rest Days', status: 'compliant', description: 'Minimum 1 day/week' },
        { name: 'Public Holidays', status: 'compliant', description: '11 gazetted holidays' },
      ]
    },
    {
      category: 'Leave Entitlements',
      status: 'compliant',
      items: [
        { name: 'Annual Leave', status: 'compliant', description: '8-16 days based on tenure' },
        { name: 'Sick Leave', status: 'compliant', description: '14-22 days provision' },
        { name: 'Maternity Leave', status: 'compliant', description: '98 consecutive days' },
        { name: 'Paternity Leave', status: 'compliant', description: '7 consecutive days' },
      ]
    },
    {
      category: 'Statutory Contributions',
      status: 'warning',
      items: [
        { name: 'EPF Contributions', status: 'compliant', description: 'Employee 11%, Employer 12%' },
        { name: 'SOCSO Registration', status: 'compliant', description: 'All employees covered' },
        { name: 'EIS Contributions', status: 'warning', description: 'Pending submission for 2 employees' },
        { name: 'PCB Deductions', status: 'compliant', description: 'Monthly tax deductions' },
      ]
    },
    {
      category: 'Workplace Safety',
      status: 'compliant',
      items: [
        { name: 'OSHA Compliance', status: 'compliant', description: 'Safety regulations met' },
        { name: 'JKKP Registration', status: 'compliant', description: 'Committee established' },
        { name: 'Safety Training', status: 'compliant', description: 'Annual training completed' },
        { name: 'First Aid Facilities', status: 'compliant', description: 'Equipment available' },
      ]
    },
  ];

  const upcomingDeadlines = [
    { task: 'EPF Monthly Remittance', date: '2024-07-15', priority: 'high' },
    { task: 'SOCSO Contribution Filing', date: '2024-07-15', priority: 'high' },
    { task: 'EIS Monthly Filing', date: '2024-07-15', priority: 'high' },
    { task: 'PCB Monthly Submission', date: '2024-07-10', priority: 'medium' },
    { task: 'Quarterly Safety Report', date: '2024-07-30', priority: 'medium' },
  ];

  const recentUpdates = [
    {
      title: 'Minimum Wage Update 2025',
      date: '2025-02-01',
      description: 'New minimum wage of RM1,700/month effective November 1, 2025.',
      type: 'regulation'
    },
    {
      title: 'Employment Insurance System',
      date: '2024-01-01',
      description: 'EIS contribution rate maintained at 0.2% for both employer and employee.',
      type: 'regulation'
    },
    {
      title: 'Flexible Working Arrangements',
      date: '2023-09-01',
      description: 'Guidelines on FWA implementation under Employment Act.',
      type: 'guideline'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Compliance Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700 transition-colors duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg transition-colors duration-300">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">Compliance Status: Good Standing</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
              Your organization is compliant with Malaysian labor laws. 1 minor item requires attention.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">15 Items Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">1 Item Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-gray-900 dark:text-gray-100 transition-colors duration-300">Upcoming Compliance Deadlines</h3>
        </div>
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">{deadline.task}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  Due: {new Date(deadline.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(deadline.priority)}`}>
                {deadline.priority.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {complianceItems.map((category, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 dark:text-gray-100 transition-colors duration-300">{category.category}</h3>
              {getStatusIcon(category.status)}
            </div>
            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Regulatory Updates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-gray-900 dark:text-gray-100 transition-colors duration-300">Recent Regulatory Updates</h3>
        </div>
        <div className="space-y-4">
          {recentUpdates.map((update, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-300">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">{update.title}</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {new Date(update.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{update.description}</p>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  update.type === 'regulation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                  {update.type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
          <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300" />
          <h4 className="text-sm text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">Compliance Checklist</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Download full checklist</p>
        </button>
        <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
          <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400 mb-2 transition-colors duration-300" />
          <h4 className="text-sm text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">Policy Templates</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Access HR policy templates</p>
        </button>
        <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300" />
          <h4 className="text-sm text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">Audit Reports</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">View compliance audits</p>
        </button>
      </div>
    </div>
  );
}