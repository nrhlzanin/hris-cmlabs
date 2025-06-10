import React from 'react';

export interface Employee {
  id: number;
  name: string;
  position: string;
  branch: string;
  grade: string;
  status: 'Waiting Payment' | 'Approved' | 'Decline' | 'Waiting Approval';
}

export interface Detail {
  no: number;
  date: string;
  action: React.ReactNode | null;
  detail: string;
}
