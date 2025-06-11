/**
 * Session Management Information Component
 * Displays detailed session information and controls
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Shield, 
  RefreshCw, 
  LogOut, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Timer
} from 'lucide-react';
import { useSessionContext } from '@/providers/SessionProvider';
import { authService } from '@/services/authService';

export default function SessionInfo() {
  try {
    const { sessionState, extendSession, logout, formatTimeRemaining } = useSessionContext();
    
    if (!sessionState.isActive) {
      return (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              Session Information
            </CardTitle>
            <CardDescription>
              No active session found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Please log in to view session information.
            </p>
          </CardContent>
        </Card>
      );
    }

    const timeLeft = sessionState.timeRemaining;
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const isWarning = minutes <= 10;
    const isCritical = minutes <= 5;
    const isExpiringSoon = minutes <= 2;

    const getStatusColor = () => {
      if (isExpiringSoon) return 'text-red-600';
      if (isCritical) return 'text-orange-600';
      if (isWarning) return 'text-yellow-600';
      return 'text-green-600';
    };

    const getStatusBg = () => {
      if (isExpiringSoon) return 'bg-red-50 border-red-200';
      if (isCritical) return 'bg-orange-50 border-orange-200';
      if (isWarning) return 'bg-yellow-50 border-yellow-200';
      return 'bg-green-50 border-green-200';
    };

    const getStatusIcon = () => {
      if (isExpiringSoon) return <AlertTriangle className="h-5 w-5 text-red-600" />;
      if (isCritical) return <Timer className="h-5 w-5 text-orange-600" />;
      if (isWarning) return <Clock className="h-5 w-5 text-yellow-600" />;
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    };

    const getBadgeVariant = () => {
      if (isExpiringSoon || isCritical) return 'destructive';
      if (isWarning) return 'default';
      return 'secondary';
    };

    const userData = authService.getUserData();

    return (
      <Card className={`w-full max-w-md border-2 ${getStatusBg()}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              Session Information
            </div>
            <Badge variant={getBadgeVariant()}>
              {formatTimeRemaining()}
            </Badge>
          </CardTitle>
          <CardDescription>
            Active session management and controls
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              User Information
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{userData?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userData?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {userData?.role || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Session Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session Status
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Remaining:</span>
                <Badge variant={getBadgeVariant()} className="font-mono">
                  {formatTimeRemaining()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {isExpiringSoon 
                    ? 'Expiring Very Soon' 
                    : isCritical 
                      ? 'Expiring Soon'
                      : isWarning 
                        ? 'Warning'
                        : 'Active'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Auto-refresh:</span>
                <span className="text-sm font-medium text-blue-600">Enabled</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Session Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Session Actions</h4>
            <div className="flex flex-col gap-2">
              <Button
                onClick={extendSession}
                variant="outline"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Extend Session
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout Now
              </Button>
            </div>
          </div>

          {/* Session Info */}
          {(isWarning || isCritical || isExpiringSoon) && (
            <>
              <Separator />
              <div className={`p-3 rounded-lg border ${getStatusBg()}`}>
                <p className="text-xs text-gray-700">
                  {isExpiringSoon ? (
                    <><strong>Critical:</strong> Your session will expire in less than 2 minutes. Please save your work and extend the session.</>
                  ) : isCritical ? (
                    <><strong>Warning:</strong> Your session will expire soon. Consider extending it to avoid losing unsaved work.</>
                  ) : (
                    <><strong>Notice:</strong> Your session will expire in {minutes} minutes. The system will attempt to refresh automatically.</>
                  )}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    // If not in session context, show error state
    return (
      <Card className="w-full max-w-md border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium">Session information unavailable</span>
          </div>
          <p className="text-xs text-red-600 mt-2">
            Unable to load session information. Please refresh the page.
          </p>
        </CardContent>
      </Card>
    );
  }
}
