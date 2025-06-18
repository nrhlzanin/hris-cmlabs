import { Users, CheckCircle, Clock, FileText, TrendingUp, AlertCircle } from "lucide-react";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Employees */}
      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[160px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">156</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2">
          <TrendingUp className="h-3 w-3 inline mr-1" />
          +2.5% from last month
        </p>
      </div>

      {/* Present Today */}
      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[160px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Present Today</p>
            <p className="text-2xl font-bold text-gray-900">142</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">91.0% attendance rate</p>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[160px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Requests</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-lg">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <p className="text-xs text-orange-600 mt-2">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          Requires attention
        </p>
      </div>

      {/* Total Letters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[160px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Letters This Month</p>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">15 approved, 8 pending</p>
      </div>
    </div>
  );
}