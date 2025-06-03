'use client';
import { useState } from 'react';

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
    // submit to backend
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Photo and Upload */}
        <div className="col-span-2 flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-700 rounded" />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            + Upload Foto
          </button>
        </div>

        {/* First Column */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter the First Name"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Mobile Number</label>
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter the Mobile Number"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-Choose Gender-</option>
              {options.genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Place of Birth</label>
            <input
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              placeholder="Enter the Place of Birth"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Position</label>
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter the Position"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Contract Type</label>
            <select
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-Choose Type-</option>
              {options.contractTypes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Bank</label>
            <select
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-Choose Bank-</option>
              {options.banks.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Account Holder’s Name</label>
            <input
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Bank Number Account Holder Name"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter the Last Name"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">NIK</label>
            <input
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="Enter the NIK"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Last Education</label>
            <select
              name="lastEducation"
              value={formData.lastEducation}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-Choose Education-</option>
              {options.educations.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Branch</label>
            <input
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Enter the Branch"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Grade</label>
            <input
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="Enter the Grade"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Account Number</label>
            <input
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter the Account Number"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Warning Letter Type</label>
            <select
              name="warningLetterType"
              value={formData.warningLetterType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-Choose Type-</option>
              {options.warningLetters.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-2 flex justify-end space-x-4 mt-2">
          <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
