/**
 * Session Status Component
 * Displays session information and provides quick actions
 */

'use client';

import React from 'react';
import { Clock, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSessionContext } from '@/providers/SessionProvider';

interface SessionStatusProps {
  showTimeRemaining?: boolean;
  showExtendButton?: boolean;
  showLogoutButton?: boolean;
  variant?: 'compact' | 'full';
}

export default function SessionStatus({
  showTimeRemaining = true,
  showExtendButton = true,
  showLogoutButton = false,
  variant = 'compact',
}: SessionStatusProps) {
  const { sessionState, extendSession, logout, formatTimeRemaining } = useSessionContext();

  if (!sessionState.isActive) {
    return null;
  }

  const timeLeft = sessionState.timeRemaining;
  const minutes = Math.floor(timeLeft / (1000 * 60));
  const isWarning = minutes <= 10;
  const isUrgent = minutes <= 5;

  const getBadgeVariant = () => {
    if (isUrgent) return 'destructive';
    if (isWarning) return 'secondary';
    return 'outline';
  };

  const getStatusColor = () => {
    if (isUrgent) return 'text-red-600';
    if (isWarning) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {showTimeRemaining && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={getBadgeVariant()} className="cursor-help">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimeRemaining()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sesi akan berakhir dalam {formatTimeRemaining()}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {showExtendButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={extendSession}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Perpanjang sesi</p>
              </TooltipContent>
            </Tooltip>
          )}

          {showLogoutButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Clock className={`h-4 w-4 ${getStatusColor()}`} />
        <div className="text-sm">
          <div className="font-medium">Status Sesi</div>
          {showTimeRemaining && (
            <div className={`text-xs ${getStatusColor()}`}>
              Berakhir dalam: {formatTimeRemaining()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {showExtendButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={extendSession}
            className="text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Perpanjang
          </Button>
        )}

        {showLogoutButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}
