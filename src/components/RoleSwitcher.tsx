import React, { useState } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { Shield, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RoleSwitcher() {
  const { currentUser, roles, switchRole, getCurrentRole } = useRBAC();
  const [isOpen, setIsOpen] = useState(false);
  const currentRole = getCurrentRole();

  const getRoleColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 text-red-700 border-red-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md ${
          currentRole ? getRoleColor(currentRole.color) : 'bg-gray-100 text-gray-700 border-gray-200'
        }`}
      >
        <Shield className="w-4 h-4" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold">{currentRole?.name}</p>
          <p className="text-xs opacity-75">Switch Role</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border-2 border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1">Role-Based Access Control</h3>
                <p className="text-xs text-gray-600">Select a role to test different permissions</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {roles.map((role) => {
                  const isActive = currentUser.roleId === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        switchRole(role.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-all border-b border-gray-100 ${
                        isActive ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${getRoleColor(role.color)}`}>
                              {role.name}
                            </span>
                            {isActive && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-500">{role.permissions.length} permissions</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Current: <strong>{currentRole?.name}</strong></span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
