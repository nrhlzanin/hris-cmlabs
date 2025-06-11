import React from 'react';

export default function SalaryDetail() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Detail Salary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Gaji Pokok</span><span>Rp 3.500.000</span></div>
        <div className="flex justify-between"><span>Insentif</span><span>Rp 2.500.000</span></div>
        <div className="flex justify-between"><span>Overtime</span><span>Rp 1.500.000</span></div>
        <div className="flex justify-between"><span>Komisi</span><span>Rp 1.500.000</span></div>
        <div className="flex justify-between font-bold"><span>Total</span><span>Rp 10.000.000</span></div>
      </div>
    </div>
  );
}