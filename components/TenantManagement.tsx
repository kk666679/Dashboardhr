import React, { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { 
  Building2, 
  Settings, 
  Users, 
  CreditCard, 
  Shield, 
  Globe,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Crown,
  Edit,
  Plus
} from 'lucide-react';

export function TenantManagement() {
  const { currentTenant, tenants, switchTenant } = useTenant();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'subscription' | 'compliance'>('overview');

  if (!currentTenant) return null;

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: { color: 'gray', label: 'Free' },
      basic: { color: 'blue', label: 'Basic' },
      professional: { color: 'purple', label: 'Professional' },
      enterprise: { color: 'orange', label: 'Enterprise' },
    };
    return badges[plan as keyof typeof badges] || badges.free;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'green', label: 'Active', icon: CheckCircle },
      trial: { color: 'blue', label: 'Trial', icon: AlertCircle },
      suspended: { color: 'red', label: 'Suspended', icon: AlertCircle },
      cancelled: { color: 'gray', label: 'Cancelled', icon: AlertCircle },
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  const planBadge = getPlanBadge(currentTenant.subscription.plan);
  const statusBadge = getStatusBadge(currentTenant.subscription.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Tenant Management</h1>
          <p className="text-gray-500">Manage your organization settings and configurations</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Tenant
        </button>
      </div>

      {/* Current Tenant Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
              {currentTenant.logo}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-gray-900">{currentTenant.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs bg-${planBadge.color}-100 text-${planBadge.color}-700 flex items-center gap-1`}>
                  <Crown className="w-3 h-3" />
                  {planBadge.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs bg-${statusBadge.color}-100 text-${statusBadge.color}-700 flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{currentTenant.domain}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentTenant.subscription.employeeLimit} employees
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {currentTenant.settings.timezone}
                </span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* All Tenants */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">All Organizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tenants.map((tenant) => {
            const isActive = currentTenant.id === tenant.id;
            const badge = getPlanBadge(tenant.subscription.plan);
            const status = getStatusBadge(tenant.subscription.status);
            const TenantStatusIcon = status.icon;
            
            return (
              <button
                key={tenant.id}
                onClick={() => switchTenant(tenant.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {tenant.logo}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <h4 className="text-gray-900 mb-1">{tenant.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{tenant.domain}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs bg-${badge.color}-100 text-${badge.color}-700`}>
                    {badge.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs bg-${status.color}-100 text-${status.color}-700 flex items-center gap-1`}>
                    <TenantStatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
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
              Overview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'subscription'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Subscription
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'compliance'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Compliance
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-gray-900">Organization Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Organization Name</p>
                      <p className="text-sm text-gray-900">{currentTenant.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Domain</p>
                      <p className="text-sm text-gray-900">{currentTenant.domain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Employee Limit</p>
                      <p className="text-sm text-gray-900">{currentTenant.subscription.employeeLimit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-gray-900">Subscription Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Crown className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Plan</p>
                      <p className="text-sm text-gray-900 capitalize">{currentTenant.subscription.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm text-gray-900 capitalize">{currentTenant.subscription.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Expiry Date</p>
                      <p className="text-sm text-gray-900">{currentTenant.subscription.expiryDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900 mb-4">Regional Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Currency</label>
                    <input
                      type="text"
                      value={currentTenant.settings.currency}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Language</label>
                    <input
                      type="text"
                      value={currentTenant.settings.language}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Timezone</label>
                    <input
                      type="text"
                      value={currentTenant.settings.timezone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Fiscal Year Start</label>
                    <input
                      type="text"
                      value={currentTenant.settings.fiscalYearStart}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['basic', 'professional', 'enterprise'].map((plan) => {
                  const isCurrentPlan = currentTenant.subscription.plan === plan;
                  const planDetails = {
                    basic: { price: 'RM 299', employees: 100, features: ['EPF/SOCSO', 'Leave & Attendance', 'Basic Reports'] },
                    professional: { price: 'RM 499', employees: 500, features: ['All Basic', 'Payroll', 'Advanced Analytics', 'Zakat Management'] },
                    enterprise: { price: 'from RM 999', employees: 1000, features: ['All Professional', 'IR/ER Modules', 'Foreign Workers', 'Priority Support'] },
                  };
                  const details = planDetails[plan as keyof typeof planDetails];

                  return (
                    <div
                      key={plan}
                      className={`p-6 rounded-lg border-2 ${
                        isCurrentPlan
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <h4 className="text-gray-900 capitalize mb-2">{plan}</h4>
                      <p className="text-gray-900 mb-4">{details.price}/month</p>
                      <p className="text-sm text-gray-600 mb-4">Up to {details.employees} employees</p>
                      <ul className="space-y-2 mb-6">
                        {details.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-2 rounded-lg ${
                          isCurrentPlan
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={isCurrentPlan}
                      >
                        {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <h4 className="text-gray-900">Malaysian Compliance Features</h4>
              <div className="space-y-3">
                {Object.entries(currentTenant.compliance).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className={`w-5 h-5 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm text-gray-900">{key.toUpperCase().replace('ENABLED', '')}</p>
                        <p className="text-xs text-gray-500">
                          {enabled ? 'Enabled and active' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      enabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {enabled ? 'Active' : 'Inactive'}
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