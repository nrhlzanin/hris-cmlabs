'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { employeeService, Employee } from '@/services/employee';
import { formatJakartaDate } from '@/lib/timezone';

interface EmployeeDetailPageProps {
  params: {
    nik: string;
  };
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchEmployee();
  }, [params.nik]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getEmployee(params.nik);
      
      if (response.success) {
        setEmployee(response.data);
      } else {
        setError(response.message || 'Failed to fetch employee data');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Failed to fetch employee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    
    if (!confirm(`Are you sure you want to delete employee ${employee.full_name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await employeeService.deleteEmployee(employee.nik);
      
      if (response.success) {
        alert('Employee deleted successfully');
        router.push('/admin/employee/employee-database');
      } else {
        alert('Failed to delete employee: ' + response.message);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee. Please try again.');
    }
  };

  if (loading) {
    return (
      <AuthWrapper requireAdmin={true}>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading employee details...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthWrapper>
    );
  }

  if (error || !employee) {
    return (
      <AuthWrapper requireAdmin={true}>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</h1>
                <p className="text-gray-600 mb-6">{error || 'The employee you are looking for does not exist.'}</p>
                <Link href="/admin/employee/employee-database">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                    ← Back to Employee List
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthWrapper>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return formatJakartaDate(new Date(dateString), {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const calculateExperience = () => {
    try {
      const joinDate = new Date(employee.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.floor((diffDays % 365) / 30);
        return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
      }
    } catch {
      return 'N/A';
    }
  };

  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 py-10">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Employee Details</h1>
                <p className="text-gray-600 mt-1">Complete information about {employee.full_name}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link href="/admin/employee/employee-database">
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                    ← Back
                  </button>
                </Link>
                <Link href={`/admin/employee/edit-employee/${employee.nik}`}>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                    ✎ Edit
                  </button>
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  🗑 Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  {/* Avatar */}
                  <div className="text-center mb-6">
                    {employee.avatar_url ? (
                      <img 
                        src={employee.avatar_url} 
                        alt={employee.full_name}
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-blue-100">
                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">{employee.full_name}</h2>
                    <p className="text-blue-600 font-medium">{employee.position}</p>
                    <p className="text-gray-500">{employee.branch}</p>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">NIK</span>
                      <span className="font-mono font-bold">{employee.nik}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Age</span>
                      <span className="font-bold">{employee.age} years</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Gender</span>
                      <span className={`px-2 py-1 rounded-full text-white text-sm ${
                        employee.gender === 'Men' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {employee.gender}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Contract</span>
                      <span className={`px-2 py-1 rounded-full text-white text-sm ${
                        employee.contract_type === 'Permanent' ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {employee.contract_type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Grade</span>
                      <span className="font-bold">{employee.grade}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                      <p className="text-gray-800 font-medium">{employee.first_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                      <p className="text-gray-800 font-medium">{employee.last_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Place of Birth</label>
                      <p className="text-gray-800">{employee.place_of_birth}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                      <p className="text-gray-800">{formatDate(employee.date_of_birth)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Phone</label>
                      <p className="text-gray-800">{employee.mobile_phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Education</label>
                      <p className="text-gray-800">{employee.last_education}</p>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">💼</span>
                    Work Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Position</label>
                      <p className="text-gray-800 font-medium">{employee.position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Branch</label>
                      <p className="text-gray-800">{employee.branch}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Contract Type</label>
                      <p className="text-gray-800">{employee.contract_type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Grade</label>
                      <p className="text-gray-800">{employee.grade}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Join Date</label>
                      <p className="text-gray-800">{formatDate(employee.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Work Experience</label>
                      <p className="text-gray-800">{calculateExperience()}</p>
                    </div>
                  </div>
                </div>

                {/* Banking Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🏦</span>
                    Banking Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Bank</label>
                      <p className="text-gray-800 font-medium">{employee.bank}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
                      <p className="text-gray-800 font-mono">{employee.account_number}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Account Holder Name</label>
                      <p className="text-gray-800">{employee.acc_holder_name}</p>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">⚙️</span>
                    System Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                      <p className="text-gray-800">{formatDate(employee.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                      <p className="text-gray-800">{formatDate(employee.updated_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Letter Format</label>
                      <p className="text-gray-800">
                        {employee.letter_format ? employee.letter_format.name : 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">User Account</label>
                      <p className="text-gray-800">
                        {employee.user_account ? 
                          `${employee.user_account.email} (${employee.user_account.role})` : 
                          'No user account'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
