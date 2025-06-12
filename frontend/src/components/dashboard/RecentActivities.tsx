import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, RecentActivity } from '@/services/dashboard';
import { Clock, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function RecentActivities() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentActivities();
    // Update every minute for real-time feel
    const interval = setInterval(fetchRecentActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivities = async () => {
    try {
      setError(null);
      const data = await dashboardService.getRecentActivities(8);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activities');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (action: string, status: string) => {
    switch (action.toLowerCase()) {
      case 'check_in':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'check_out':
        return <XCircle className="w-4 h-4 text-blue-600" />;
      case 'late_arrival':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'early_departure':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (action: string, status: string) => {
    switch (action.toLowerCase()) {
      case 'check_in':
        return 'border-l-green-500 bg-green-50';
      case 'check_out':
        return 'border-l-blue-500 bg-blue-50';
      case 'late_arrival':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'early_departure':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const getTimeAgo = (timeString: string) => {
    try {
      const now = new Date();
      const activityTime = new Date(timeString);
      const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes === 1) return '1 minute ago';
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      
      const hours = Math.floor(diffInMinutes / 60);
      if (hours === 1) return '1 hour ago';
      if (hours < 24) return `${hours} hours ago`;
      
      const days = Math.floor(hours / 24);
      if (days === 1) return '1 day ago';
      return `${days} days ago`;
    } catch {
      return formatTime(timeString);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-3 border-l-4 border-gray-300 bg-gray-50 rounded">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
          <button 
            onClick={fetchRecentActivities}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activities
        </CardTitle>
        <div className="text-xs text-gray-500">
          Auto-updating
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center space-x-3 p-3 border-l-4 rounded transition-colors hover:bg-gray-50 ${getActivityColor(activity.action, activity.status)}`}
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.action, activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {activity.employee_name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {activity.action.replace('_', ' ')} • {activity.status}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs text-gray-500">
                    {formatTime(activity.time)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getTimeAgo(activity.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activities.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={fetchRecentActivities}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh activities
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
