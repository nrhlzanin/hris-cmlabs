import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function AttendanceOverview() {
  return (
    <div className="bg-white rounded-lg shadow-sm border min-h-[200px]">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Attendance Overview</h3>
      </div>
      <div className="p-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <div className="text-center p-4 flex flex-col justify-center items-center rounded-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">142</h4>
            <p className="text-sm text-gray-600">Present</p>
          </div>

          <div className="text-center p-4 flex flex-col justify-center items-center rounded-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">14</h4>
            <p className="text-sm text-gray-600">Absent</p>
          </div>

          <div className="text-center p-4 flex flex-col justify-center items-center rounded-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">7</h4>
            <p className="text-sm text-gray-600">Late</p>
          </div>
        </div>
      </div>
    </div>
  );
}