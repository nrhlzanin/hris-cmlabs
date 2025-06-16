'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { employeeService, Employee, EmployeeUpdateData } from '@/services/employee';

interface EmployeeEditPageProps {
  params: {
    nik: string;
  };
}

interface FormData {
  first_name: string;
  last_name: string;
  mobile_phone: string;
  gender: string;
  last_education: string;
  place_of_birth: string;
  date_of_birth: string;
  position: string;
  branch: string;
  contract_type: string;
  grade: string;
  bank: string;
  account_number: string;
  acc_holder_name: string;
  letter_id: string;
}

export default function EditEmployeePage({ params }: EmployeeEditPageProps) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    mobile_phone: '',
    gender: '',
    last_education: '',
    place_of_birth: '',
    date_of_birth: '',
    position: '',
    branch: '',
    contract_type: '',
    grade: '',
    bank: '',
    account_number: '',
    acc_holder_name: '',
    letter_id: ''
  });

  // Options sesuai dengan database enum
  const options = {
    genders: ['Men', 'Woman'],
    educations: ['SMA/SMK Sederajat', 'S1', 'S2'],
    contractTypes: ['Permanent', 'Contract'],
    banks: ['BCA', 'BNI', 'BRI', 'BSI', 'BTN', 'CMIB', 'Mandiri', 'Permata']
  };

  useEffect(() => {
    fetchEmployee();
  }, [params.nik]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployee(params.nik);
      
      if (response.success) {
        const emp = response.data;
        setEmployee(emp);
        setAvatarPreview(emp.avatar_url);
        
        // Populate form with existing data
        setFormData({
          first_name: emp.first_name,
          last_name: emp.last_name,
          mobile_phone: emp.mobile_phone,
          gender: emp.gender,
          last_education: emp.last_education,
          place_of_birth: emp.place_of_birth,
          date_of_birth: emp.date_of_birth,
          position: emp.position,
          branch: emp.branch,
          contract_type: emp.contract_type,
          grade: emp.grade,
          bank: emp.bank,
          account_number: emp.account_number,
          acc_holder_name: emp.acc_holder_name,
          letter_id: emp.letter_id?.toString() || ''
        });
      } else {
        alert('Employee not found');
        router.push('/admin/employee/employee-database');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Failed to fetch employee data');
      router.push('/admin/employee/employee-database');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: Record<string, string[]>) => ({ ...prev, [name]: [] }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData: EmployeeUpdateData = {};
      
      // Only include changed fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          updateData[key as keyof EmployeeUpdateData] = value;
        }
      });

      // Add avatar if changed
      if (avatar) {
        updateData.avatar = avatar;
      }

      const response = await employeeService.updateEmployee(params.nik, updateData);

      if (response.success) {
        alert('Employee updated successfully!');
        router.push(`/admin/employee/employee-detail/${params.nik}`);
      } else {
        if (response.data && typeof response.data === 'object' && 'errors' in response.data) {
          setErrors(response.data.errors as Record<string, string[]>);
        } else {
          alert(response.message || 'Failed to update employee');
        }
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthWrapper requireAdmin={true}>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading employee data...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthWrapper>
    );
  }

  if (!employee) {
    return (
      <AuthWrapper requireAdmin={true}>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Employee Not Found</h1>
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

  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Edit Employee</h2>
                <p className="text-gray-600 text-sm">Update information for {employee.full_name}</p>
              </div>
              <Link href={`/admin/employee/employee-detail/${params.nik}`}>
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                  ← Back to Details
                </button>
              </Link>
            </div>

            {/* Upload Foto */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-slate-700 rounded overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white">
                    {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                  </div>
                )}
              </div>
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
                + Change Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500">JPG, PNG (Max: 2MB)</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <Field
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter the First Name"
                  error={errors.first_name}
                  required
                />
                <Field
                  label="Mobile Number"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  placeholder="Enter the Mobile Number"
                  error={errors.mobile_phone}
                  required
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={options.genders}
                  placeholder="-Choose Gender-"
                  error={errors.gender}
                  required
                />
                <Field
                  label="Place of Birth"
                  name="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={handleChange}
                  placeholder="Enter the Place of Birth"
                  error={errors.place_of_birth}
                  required
                />
                <Field
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Enter the Position"
                  error={errors.position}
                  required
                />
                <SelectField
                  label="Contract Type"
                  name="contract_type"
                  value={formData.contract_type}
                  onChange={handleChange}
                  options={options.contractTypes}
                  placeholder="-Choose Type-"
                  error={errors.contract_type}
                  required
                />
                <SelectField
                  label="Bank"
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  options={options.banks}
                  placeholder="-Choose Bank-"
                  error={errors.bank}
                  required
                />
                <Field
                  label="Account Holder's Name"
                  name="acc_holder_name"
                  value={formData.acc_holder_name}
                  onChange={handleChange}
                  placeholder="Bank Account Holder Name"
                  error={errors.acc_holder_name}
                  required
                />
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <Field
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter the Last Name"
                  error={errors.last_name}
                  required
                />
                
                {/* NIK Field - Read Only */}
                <div>
                  <label className="block font-medium mb-1">
                    NIK <span className="text-gray-500">(Cannot be changed)</span>
                  </label>
                  <input
                    value={employee.nik}
                    readOnly
                    className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <SelectField
                  label="Last Education"
                  name="last_education"
                  value={formData.last_education}
                  onChange={handleChange}
                  options={options.educations}
                  placeholder="-Choose Education-"
                  error={errors.last_education}
                  required
                />
                
                <div>
                  <label className="block font-medium mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={`w-full border px-3 py-2 rounded ${errors.date_of_birth ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{Array.isArray(errors.date_of_birth) ? errors.date_of_birth[0] : errors.date_of_birth}</p>}
                </div>

                <Field
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Enter the Branch"
                  error={errors.branch}
                  required
                />
                
                <Field
                  label="Grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="Enter the Grade"
                  error={errors.grade}
                  required
                />
                
                <Field
                  label="Account Number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  placeholder="Enter the Account Number"
                  error={errors.account_number}
                  required
                />
                
                <Field
                  label="Letter ID (Optional)"
                  name="letter_id"
                  value={formData.letter_id}
                  onChange={handleChange}
                  placeholder="Enter Letter ID"
                  error={errors.letter_id}
                />
              </div>

              {/* Tombol */}
              <div className="col-span-2 flex justify-end space-x-3 pt-2">
                <Link href={`/admin/employee/employee-detail/${params.nik}`}>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}

// Komponen field input
interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string[] | string;
  required?: boolean;
}

function Field({ label, name, value, onChange, placeholder, error, required }: FieldProps) {
  return (
    <div>
      <label className="block font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border px-3 py-2 rounded ${error ? 'border-red-500' : ''}`}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  );
}

// Komponen field select
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  error?: string[] | string;
  required?: boolean;
}

function SelectField({ label, name, value, onChange, options, placeholder, error, required }: SelectFieldProps) {
  return (
    <div>
      <label className="block font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border px-3 py-2 rounded ${error ? 'border-red-500' : ''}`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  );
}
