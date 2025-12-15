import React, { useState } from 'react';
import { 
  Globe, 
  AlertTriangle, 
  FileCheck, 
  Calendar, 
  Building, 
  Plane,
  Plus,
  Upload,
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';

type FilterType = 'all' | 'expiring' | 'fomema-pending';
type WorkerStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Renewal Pending';
type FomemaStatus = 'Suitable' | 'Pending' | 'Unsuitable';

interface Worker {
  id: string;
  name: string;
  nationality: string;
  passportNo: string;
  permitType: string;
  permitNo: string;
  permitExpiry: string;
  fomemaStatus: FomemaStatus;
  lastMedical: string;
  nextMedical: string;
  status: WorkerStatus;
  complianceScore: number;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
}

export function ForeignWorkers() {
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showWorkerDetailsModal, setShowWorkerDetailsModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showFomemaModal, setShowFomemaModal] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 'FW-001',
      name: 'Md. Rahman Ali',
      nationality: 'Bangladesh',
      passportNo: 'BD123456',
      permitType: 'Work Permit',
      permitNo: 'WP2024001',
      permitExpiry: '2024-12-31',
      fomemaStatus: 'Suitable',
      lastMedical: '2024-01-15',
      nextMedical: '2025-01-15',
      status: 'Active',
      complianceScore: 95,
      email: 'rahman@company.my',
      phone: '+60 12-345 6789',
      position: 'Factory Operator',
      department: 'Production'
    },
    {
      id: 'FW-002',
      name: 'Suresh Kumar',
      nationality: 'Nepal',
      passportNo: 'NP789012',
      permitType: 'Employment Pass',
      permitNo: 'EP2024002',
      permitExpiry: '2024-08-20',
      fomemaStatus: 'Pending',
      lastMedical: '2023-08-10',
      nextMedical: '2024-08-10',
      status: 'Expiring Soon',
      complianceScore: 72,
      email: 'suresh@company.my',
      phone: '+60 12-456 7890',
      position: 'Technical Specialist',
      department: 'Engineering'
    },
    {
      id: 'FW-003',
      name: 'Siti Aminah',
      nationality: 'Indonesia',
      passportNo: 'ID345678',
      permitType: 'Work Permit',
      permitNo: 'WP2024003',
      permitExpiry: '2025-03-15',
      fomemaStatus: 'Suitable',
      lastMedical: '2024-03-10',
      nextMedical: '2025-03-10',
      status: 'Active',
      complianceScore: 98,
      email: 'siti@company.my',
      phone: '+60 12-567 8901',
      position: 'Quality Controller',
      department: 'Quality Assurance'
    },
  ]);

  const stats = [
    { label: 'Total Foreign Workers', value: workers.length.toString(), change: '+12', icon: Globe, color: 'blue' },
    { label: 'Expiring Permits', value: workers.filter(w => w.status === 'Expiring Soon').length.toString(), change: '0', icon: AlertTriangle, color: 'orange' },
    { label: 'FOMEMA Pending', value: workers.filter(w => w.fomemaStatus === 'Pending').length.toString(), change: '-2', icon: FileCheck, color: 'yellow' },
    { label: 'Compliance Rate', value: '94%', change: '+3%', icon: Building, color: 'green' },
  ];

  const getStatusColor = (status: WorkerStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expiring Soon': return 'bg-orange-100 text-orange-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Renewal Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFomemaColor = (status: FomemaStatus) => {
    switch (status) {
      case 'Suitable': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Unsuitable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNationalityFlag = (nationality: string) => {
    const flags: { [key: string]: string } = {
      'Bangladesh': '🇧🇩',
      'Nepal': '🇳🇵',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Myanmar': '🇲🇲',
      'India': '🇮🇳',
      'Pakistan': '🇵🇰',
      'Vietnam': '🇻🇳',
      'Thailand': '🇹🇭',
      'Cambodia': '🇰🇭',
    };
    return flags[nationality] || '🌍';
  };

  const filteredWorkers = workers.filter(worker => {
    // Apply filter
    if (filterType === 'expiring' && worker.status !== 'Expiring Soon') return false;
    if (filterType === 'fomema-pending' && worker.fomemaStatus !== 'Pending') return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        worker.name.toLowerCase().includes(query) ||
        worker.id.toLowerCase().includes(query) ||
        worker.nationality.toLowerCase().includes(query) ||
        worker.permitNo.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleViewWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowWorkerDetailsModal(true);
  };

  const handleDeleteWorker = (workerId: string) => {
    if (confirm('Are you sure you want to remove this worker from the system?')) {
      setWorkers(workers.filter(w => w.id !== workerId));
    }
  };

  const handleExportData = () => {
    alert('Exporting worker data to CSV...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Foreign Workers Management</h1>
          <p className="text-sm text-gray-500">Immigration compliance and work permit tracking</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportData}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Workers
          </button>
          <button 
            onClick={() => setShowAddWorkerModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Foreign Worker
          </button>
        </div>
      </div>

      {/* Compliance Alert */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            🌍
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">Malaysian Immigration Compliance</h3>
            <p className="text-white/90 text-sm mb-3">
              AI-powered permit renewal predictions active. {workers.filter(w => w.status === 'Expiring Soon').length} permits expiring in the next 90 days. 
              FOMEMA integration ensures medical compliance tracking for all foreign workers.
            </p>
            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-1 bg-white/20 rounded text-sm">Immigration Dept API ✓</span>
              <span className="px-3 py-1 bg-white/20 rounded text-sm">FOMEMA Integration ✓</span>
              <span className="px-3 py-1 bg-white/20 rounded text-sm">MOHR Compliant ✓</span>
              <span className="px-3 py-1 bg-white/20 rounded text-sm">JTK Regulations ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-red-600' : stat.change.startsWith('-') ? 'text-green-600' : 'text-gray-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Foreign Worker Registry</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                  filterType === 'all' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Workers ({workers.length})
              </button>
              <button 
                onClick={() => setFilterType('expiring')}
                className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                  filterType === 'expiring' 
                    ? 'bg-orange-50 border-orange-300 text-orange-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Expiring Soon ({workers.filter(w => w.status === 'Expiring Soon').length})
              </button>
              <button 
                onClick={() => setFilterType('fomema-pending')}
                className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                  filterType === 'fomema-pending' 
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                FOMEMA Pending ({workers.filter(w => w.fomemaStatus === 'Pending').length})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, nationality, or permit number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Worker ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Nationality</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Passport No.</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Permit Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Permit No.</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Permit Expiry</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">FOMEMA</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Compliance</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    No workers found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewWorker(worker)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {worker.id}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{worker.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getNationalityFlag(worker.nationality)}
                        </span>
                        <span className="text-sm text-gray-900">{worker.nationality}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{worker.passportNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{worker.permitType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{worker.permitNo}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{worker.permitExpiry}</div>
                      <div className="text-xs text-gray-500">
                        {worker.status === 'Expiring Soon' ? '⚠️ 2 months left' : '✓ Valid'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${getFomemaColor(worker.fomemaStatus)}`}>
                        {worker.fomemaStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(worker.status)}`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              worker.complianceScore >= 90 ? 'bg-green-500' :
                              worker.complianceScore >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${worker.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{worker.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewWorker(worker)}
                          className="p-1 hover:bg-blue-50 rounded text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedWorker(worker);
                            setShowAddWorkerModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteWorker(worker.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permit Renewals */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-900">Upcoming Renewals</h3>
          </div>
          <div className="space-y-3">
            {workers.filter(w => w.status === 'Expiring Soon').map((worker) => (
              <div key={worker.id} className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-900">{worker.name}</span>
                  <span className="text-xs text-orange-600">60 days</span>
                </div>
                <span className="text-xs text-gray-500">{worker.permitNo} - {worker.permitType}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowRenewalModal(true)}
            className="w-full mt-4 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            View All Renewals
          </button>
        </div>

        {/* FOMEMA Schedule */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="w-6 h-6 text-green-600" />
            <h3 className="text-gray-900">FOMEMA Medical</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Scheduled</span>
              <span className="text-sm text-gray-900">12 workers</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Pending Results</span>
              <span className="text-sm text-yellow-600">{workers.filter(w => w.fomemaStatus === 'Pending').length} workers</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Due Soon</span>
              <span className="text-sm text-orange-600">8 workers</span>
            </div>
          </div>
          <button 
            onClick={() => setShowFomemaModal(true)}
            className="w-full mt-4 px-4 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            Schedule FOMEMA
          </button>
        </div>

        {/* Agencies */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-6 h-6 text-purple-600" />
            <h3 className="text-gray-900">Recruitment Agencies</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-900">Global Manpower</span>
                <span className="text-xs text-green-600">★ 4.8</span>
              </div>
              <span className="text-xs text-gray-500">License: RA2024001</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-900">Asia Workforce</span>
                <span className="text-xs text-green-600">★ 4.6</span>
              </div>
              <span className="text-xs text-gray-500">License: RA2024005</span>
            </div>
          </div>
          <button 
            onClick={() => setShowAgencyModal(true)}
            className="w-full mt-4 px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          >
            Manage Agencies
          </button>
        </div>
      </div>

      {/* Add/Edit Worker Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">
                {selectedWorker ? 'Edit Worker' : 'Add Foreign Worker'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddWorkerModal(false);
                  setSelectedWorker(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nationality</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Bangladesh</option>
                      <option>Nepal</option>
                      <option>Indonesia</option>
                      <option>Philippines</option>
                      <option>Myanmar</option>
                      <option>India</option>
                      <option>Pakistan</option>
                      <option>Vietnam</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Passport Number</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.passportNo}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Permit Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Work Permit</option>
                      <option>Employment Pass</option>
                      <option>Temporary Work Pass</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Permit Number</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.permitNo}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Permit Expiry</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.permitExpiry}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.phone}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Position</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.position}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Department</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedWorker?.department}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      alert('Worker saved successfully!');
                      setShowAddWorkerModal(false);
                      setSelectedWorker(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedWorker ? 'Update Worker' : 'Add Worker'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddWorkerModal(false);
                      setSelectedWorker(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Worker Details Modal */}
      {showWorkerDetailsModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Worker Details</h2>
              <button 
                onClick={() => {
                  setShowWorkerDetailsModal(false);
                  setSelectedWorker(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Worker ID</p>
                    <p className="text-gray-900">{selectedWorker.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900">{selectedWorker.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="text-gray-900 flex items-center gap-2">
                      <span>{getNationalityFlag(selectedWorker.nationality)}</span>
                      {selectedWorker.nationality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passport Number</p>
                    <p className="text-gray-900">{selectedWorker.passportNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedWorker.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{selectedWorker.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-gray-900">{selectedWorker.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900">{selectedWorker.department}</p>
                  </div>
                </div>
              </div>

              {/* Permit Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg text-gray-900 mb-4">Work Permit Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Permit Type</p>
                    <p className="text-gray-900">{selectedWorker.permitType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Permit Number</p>
                    <p className="text-gray-900">{selectedWorker.permitNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Permit Expiry</p>
                    <p className="text-gray-900">{selectedWorker.permitExpiry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(selectedWorker.status)}`}>
                      {selectedWorker.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg text-gray-900 mb-4">Medical Examination (FOMEMA)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Last Medical</p>
                    <p className="text-gray-900">{selectedWorker.lastMedical}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Medical Due</p>
                    <p className="text-gray-900">{selectedWorker.nextMedical}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">FOMEMA Status</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getFomemaColor(selectedWorker.fomemaStatus)}`}>
                      {selectedWorker.fomemaStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compliance Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedWorker.complianceScore >= 90 ? 'bg-green-500' :
                            selectedWorker.complianceScore >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedWorker.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-gray-900">{selectedWorker.complianceScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowWorkerDetailsModal(false);
                    setShowAddWorkerModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Worker
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Print Details
                </button>
                <button 
                  onClick={() => {
                    setShowWorkerDetailsModal(false);
                    setSelectedWorker(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Import Workers</h2>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-900 mb-2">Upload CSV or Excel file</p>
                <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
                <input type="file" className="hidden" id="file-upload" accept=".csv,.xlsx" />
                <label 
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Download sample template
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Permit Renewals</h2>
              <button 
                onClick={() => setShowRenewalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Workers requiring permit renewal in the next 90 days</p>
              <div className="space-y-3">
                {workers.filter(w => w.status === 'Expiring Soon').map((worker) => (
                  <div key={worker.id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-gray-900">{worker.name}</p>
                        <p className="text-sm text-gray-600">{worker.permitNo} - {worker.permitType}</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm">60 days left</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Start Renewal Process →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOMEMA Modal */}
      {showFomemaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Schedule FOMEMA Medical</h2>
              <button 
                onClick={() => setShowFomemaModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Schedule medical examination for foreign workers</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Select Worker(s)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select workers...</option>
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Appointment Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">FOMEMA Clinic</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Klinik Kesihatan KL</option>
                    <option>FOMEMA Clinic Subang</option>
                    <option>Medical Centre Shah Alam</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => {
                      alert('FOMEMA appointment scheduled successfully!');
                      setShowFomemaModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Schedule Appointment
                  </button>
                  <button 
                    onClick={() => setShowFomemaModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agency Modal */}
      {showAgencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Recruitment Agencies</h2>
              <button 
                onClick={() => setShowAgencyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <button className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Agency
              </button>
              <div className="space-y-3">
                {[
                  { name: 'Global Manpower', license: 'RA2024001', rating: 4.8, workers: 45 },
                  { name: 'Asia Workforce', license: 'RA2024005', rating: 4.6, workers: 32 },
                  { name: 'International Recruitment', license: 'RA2024012', rating: 4.9, workers: 28 },
                ].map((agency, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-gray-900">{agency.name}</h3>
                          <span className="text-sm text-green-600">★ {agency.rating}</span>
                        </div>
                        <p className="text-sm text-gray-500">License: {agency.license}</p>
                        <p className="text-sm text-gray-500">{agency.workers} workers placed</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
