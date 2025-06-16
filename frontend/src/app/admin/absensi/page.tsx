'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getJakartaDateString } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { attendanceService } from '@/services/attendance';

interface Employee {
  nik: string;
  first_name: string;
  last_name: string;
  full_name: string;
  position: string;
  branch: string;
}

interface FormData {
  employeeId: string;
  checkClockType: 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
  checkClockTime: string;
  location: string;
  detailAddress: string;
  latitude: string;
  longitude: string;
  adminNotes: string;
}

export default function ManualChecklock() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    employeeId: '',
    checkClockType: 'clock_in',
    checkClockTime: '',
    location: 'Malang Office',
    detailAddress: 'Malang City, East Java',
    latitude: '',
    longitude: '',
    adminNotes: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    // Set current time in Jakarta timezone
    const now = new Date();
    const jakartaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
    const timeString = jakartaTime.toISOString().slice(0, 16); // Format for datetime-local input
    
    setFormData(prev => ({
      ...prev,
      checkClockTime: timeString
    }));
    
    fetchEmployees();
    getCurrentLocation();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        alert('You are not authenticated. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/employees?per_page=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.data) {
          setEmployees(result.data.data);
        }
      } else {
        console.error('Failed to fetch employees');
        alert('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Error fetching employees');
    } finally {
      setLoadingEmployees(false);
    }
  };
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
      }, (error) => {
        console.error('Error getting location:', error);
        // Set default Malang coordinates if geolocation fails
        setFormData(prev => ({
          ...prev,
          latitude: '-7.9797',
          longitude: '112.6304'
        }));
      });
    } else {
      // Set default Malang coordinates if geolocation is not supported
      setFormData(prev => ({
        ...prev,
        latitude: '-7.9797',
        longitude: '112.6304'
      }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.checkClockTime) newErrors.checkClockTime = 'Check clock time is required';
    if (!formData.latitude) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude) newErrors.longitude = 'Longitude is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert datetime-local format to ISO string
      const checkClockTime = new Date(formData.checkClockTime).toISOString();
      
      const manualCheckInData = {
        user_id: parseInt(formData.employeeId),
        check_clock_type: formData.checkClockType,
        check_clock_time: checkClockTime,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.detailAddress,
        admin_notes: formData.adminNotes || undefined
      };

      await attendanceService.manualCheckIn(manualCheckInData);

      alert('Manual check-in recorded successfully!');
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        employeeId: '',
        adminNotes: ''
      }));
      
      // Optionally redirect back to attendance overview
      router.push('/admin/checklock');
    } catch (error) {
      console.error('Error submitting manual check-in:', error);
      alert(`Failed to record manual check-in: ${error instanceof Error ? error.message : 'Unknown error'}`);    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/checklock');
  };

  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
          <div className="w-full max-w-4xl mx-auto bg-white rounded shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Manual Check-In</h2>
            <p className="text-sm text-gray-600 mb-6">Record attendance for employees manually. All times are in Jakarta timezone (WIB)</p>
            
            {loadingEmployees && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading employees...</span>
              </div>
            )}

            {!loadingEmployees && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Employee *</label>
                    <select
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      className={`w-full border rounded px-3 py-2 ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Choose Employee</option>
                      {employees.map(emp => (
                        <option key={emp.nik} value={emp.nik}>
                          {emp.full_name} - {emp.position}
                        </option>
                      ))}
                    </select>
                    {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Check Clock Type *</label>
                    <select
                      value={formData.checkClockType}
                      onChange={(e) => handleInputChange('checkClockType', e.target.value as 'clock_in' | 'clock_out' | 'break_start' | 'break_end')}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="clock_in">Clock In</option>
                      <option value="clock_out">Clock Out</option>
                      <option value="break_start">Break Start</option>
                      <option value="break_end">Break End</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Check Clock Time (WIB) *</label>
                    <input
                      type="datetime-local"
                      value={formData.checkClockTime}
                      onChange={(e) => handleInputChange('checkClockTime', e.target.value)}
                      className={`w-full border rounded px-3 py-2 ${errors.checkClockTime ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.checkClockTime && <p className="text-red-500 text-xs mt-1">{errors.checkClockTime}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Admin Notes</label>
                    <textarea
                      value={formData.adminNotes}
                      onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                      placeholder="Optional notes about this manual check-in..."
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="e.g., Main Office, Client Site"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Detail Address</label>
                    <input
                      type="text"
                      value={formData.detailAddress}
                      onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Full address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Latitude *</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g., -7.9797"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        className={`w-full border rounded px-3 py-2 ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Longitude *</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g., 112.6304"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        className={`w-full border rounded px-3 py-2 ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600 mb-2">Location Info:</p>
                    <p className="text-xs text-gray-500">
                      Current coordinates: {formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : 'Not set'}
                    </p>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Get Current Location
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || loadingEmployees}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Recording...' : 'Record Check-In'}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
