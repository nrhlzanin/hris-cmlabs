'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getJakartaDateString } from '@/lib/timezone';
import AuthWrapper from "@/components/auth/AuthWrapper";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface FormData {
  employeeId: string;
  absentType: string;
  startDate: string;
  endDate: string;
  location: string;
  detailAddress: string;
  latitude: string;
  longitude: string;
  evidence: File | null;
}

export default function AddChecklock() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    employeeId: '',
    absentType: 'absent',
    startDate: '',
    endDate: '',
    location: '',
    detailAddress: 'Malang City, East Java',
    latitude: '',
    longitude: '',
    evidence: null
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    const today = getJakartaDateString();
    setFormData(prev => ({
      ...prev,
      startDate: today,
      endDate: today
    }));
    fetchEmployees();
    getCurrentLocation();
  }, []);

  const fetchEmployees = async () => {
    try {
      const mockEmployees: Employee[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Michael Johnson', email: 'michael@example.com' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com' }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
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
      });
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, evidence: 'File must be smaller than 5MB' }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        evidence: file
      }));
      setErrors(prev => ({ ...prev, evidence: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate > formData.endDate)
      newErrors.endDate = 'End date must be after start date';

    if (!formData.latitude) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude) newErrors.longitude = 'Longitude is required';

    if (formData.evidence && formData.evidence.size > 5 * 1024 * 1024) {
      newErrors.evidence = 'Evidence file must be smaller than 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('employee_id', formData.employeeId);
      formDataToSend.append('absent_type', formData.absentType);
      formDataToSend.append('start_date', formData.startDate);
      formDataToSend.append('end_date', formData.endDate);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('detail_address', formData.detailAddress);
      formDataToSend.append('latitude', parseFloat(formData.latitude).toString());
      formDataToSend.append('longitude', parseFloat(formData.longitude).toString());

      if (formData.evidence) {
        formDataToSend.append('evidence', formData.evidence);
      }

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('Attendance record added successfully!');
      router.push('/admin/checklock');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding attendance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/checklock');
  };

  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-background">
          <div className="p-6">
            <div className="bg-white rounded shadow p-6 max-w-5xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Add Attendance Record</h2>
              <p className="text-sm text-gray-600 mb-6">All times are in Jakarta timezone (WIB)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT */}
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
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Absent Type</label>
                    <select
                      value={formData.absentType}
                      onChange={(e) => handleInputChange('absentType', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="clock_in">Clock In</option>
                      <option value="clock_out">Clock Out</option>
                      <option value="absent">Absent</option>
                      <option value="annual_leave">Annual Leave</option>
                      <option value="sick_leave">Sick Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date (WIB) *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className={`w-full border rounded px-3 py-2 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date (WIB) *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`w-full border rounded px-3 py-2 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Supporting Evidence</label>
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center text-gray-500">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                        className="hidden"
                        id="evidence-upload"
                      />
                      <label htmlFor="evidence-upload" className="cursor-pointer">
                        <p>Drag and Drop Here</p>
                        <p className="my-2">Or</p>
                        <span className="text-blue-600 underline">Browse</span>
                      </label>
                      {formData.evidence && (
                        <div className="mt-2 text-sm text-green-600">
                          <p>Selected: {formData.evidence.name}</p>
                          {formData.evidence.type.startsWith('image/') && (
                            <img src={URL.createObjectURL(formData.evidence)} alt="Preview" className="mt-2 w-32 rounded shadow" />
                          )}
                        </div>
                      )}
                      {errors.evidence && <p className="text-red-500 text-xs mt-1">{errors.evidence}</p>}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Choose Location</option>
                      <option value="office">Office</option>
                      <option value="home">Work from Home</option>
                      <option value="client_site">Client Site</option>
                    </select>
                  </div>

                  <div className="rounded overflow-hidden shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Malang_Satellite_Image.png"
                      alt="Map"
                      className="w-full h-52 object-cover"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Detail Address</label>
                    <input
                      type="text"
                      value={formData.detailAddress}
                      onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Latitude</label>
                      <input
                        type="text"
                        placeholder="Lat lokasi"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        className={`w-full border rounded px-3 py-2 ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Longitude</label>
                      <input
                        type="text"
                        placeholder="Long lokasi"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        className={`w-full border rounded px-3 py-2 ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                    </div>
                  </div>
                </div>
              </div>

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
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
