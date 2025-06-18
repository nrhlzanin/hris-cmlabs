'use client';

import React from 'react';
import { formatJakartaDate } from '@/lib/timezone';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <section className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="text-sm text-gray-600 sm:text-right whitespace-nowrap">
          <p>{formatJakartaDate(new Date(), { weekday: "long", year: "numeric", month: "long", day: "numeric" })} (WIB)</p>
        </div>
      </div>

      {children && (
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
          {children}
        </div>
      )}
      
    </section>
  );
};

export default PageHeader;