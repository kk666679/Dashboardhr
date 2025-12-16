import React, { useState } from 'react';
import { EmployeeDirectory } from './EmployeeDirectory';
import { EmployeeSelfService } from './EmployeeSelfService';
import { UserCircle, Users, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassmorphicCard } from './GlassmorphicCard';
import { useRBAC } from '../contexts/RBACContext';

type EmployeeView = 'directory' | 'self-service';

export function EmployeeDirectoryEnhanced() {
  const [activeView, setActiveView] = useState<EmployeeView>('directory');
  const { getCurrentRole } = useRBAC();
  const currentRole = getCurrentRole();

  // Determine if user should see self-service (employee role) or directory (HR roles)
  const canSeeDirectory = currentRole?.id !== 'employee';
  const canSeeSelfService = true; // Everyone can see their own self-service portal

  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      {canSeeDirectory && canSeeSelfService && (
        <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveView('directory')}
                className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all ${
                  activeView === 'directory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">Employee Directory</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Admin
                </span>
              </button>
              <button
                onClick={() => setActiveView('self-service')}
                className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all ${
                  activeView === 'self-service'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <UserCircle className="w-5 h-5" />
                <span className="font-semibold">Employee Self-Service</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                  ESS
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      <div>
        {activeView === 'directory' && canSeeDirectory && <EmployeeDirectory />}
        {activeView === 'self-service' && canSeeSelfService && <EmployeeSelfService />}
        
        {/* Show only self-service for regular employees */}
        {!canSeeDirectory && canSeeSelfService && <EmployeeSelfService />}
      </div>

      {/* Quick Access Banner (for employee role only) */}
      {currentRole?.id === 'employee' && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GlassmorphicCard gradient="from-blue-500/90 to-purple-600/90" blur="xl">
              <div className="p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Employee Portal</p>
                    <p className="text-xs text-blue-100">Manage your HR needs</p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
