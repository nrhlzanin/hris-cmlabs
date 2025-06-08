'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  first_name: string;
  last_name: string;
  mobile_phone: string;
  nik: string;
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

export default function AddEmployeeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    mobile_phone: '',
    nik: '',
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

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Options sesuai dengan database enum
  const options = {
    genders: ['Men', 'Woman'],
    educations: ['SMA/SMK Sederajat', 'S1', 'S2'],
    contractTypes: ['Permanent', 'Contract'],
    banks: ['BCA', 'BNI', 'BRI', 'BSI', 'BTN', 'CMIB', 'Mandiri', 'Permata']
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for NIK - only allow numbers and max 16 digits
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      if (numericValue.length <= 16) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
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
    setIsLoading(true);
    setErrors({});

    // Validate NIK length
    if (formData.nik.length !== 16) {
      setErrors({ nik: ['NIK must be exactly 16 digits'] });
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Append avatar if selected
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      // Get token from localStorage or wherever you store it
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        alert('You are not authenticated. Please login again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Employee created successfully!');
        router.push('/admin/employee/employee-database');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || 'Failed to create employee');
        }
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl">
        <h2 className="text-lg font-semibold mb-6">Add New Employee</h2>
        
        {/* Upload Foto */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-slate-700 rounded overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-700" />
            )}
          </div>
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
            + Upload Foto
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
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
            {/* NIK Field with special handling */}
            <div>
              <label className="block font-medium mb-1">
                NIK <span className="text-red-500">*</span>
              </label>
              <input 
                name="nik" 
                value={formData.nik} 
                onChange={handleChange} 
                placeholder="Enter 16-digit NIK"
                className={`w-full border px-3 py-2 rounded ${errors.nik ? 'border-red-500' : ''}`}
                maxLength={16}
                pattern="[0-9]{16}"
                title="NIK must be exactly 16 digits"
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.nik.length}/16 digits
              </div>
              {errors.nik && <p className="text-red-500 text-sm mt-1">{Array.isArray(errors.nik) ? errors.nik[0] : errors.nik}</p>}
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
            <Link href="/admin/employee/employee-database">
              <button 
                type="button" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
            </Link>
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
