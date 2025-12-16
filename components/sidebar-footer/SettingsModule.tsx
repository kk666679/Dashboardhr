"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronRight, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface SettingsOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
}

export interface SettingsModuleProps {
  collapsed?: boolean;
  options?: SettingsOption[];
  onSettingClick?: (settingId: string) => void;
  className?: string;
}

const defaultOptions: SettingsOption[] = [
  {
    id: 'profile',
    label: 'Profile Settings',
    icon: User,
    description: 'Update your personal information',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Manage notification preferences',
    badge: '3',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Password and authentication',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    description: 'Theme and display settings',
  },
  {
    id: 'language',
    label: 'Language & Region',
    icon: Globe,
    description: 'Language and localization',
  },
];

export function SettingsModule({
  collapsed = false,
  options = defaultOptions,
  onSettingClick,
  className,
}: SettingsModuleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderCollapsed = () => (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative w-10 h-10 rounded-lg hover:bg-sidebar-accent transition-colors flex items-center justify-center",
            className
          )}
          aria-label="Settings menu"
        >
          <Settings className="w-4 h-4 text-sidebar-foreground/70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64"
        side="right"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 border-b">
          <p className="text-sm font-medium">Settings</p>
        </div>
        <div className="py-1">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => onSettingClick?.(option.id)}
                className="flex items-center gap-3 p-3"
              >
                <Icon className="w-4 h-4 text-sidebar-foreground/70" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{option.label}</span>
                    {option.badge && (
                      <span className="px-1.5 py-0.5 text-xs bg-sidebar-accent text-sidebar-accent-foreground rounded-full">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {option.description}
                    </p>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderExpanded = () => (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
        <Settings className="w-3 h-3" />
        <span>Settings</span>
      </div>

      <div className="space-y-1">
        {options.slice(0, 3).map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSettingClick?.(option.id)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors group text-left"
            >
              <Icon className="w-4 h-4 text-sidebar-foreground/60 group-hover:text-sidebar-foreground/80" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sidebar-foreground/80 group-hover:text-sidebar-foreground">
                    {option.label}
                  </span>
                  {option.badge && (
                    <span className="px-1.5 py-0.5 text-xs bg-sidebar-accent text-sidebar-accent-foreground rounded-full">
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {option.description}
                  </p>
                )}
              </div>
              <ChevronRight className="w-3 h-3 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60" />
            </button>
          );
        })}

        {options.length > 3 && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors group text-left">
                <div className="w-4 h-4 rounded bg-sidebar-accent/50 flex items-center justify-center">
                  <span className="text-xs text-sidebar-foreground/70 font-medium">
                    +{options.length - 3}
                  </span>
                </div>
                <span className="text-sm font-medium text-sidebar-foreground/80 group-hover:text-sidebar-foreground">
                  More Settings
                </span>
                <ChevronRight className="w-3 h-3 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60 ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64"
              side="top"
              sideOffset={8}
            >
              <div className="py-1">
                {options.slice(3).map((option) => {
                  const Icon = option.icon;
                  return (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => onSettingClick?.(option.id)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Icon className="w-4 h-4 text-sidebar-foreground/70" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{option.label}</span>
                          {option.badge && (
                            <span className="px-1.5 py-0.5 text-xs bg-sidebar-accent text-sidebar-accent-foreground rounded-full">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-xs text-sidebar-foreground/60 truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  return collapsed ? renderCollapsed() : renderExpanded();
}
