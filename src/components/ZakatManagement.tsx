import React from 'react';
import { Moon, DollarSign, TrendingUp, CheckCircle, Calendar, MapPin } from 'lucide-react';

export function ZakatManagement() {
  const zakatRecords = [
    {
      employeeId: 'EMP-001',
      name: 'Ahmad Fauzi bin Hassan',
      month: 'May 2024',
      zakatableIncome: 8500,
      zakatRate: 2.5,
      zakatAmount: 212.50,
      state: 'Selangor',
      institution: 'Lembaga Zakat Selangor',
      status: 'Paid',
      paidDate: '2024-05-15',
      receiptNo: 'ZS2024-05-1234'
    },
    {
      employeeId: 'EMP-002',
      name: 'Nurul Izzah binti Abdullah',
      month: 'May 2024',
      zakatableIncome: 6200,
      zakatRate: 2.5,
      zakatAmount: 155.00,
      state: 'Kuala Lumpur',
      institution: 'Pusat Pungutan Zakat MAIWP',
      status: 'Pending',
      paidDate: null,
      receiptNo: null
    },
    {
      employeeId: 'EMP-003',
      name: 'Muhammad Syafiq bin Ibrahim',
      month: 'May 2024',
      zakatableIncome: 12000,
      zakatRate: 2.5,
      zakatAmount: 300.00,
      state: 'Penang',
      institution: 'Majlis Agama Islam Negeri Pulau Pinang',
      status: 'Calculated',
      paidDate: null,
      receiptNo: null
    },
  ];

  const stats = [
    { label: 'Total Employees (Zakat)', value: '89', change: '+5', icon: Moon, color: 'purple' },
    { label: 'Monthly Zakat', value: 'RM 18,450', change: '+8%', icon: DollarSign, color: 'green' },
    { label: 'Compliance Rate', value: '96%', change: '+2%', icon: CheckCircle, color: 'blue' },
    { label: 'Avg. Contribution', value: 'RM 207', change: '+12', icon: TrendingUp, color: 'orange' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Calculated': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Exempted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Zakat Management</h1>
          <p className="text-sm text-gray-500">Sharia-compliant zakat calculation and distribution</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Process Monthly Zakat
          </button>
        </div>
      </div>

      {/* Sharia Compliance Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
            ☪️
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">JAWHAR Approved Zakat System</h3>
            <p className="text-white/90 text-sm mb-3">
              Automated zakat calculation based on state-specific rates. All calculations are Sharia-compliant 
              and verified by certified Islamic scholars. Real-time integration with state zakat institutions.
            </p>
            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded text-sm">JAWHAR Certified ✓</span>
              <span className="px-3 py-1 bg-white/20 rounded text-sm">Sharia Compliant ✓</span>
              <span className="px-3 py-1 bg-white/20 rounded text-sm">Halal Income Verified ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Zakat Records Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Monthly Zakat Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Employee</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Month</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Zakatable Income</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Rate</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Zakat Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">State</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Institution</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Receipt No.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zakatRecords.map((record) => (
                <tr key={record.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{record.name}</div>
                      <div className="text-xs text-gray-500">{record.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.month}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">RM {record.zakatableIncome.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.zakatRate}%</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-purple-600">RM {record.zakatAmount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.institution}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {record.receiptNo ? (
                      <span className="text-sm text-blue-600">{record.receiptNo}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State Institutions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-purple-600" />
            <h3 className="text-gray-900">Zakat Institutions</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-900 mb-1">Selangor</div>
              <div className="text-xs text-gray-500">Lembaga Zakat Selangor</div>
              <div className="text-xs text-purple-600 mt-1">35 employees</div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-900 mb-1">Kuala Lumpur</div>
              <div className="text-xs text-gray-500">PPZ-MAIWP</div>
              <div className="text-xs text-purple-600 mt-1">28 employees</div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-900 mb-1">Penang</div>
              <div className="text-xs text-gray-500">MAINPP</div>
              <div className="text-xs text-purple-600 mt-1">26 employees</div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-900">This Month</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Total Calculated</span>
              <span className="text-sm text-gray-900">RM 18,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Paid</span>
              <span className="text-sm text-green-600">RM 14,230</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Pending</span>
              <span className="text-sm text-yellow-600">RM 4,220</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Payment Date</span>
                <span className="text-sm text-gray-900">May 25, 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sharia Verification */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">Halal Verification</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Income Sources</span>
              <span className="text-green-600">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Calculation Method</span>
              <span className="text-green-600">✓ Approved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Nisab Threshold</span>
              <span className="text-green-600">✓ Applied</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last verified by Ustaz Ahmad on May 1, 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
