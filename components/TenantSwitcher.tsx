import React, { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { useRBAC } from '../contexts/RBACContext';
import { ChevronDown, Building2, Shield, Check } from 'lucide-react';

interface TenantSwitcherProps {
  collapsed?: boolean;
}

export function TenantSwitcher({ collapsed = false }: TenantSwitcherProps) {
  const { currentTenant, tenants, switchTenant } = useTenant();
  const { currentUser, getCurrentRole } = useRBAC();
  const [showDropdown, setShowDropdown] = useState(false);

  const currentRole = getCurrentRole();

  if (!currentTenant) return null;

  if (collapsed) {
    return (
      <div className="relative group">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
          title={currentTenant.name}
        >
          <div className="text-2xl text-center">
            {currentTenant.logo}
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 top-0">
          {currentTenant.name}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute left-full ml-2 top-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Switch Organization</p>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {tenants.map((tenant) => {
                  const isActive = currentTenant.id === tenant.id;
                  return (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        switchTenant(tenant.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="text-xl">{tenant.logo}</div>
                      <div className="flex-1 text-left">
                        <p className="text-sm">{tenant.name}</p>
                        <p className="text-xs text-gray-500">{tenant.domain}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-sm">
            {currentTenant.logo}
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-900">{currentTenant.name}</p>
              <span className={`px-2 py-0.5 rounded text-xs ${
                currentTenant.subscription.plan === 'enterprise'
                  ? 'bg-orange-100 text-orange-700'
                  : currentTenant.subscription.plan === 'professional'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {currentTenant.subscription.plan}
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3" />
              {currentRole?.name}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Switch Organization</p>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
              {tenants.map((tenant) => {
                const isActive = currentTenant.id === tenant.id;
                return (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      switchTenant(tenant.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="text-xl">{tenant.logo}</div>
                    <div className="flex-1 text-left">
                      <p className="text-sm">{tenant.name}</p>
                      <p className="text-xs text-gray-500">{tenant.domain}</p>
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
