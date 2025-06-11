'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { apiService } from '@/services/api';

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
  };const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!formData.absent_type) {
      setSubmitError('Please select an absent type');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setSubmitError('Location is required');
      return;
    }

    setIsLoading(true);
    
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
          throw new Error('Invalid absent type selected');
      }

      if (result && result.success) {
        alert(result.message || 'Attendance recorded successfully!');
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
        <div className="p-6 overflow-auto min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Add Attendance</h2>
        
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Absent Type *</label>
                <select 
                  name="absent_type"
                  value={formData.absent_type}
                  onChange={handleInputChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose Absent Type</option>
                  <option value="clock_in">Clock In</option>
                  <option value="clock_out">Clock Out</option>
                  <option value="break_start">Break Start</option>
                  <option value="break_end">Break End</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <input 
                    type="date" 
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input 
                    type="date" 
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
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
          </div>

          {/* Footer buttons */}
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
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>        </form>
      </div>
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}