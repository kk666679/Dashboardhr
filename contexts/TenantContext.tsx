import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  settings: {
    currency: string;
    language: string;
    timezone: string;
    fiscalYearStart: string;
  };
  subscription: {
    plan: 'free' | 'basic' | 'professional' | 'enterprise';
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    employeeLimit: number;
    expiryDate?: string;
  };
  compliance: {
    epfEnabled: boolean;
    socsoEnabled: boolean;
    eisEnabled: boolean;
    zakatEnabled: boolean;
    pcbEnabled: boolean;
  };
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  updateTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Tech Solutions Sdn Bhd',
      logo: '🏢',
      domain: 'techsolutions.my',
      settings: {
        currency: 'MYR',
        language: 'en',
        timezone: 'Asia/Kuala_Lumpur',
        fiscalYearStart: '01-01',
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        employeeLimit: 1000,
        expiryDate: '2025-12-31',
      },
      compliance: {
        epfEnabled: true,
        socsoEnabled: true,
        eisEnabled: true,
        zakatEnabled: true,
        pcbEnabled: true,
      },
    },
    {
      id: '2',
      name: 'Retail Malaysia Bhd',
      logo: '🛍️',
      domain: 'retailmalaysia.my',
      settings: {
        currency: 'MYR',
        language: 'en',
        timezone: 'Asia/Kuala_Lumpur',
        fiscalYearStart: '01-01',
      },
      subscription: {
        plan: 'professional',
        status: 'active',
        employeeLimit: 500,
        expiryDate: '2025-09-30',
      },
      compliance: {
        epfEnabled: true,
        socsoEnabled: true,
        eisEnabled: true,
        zakatEnabled: false,
        pcbEnabled: true,
      },
    },
    {
      id: '3',
      name: 'Manufacturing Corp',
      logo: '🏭',
      domain: 'manufacturing.my',
      settings: {
        currency: 'MYR',
        language: 'en',
        timezone: 'Asia/Kuala_Lumpur',
        fiscalYearStart: '01-01',
      },
      subscription: {
        plan: 'basic',
        status: 'trial',
        employeeLimit: 100,
        expiryDate: '2025-03-15',
      },
      compliance: {
        epfEnabled: true,
        socsoEnabled: true,
        eisEnabled: false,
        zakatEnabled: false,
        pcbEnabled: true,
      },
    },
  ]);

  const [currentTenant, setCurrentTenant] = useState<Tenant>(tenants[0]);

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // In real app, this would trigger an API call and reload tenant-specific data
      console.log('Switched to tenant:', tenant.name);
    }
  };

  const updateTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    // In real app, this would trigger an API call to update tenant settings
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenants,
        switchTenant,
        updateTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
