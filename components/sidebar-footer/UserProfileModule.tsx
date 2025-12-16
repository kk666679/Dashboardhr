"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role?: string;
}

export interface UserProfileModuleProps {
  user: UserData;
  collapsed?: boolean;
  onViewProfile?: () => void;
  onLogout?: () => void;
  onSettings?: () => void;
  className?: string;
}

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
};

const statusLabels = {
  online: 'Online',
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline',
};

export function UserProfileModule({
  user,
  collapsed = false,
  onViewProfile,
  onLogout,
  onSettings,
  className,
}: UserProfileModuleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (collapsed) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "relative w-10 h-10 rounded-lg hover:bg-sidebar-accent transition-colors group",
              className
            )}
            aria-label={`User menu for ${user.name}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar",
                statusColors[user.status]
              )}
              aria-label={`Status: ${statusLabels[user.status]}`}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56"
          side="right"
          sideOffset={8}
        >
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onViewProfile}>
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sidebar-accent transition-colors text-left",
            className
          )}
          aria-label={`User menu for ${user.name}`}
        >
          <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar",
                statusColors[user.status]
              )}
              aria-label={`Status: ${statusLabels[user.status]}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {statusLabels[user.status]}
            </p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-sidebar-foreground/50" />
          </motion.div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        side="top"
        sideOffset={8}
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {user.role && (
            <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewProfile}>
          <User className="w-4 h-4 mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
