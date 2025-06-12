'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { apiService } from '@/services/api';
import { getCurrentAttendanceTime, formatAttendanceTime } from '@/lib/timezone';

// Dynamic import untuk Leaflet (hanya di client side)
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-52 bg-gray-200 rounded flex items-center justify-center">Loading map...</div>
});

interface FormData {
  absent_type: string;
  start_date: string;
  end_date: string;
  supporting_evidence: File | null;
  latitude: number | null;
  longitude: number | null;
  address: string;
}

interface RealTimeData {
  currentTime: string;
  currentDate: string;
  timezone: string;
}

export default function AbsensiForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    absent_type: '',
    start_date: '',
    end_date: '',
    supporting_evidence: null,
    latitude: null,
    longitude: null,
    address: ''
  });

  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    currentTime: '',
    currentDate: '',
    timezone: 'WIB'
  });

  const [location, setLocation] = useState({
    lat: null as number | null,
    lng: null as number | null,
    address: "Getting location..."
  });

  const [locationError, setLocationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Update real-time clock every second
  useEffect(() => {
    const updateRealTime = () => {
      const attendanceTime = getCurrentAttendanceTime();
      setRealTimeData({
        currentTime: attendanceTime.time,
        currentDate: attendanceTime.date,
        timezone: attendanceTime.timezone
      });
    };

    // Update immediately
    updateRealTime();
    
    // Update every second
    const interval = setInterval(updateRealTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            
            const address = data.display_name || `${lat}, ${lng}`;
            
            setLocation({
              lat: lat,
              lng: lng,
              address: address
            });

            setFormData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              address: address
            }));
          } catch (error) {
            console.error("Error getting address:", error);
            const address = `${lat}, ${lng}`;
            setLocation({
              lat: lat,
              lng: lng,
              address: address
            });
            setFormData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              address: address
            }));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Please enable location access.");
          // Default to a fallback location
          const fallbackLat = -7.9797;
          const fallbackLng = 112.6304;
          const fallbackAddress = "Malang City, East Java (Default)";
          
          setLocation({
            lat: fallbackLat,
            lng: fallbackLng,
            address: fallbackAddress
          });
          setFormData(prev => ({
            ...prev,
            latitude: fallbackLat,
            longitude: fallbackLng,
            address: fallbackAddress
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      const fallbackLat = -7.9797;
      const fallbackLng = 112.6304;
      const fallbackAddress = "Malang City, East Java (Default)";
      
      setLocation({
        lat: fallbackLat,
        lng: fallbackLng,
        address: fallbackAddress
      });
      setFormData(prev => ({
        ...prev,
        latitude: fallbackLat,
        longitude: fallbackLng,
        address: fallbackAddress
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  const handleFileUpload = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG, PNG, and PDF files are allowed');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploadedFile(file);
    setFormData(prev => ({
      ...prev,
      supporting_evidence: file
    }));
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.absent_type) {
      setSubmitError('Please select an attendance type');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setSubmitError('Location is required');
      return;
    }

    setIsLoading(true);
      // Capture the exact time when submit is clicked
    const attendanceTime = getCurrentAttendanceTime();
    const capturedTime = `${attendanceTime.time} ${attendanceTime.timezone}`;
    
    try {
      // Prepare form data for API service
      const submitData = new FormData();
      submitData.append('latitude', formData.latitude.toString());
      submitData.append('longitude', formData.longitude.toString());
      submitData.append('address', formData.address);
      
      if (formData.supporting_evidence) {
        submitData.append('supporting_evidence', formData.supporting_evidence);
      }

      let result;
      
      // Use the appropriate API service method based on the selected type
      switch (formData.absent_type) {
        case 'clock_in':
          result = await apiService.checkClockIn(submitData);
          break;
        case 'clock_out':
          result = await apiService.checkClockOut(submitData);
          break;
        case 'break_start':
          result = await apiService.breakStart(submitData);
          break;
        case 'break_end':
          result = await apiService.breakEnd(submitData);
          break;
        default:
          throw new Error('Invalid attendance type selected');
      }

      if (result && result.success) {
        const attendanceType = formData.absent_type === 'clock_in' ? 'Clock In' : 
                             formData.absent_type === 'clock_out' ? 'Clock Out' :
                             formData.absent_type === 'break_start' ? 'Break Start' : 'Break End';
        
        alert(`✅ ${attendanceType} recorded successfully!\n🕐 Time captured: ${capturedTime}\n📍 Location: ${formData.address}`);
        router.push('/user/checklock');
      } else {
        setSubmitError(result?.message || 'Failed to record attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An error occurred while recording attendance');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="p-6 overflow-auto min-h-screen bg-gray-100">        <div className="bg-white p-6 rounded shadow-lg max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/user/checklock">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Attendance Records
            </button>
          </Link>
          <h2 className="text-2xl font-semibold">Add Attendance</h2>
        </div>

        {/* Real-Time Clock Display */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Automatic Time Capture</h3>
              <p className="text-sm opacity-90">Your attendance will be recorded with the current time automatically</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono">
                {realTimeData.currentTime} {realTimeData.timezone}
              </div>
              <div className="text-sm opacity-90">
                {realTimeData.currentDate}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Time will be automatically captured when you submit</span>
          </div>
        </div>
        
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Attendance Type *</label>
                <select 
                  name="absent_type"
                  value={formData.absent_type}
                  onChange={handleInputChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose Attendance Type</option>
                  <option value="clock_in">🕘 Clock In</option>
                  <option value="clock_out">🕔 Clock Out</option>
                  <option value="break_start">☕ Break Start</option>
                  <option value="break_end">🔄 Break End</option>
                </select>
                {formData.absent_type && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Selected:</span>
                      <span>{formData.absent_type === 'clock_in' ? 'Clock In' : 
                             formData.absent_type === 'clock_out' ? 'Clock Out' :
                             formData.absent_type === 'break_start' ? 'Break Start' : 'Break End'}</span>
                    </div>
                    <div className="text-gray-600 mt-1">
                      Time will be automatically recorded as: <span className="font-mono font-bold">{realTimeData.currentTime} {realTimeData.timezone}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Auto-filled Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Date (Auto-filled)</label>
                  <input 
                    type="date" 
                    name="start_date"
                    value={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically set to today</p>
                </div>
                <div>
                  <label className="block text-sm font-medium">Time (Auto-captured)</label>
                  <input 
                    type="text"
                    value={`${realTimeData.currentTime} ${realTimeData.timezone}`}
                    className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 font-mono"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Live time - will be captured on submit</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Supporting Evidence</label>
                <div 
                  className={`border-2 border-dashed p-4 rounded text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 text-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <p>Drag and Drop Here</p>
                  <p className="my-2">Or</p>
                  <label className="text-blue-600 underline cursor-pointer">
                    Browse
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                  {uploadedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Location</label>
                <div className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 text-gray-600">
                  Current Location (Auto-detected)
                </div>
              </div>

              {locationError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {locationError}
                  <button 
                    type="button"
                    onClick={getCurrentLocation}
                    className="ml-2 text-sm underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div className="rounded overflow-hidden shadow">
                {location.lat && location.lng ? (
                  <MapComponent 
                    lat={location.lat} 
                    lng={location.lng} 
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Getting your location...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Detail Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Lat</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                      value={location.lat || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Long</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                      value={location.lng || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Footer buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Link href="/user/checklock">
              <button 
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button 
              type="submit"
              disabled={!location.lat || !location.lng || isLoading || !formData.absent_type}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Recording...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Record Attendance at {realTimeData.currentTime}
                </>
              )}
            </button>
          </div></form>
      </div>
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}