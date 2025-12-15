import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  Shield, 
  Activity,
  HardDrive,
  FileJson,
  Play,
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

export function DatabaseManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'migrations' | 'backup' | 'seeds'>('overview');

  const dbStats = {
    totalSize: '245.8 MB',
    totalTables: 28,
    totalRecords: 15847,
    lastBackup: '2 hours ago',
    uptime: '99.98%',
    connections: 12
  };

  const tables = [
    { name: 'users', records: 156, size: '2.4 MB', status: 'healthy' },
    { name: 'employees', records: 523, size: '8.7 MB', status: 'healthy' },
    { name: 'leave_applications', records: 2341, size: '15.2 MB', status: 'healthy' },
    { name: 'attendance_records', records: 8567, size: '45.8 MB', status: 'healthy' },
    { name: 'payroll_records', records: 1245, size: '32.1 MB', status: 'healthy' },
    { name: 'zakat_records', records: 987, size: '5.6 MB', status: 'healthy' },
    { name: 'foreign_workers', records: 234, size: '4.2 MB', status: 'healthy' },
    { name: 'audit_logs', records: 1794, size: '18.3 MB', status: 'warning' },
  ];

  const migrations = [
    { id: 1, name: '20250101_initial_schema', status: 'completed', date: '2025-01-01' },
    { id: 2, name: '20250115_add_zakat_module', status: 'completed', date: '2025-01-15' },
    { id: 3, name: '20250120_foreign_workers', status: 'completed', date: '2025-01-20' },
    { id: 4, name: '20250125_ir_er_modules', status: 'completed', date: '2025-01-25' },
    { id: 5, name: '20250130_multi_tenancy', status: 'pending', date: null },
  ];

  const backups = [
    { id: 1, name: 'ai_hrms_backup_20250215_120000.sql', size: '238.5 MB', date: '2025-02-15 12:00:00', status: 'success' },
    { id: 2, name: 'ai_hrms_backup_20250214_120000.sql', size: '235.2 MB', date: '2025-02-14 12:00:00', status: 'success' },
    { id: 3, name: 'ai_hrms_backup_20250213_120000.sql', size: '232.8 MB', date: '2025-02-13 12:00:00', status: 'success' },
    { id: 4, name: 'ai_hrms_backup_20250212_120000.sql', size: '230.1 MB', date: '2025-02-12 12:00:00', status: 'success' },
  ];

  const seeds = [
    { name: 'Malaysian Public Holidays 2025', status: 'seeded', records: 25 },
    { name: 'Leave Types (Annual, Medical, etc)', status: 'seeded', records: 8 },
    { name: 'EPF/SOCSO Rate Tables', status: 'seeded', records: 156 },
    { name: 'State Zakat Rates', status: 'seeded', records: 14 },
    { name: 'Sample Employees (Demo)', status: 'not_seeded', records: 0 },
    { name: 'Sample Payroll Data (Demo)', status: 'not_seeded', records: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Database Management</h1>
          <p className="text-gray-500">Manage your database, migrations, backups, and seeds</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Size</span>
            <HardDrive className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-gray-900">{dbStats.totalSize}</p>
          <p className="text-sm text-gray-400">{dbStats.totalTables} tables</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Records</span>
            <Database className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-900">{dbStats.totalRecords.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Across all tables</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Uptime</span>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-gray-900">{dbStats.uptime}</p>
          <p className="text-sm text-gray-400">{dbStats.connections} connections</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Last Backup</span>
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-gray-900">{dbStats.lastBackup}</p>
          <p className="text-sm text-gray-400">Auto backup enabled</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Connection</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-900">Neon PostgreSQL</p>
          <p className="text-sm text-gray-400">ap-southeast-1</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Prisma Studio</span>
            <FileJson className="w-5 h-5 text-indigo-600" />
          </div>
          <button className="text-blue-600 hover:underline text-sm">
            Open Studio
          </button>
          <p className="text-sm text-gray-400">Port 5555</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tables Overview
            </button>
            <button
              onClick={() => setActiveTab('migrations')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'migrations'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Migrations
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'backup'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Backup & Restore
            </button>
            <button
              onClick={() => setActiveTab('seeds')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'seeds'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Seed Data
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tables Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Database Tables</h3>
                <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  <Database className="w-4 h-4" />
                  View in Prisma Studio
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-500 text-sm">Table Name</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-sm">Records</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-sm">Size</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table) => (
                      <tr key={table.name} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{table.name}</code>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{table.records.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-700">{table.size}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            table.status === 'healthy' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {table.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                            <button className="text-gray-600 hover:text-gray-700 text-sm">Export</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Migrations */}
          {activeTab === 'migrations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Database Migrations</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run Pending Migrations
                </button>
              </div>
              <div className="space-y-3">
                {migrations.map((migration) => (
                  <div key={migration.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          migration.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {migration.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <code className="text-sm">{migration.name}</code>
                          <p className="text-xs text-gray-500 mt-1">
                            {migration.date ? `Migrated on ${migration.date}` : 'Not yet migrated'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {migration.status === 'pending' && (
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                            Run
                          </button>
                        )}
                        <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                          View SQL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Database Backups</h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Create Backup
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Restore from File
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900">Automatic backups are enabled</p>
                    <p className="text-xs text-blue-700 mt-1">Daily backups at 12:00 AM (UTC+8). Retention: 30 days</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <code className="text-sm">{backup.name}</code>
                          <p className="text-xs text-gray-500 mt-1">
                            {backup.size} • {backup.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                        <button className="px-3 py-1.5 border border-orange-300 text-orange-700 text-sm rounded-lg hover:bg-orange-50 flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          Restore
                        </button>
                        <button className="px-3 py-1.5 border border-red-300 text-red-700 text-sm rounded-lg hover:bg-red-50">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seed Data */}
          {activeTab === 'seeds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Seed Data Management</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run All Seeds
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900">Running seeds will populate your database with initial data</p>
                    <p className="text-xs text-yellow-700 mt-1">Make sure to run seeds only on fresh installations or when explicitly needed</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {seeds.map((seed) => (
                  <div key={seed.name} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          seed.status === 'seeded'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {seed.status === 'seeded' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{seed.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {seed.status === 'seeded' 
                              ? `${seed.records} records seeded`
                              : 'Not yet seeded'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {seed.status === 'seeded' ? (
                          <button className="px-3 py-1.5 border border-orange-300 text-orange-700 text-sm rounded-lg hover:bg-orange-50 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Re-seed
                          </button>
                        ) : (
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            Run Seed
                          </button>
                        )}
                        <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                          View Code
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
