/**
 * Session Management Demo Page
 * For testing and demonstrating session management features
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SessionInfo from '@/components/session/SessionInfo';
import SessionStatus from '@/components/session/SessionStatus';
import { Clock, TestTube, Activity, Shield } from 'lucide-react';
import { useSessionContext } from '@/providers/SessionProvider';
import { authService } from '@/services/authService';

export default function SessionDemoPage() {
  const [testResults, setTestResults] = React.useState<string[]>([]);
  
  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testTokenRefresh = async () => {
    try {
      addTestResult('Testing token refresh...');
      const response = await authService.refreshToken();
      if (response.success) {
        addTestResult('✅ Token refresh successful');
      } else {
        addTestResult('❌ Token refresh failed');
      }
    } catch (error) {
      addTestResult(`❌ Token refresh error: ${error}`);
    }
  };

  const testApiCall = async () => {
    try {
      addTestResult('Testing API call...');
      const response = await authService.getProfile();
      if (response.success) {
        addTestResult('✅ API call successful');
      } else {
        addTestResult('❌ API call failed');
      }
    } catch (error) {
      addTestResult(`❌ API call error: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  try {
    const { sessionState, extendSession, logout } = useSessionContext();
    
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <TestTube className="h-8 w-8" />
            Session Management Demo
          </h1>
          <p className="text-gray-600">
            Test and monitor the session management system with 1-hour timeout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Session Information
            </h2>
            <SessionInfo />
          </div>

          {/* Session Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Session Status
            </h2>
            <SessionStatus 
              variant="full"
              showTimeRemaining={true}
              showExtendButton={true}
              showLogoutButton={true}
            />
          </div>
        </div>

        {/* Testing Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Session Testing
            </CardTitle>
            <CardDescription>
              Test various session management features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={testTokenRefresh} variant="outline">
                Test Token Refresh
              </Button>
              <Button onClick={testApiCall} variant="outline">
                Test API Call
              </Button>
              <Button onClick={extendSession} variant="outline">
                Extend Session
              </Button>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
              <Button onClick={clearResults} variant="ghost">
                Clear Results
              </Button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Test Results:</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-1 text-sm font-mono">
                    {testResults.map((result, index) => (
                      <div key={index} className="text-gray-700">
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Session Settings:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Timeout:</span>
                    <Badge variant="outline">1 hour</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning:</span>
                    <Badge variant="outline">5 minutes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-refresh:</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Activity tracking:</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Current Status:</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Session Active:</span>
                    <Badge variant={sessionState.isActive ? "default" : "destructive"}>
                      {sessionState.isActive ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning Shown:</span>
                    <Badge variant={sessionState.showWarning ? "default" : "secondary"}>
                      {sessionState.showWarning ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>User:</span>
                    <Badge variant="outline">
                      {authService.getUserData()?.name || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h1 className="text-xl font-semibold text-red-800">Session Demo Unavailable</h1>
              <p className="text-red-600">
                Session management is not available on this page. Please log in first.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
