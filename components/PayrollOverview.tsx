import React from 'react';
import { Wallet, TrendingUp, DollarSign, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PayrollOverview() {
  const payrollSummary = [
    { label: 'Total Payroll', value: 'RM 487,250', change: '+5.2%', trend: 'up' },
    { label: 'Average Salary', value: 'RM 6,850', change: '+2.1%', trend: 'up' },
    { label: 'EPF Contribution', value: 'RM 58,470', change: '+5.2%', trend: 'neutral' },
    { label: 'SOCSO Contribution', value: 'RM 9,745', change: '+5.2%', trend: 'neutral' },
  ];

  const monthlyData = [
    { month: 'Jan', amount: 465000 },
    { month: 'Feb', amount: 472000 },
    { month: 'Mar', amount: 468000 },
    { month: 'Apr', amount: 480000 },
    { month: 'May', amount: 475000 },
    { month: 'Jun', amount: 487250 },
  ];

  const employeePayroll = [
    {
      id: '1',
      name: 'Ahmad bin Abdullah',
      position: 'Senior Software Engineer',
      basicSalary: 8500,
      allowances: 1200,
      epf: 1020,
      socso: 39.25,
      netSalary: 8640.75
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      position: 'Sales Manager',
      basicSalary: 7800,
      allowances: 1000,
      epf: 936,
      socso: 39.25,
      netSalary: 7824.75
    },
    {
      id: '3',
      name: 'Raj Kumar',
      position: 'Marketing Specialist',
      basicSalary: 5500,
      allowances: 500,
      epf: 660,
      socso: 39.25,
      netSalary: 5300.75
    },
    {
      id: '4',
      name: 'Lee Mei Ling',
      position: 'HR Manager',
      basicSalary: 7200,
      allowances: 800,
      epf: 864,
      socso: 39.25,
      netSalary: 7096.75
    },
    {
      id: '5',
      name: 'Mohd Faizal',
      position: 'DevOps Engineer',
      basicSalary: 7000,
      allowances: 600,
      epf: 840,
      socso: 39.25,
      netSalary: 6720.75
    },
  ];

  return (
    <div className="space-y-6">
      {/* Payroll Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollSummary.map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-gray-900 mt-2">{item.value}</p>
            <p className={`text-sm mt-1 ${
              item.trend === 'up' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {item.change}
            </p>
          </div>
        ))}
      </div>

      {/* Malaysian Statutory Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm text-green-900">Malaysian Statutory Contributions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-sm text-gray-700">EPF (Employee Provident Fund)</p>
                <p className="text-sm text-gray-600 mt-1">Employee: 11% | Employer: 12%</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">SOCSO (Social Security)</p>
                <p className="text-sm text-gray-600 mt-1">Varies by salary bracket</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">EIS (Employment Insurance)</p>
                <p className="text-sm text-gray-600 mt-1">Employee: 0.2% | Employer: 0.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Payroll Trend */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Monthly Payroll Trend</h3>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value: number) => `RM ${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Payroll Details */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-900">Employee Payroll - June 2024</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Employee</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">Basic Salary</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">Allowances</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">EPF</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">SOCSO</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">Net Salary</th>
                <th className="px-6 py-3 text-center text-sm text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeePayroll.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.position}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">RM {employee.basicSalary.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">RM {employee.allowances.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">RM {employee.epf.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">RM {employee.socso.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">RM {employee.netSalary.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <Wallet className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Process Payroll</h4>
          <p className="text-xs text-gray-600">Run monthly payroll</p>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <FileText className="w-6 h-6 text-green-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Generate Slips</h4>
          <p className="text-xs text-gray-600">Create pay slips</p>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Tax Reports</h4>
          <p className="text-xs text-gray-600">EA/EC forms</p>
        </button>
        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <Download className="w-6 h-6 text-orange-600 mb-2" />
          <h4 className="text-sm text-gray-900 mb-1">Bank File</h4>
          <p className="text-xs text-gray-600">Export for transfer</p>
        </button>
      </div>
    </div>
  );
}