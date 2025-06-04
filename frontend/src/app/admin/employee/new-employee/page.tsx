'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AddEmployeeForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    nik: '',
    gender: '',
    lastEducation: '',
    placeOfBirth: '',
    dateOfBirth: '',
    position: '',
    branch: '',
    contractType: '',
    grade: '',
    bank: '',
    accountNumber: '',
    accountHolderName: '',
    warningLetterType: ''
  });

  const options = {
    genders: ['Male', 'Female'],
    educations: ['High School', 'Diploma', 'Bachelor', 'Master'],
    contractTypes: ['Full-time', 'Part-time', 'Contract'],
    banks: ['BCA', 'BNI', 'BRI', 'Mandiri'],
    warningLetters: ['None', 'SP1', 'SP2', 'SP3']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // kirim ke backend
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl">
        <h2 className="text-lg font-semibold mb-6">Add New Employee</h2>
        
        {/* Upload Foto */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-slate-700 rounded" />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            + Upload Foto
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <Field label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter the First Name" />
            <Field label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter the Mobile Number" />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={options.genders} placeholder="-Choose Gender-" />
            <Field label="Place of Birth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} placeholder="Enter the Place of Birth" />
            <Field label="Position" name="position" value={formData.position} onChange={handleChange} placeholder="Enter the Position" />
            <SelectField label="Contract Type" name="contractType" value={formData.contractType} onChange={handleChange} options={options.contractTypes} placeholder="-Choose Type-" />
            <SelectField label="Bank" name="bank" value={formData.bank} onChange={handleChange} options={options.banks} placeholder="-Choose Bank-" />
            <Field label="Account Holder’s Name" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="Bank Number Account Holder Name" />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <Field label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter the Last Name" />
            <Field label="NIK" name="nik" value={formData.nik} onChange={handleChange} placeholder="Enter the NIK" />
            <SelectField label="Last Education" name="lastEducation" value={formData.lastEducation} onChange={handleChange} options={options.educations} placeholder="-Choose Education-" />
            <div>
              <label className="block font-medium mb-1">Date of Birth</label>
              <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <Field label="Branch" name="branch" value={formData.branch} onChange={handleChange} placeholder="Enter the Branch" />
            <Field label="Grade" name="grade" value={formData.grade} onChange={handleChange} placeholder="Enter the Grade" />
            <Field label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter the Account Number" />
            <SelectField label="Warning Letter Type" name="warningLetterType" value={formData.warningLetterType} onChange={handleChange} options={options.warningLetters} placeholder="-Choose Type-" />
          </div>

          {/* Tombol */}
          <div className="col-span-2 flex justify-end space-x-3 pt-2">
            <Link href="/employee-database">
              <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </Link>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen field input
function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full border px-3 py-2 rounded" />
    </div>
  );
}

// Komponen field select
function SelectField({ label, name, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full border px-3 py-2 rounded">
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
