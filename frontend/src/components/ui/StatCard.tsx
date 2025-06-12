import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  className?: string;
  isLoading?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
}

const colorVariants = {
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  green: 'text-green-600 bg-green-50 border-green-200',
  red: 'text-red-600 bg-red-50 border-red-200',
  yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200',
  indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  isLoading = false,
  color = 'blue'
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-300 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      colorVariants[color],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            'h-4 w-4',
            color === 'blue' && 'text-blue-600',
            color === 'green' && 'text-green-600',
            color === 'red' && 'text-red-600',
            color === 'yellow' && 'text-yellow-600',
            color === 'purple' && 'text-purple-600',
            color === 'indigo' && 'text-indigo-600'
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(description || trend) && (
          <div className="flex items-center justify-between">
            {description && (
              <p className="text-xs text-gray-500">
                {description}
              </p>
            )}
            {trend && (
              <div className={cn(
                'text-xs font-medium flex items-center',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                <span className={cn(
                  'inline-block w-0 h-0 mr-1',
                  trend.isPositive 
                    ? 'border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-green-600'
                    : 'border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-red-600'
                )}>
                </span>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
