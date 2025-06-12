# 📚 Employee CRUD System Documentation

## 🎯 Overview

The Employee CRUD (Create, Read, Update, Delete) system is a comprehensive employee management solution built with Laravel 11 backend and Next.js 14 frontend. This system provides full employee lifecycle management with advanced features like bulk operations, import/export, and sophisticated search capabilities.

## 🏗️ System Architecture

```
Frontend (Next.js 14)     Backend (Laravel 11)     Database (MySQL)
├── Pages                 ├── Controllers           ├── employees
│   ├── Database List     │   └── EmployeeController├── users
│   ├── Create Form       ├── Models                ├── letter_formats
│   ├── Detail View       │   └── Employee          └── migrations
│   └── Edit Form         ├── Services              
├── Components            │   └── AuthService       
│   ├── Forms             ├── Middleware            
│   ├── Tables            │   └── AdminMiddleware   
│   └── Layouts           └── Routes                
└── Services                  └── api.php           
    └── employeeService
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PHP 8.2+
- Composer
- MySQL 8.0+
- Laravel 11
- Next.js 14

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=AdminSeeder
php artisan serve --host=0.0.0.0 --port=8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 File Structure

### Backend Files
```
backend/
├── app/
│   ├── Http/Controllers/
│   │   └── EmployeeController.php      # Main CRUD controller
│   ├── Models/
│   │   └── Employee.php                # Employee model
│   ├── Services/
│   │   └── AuthService.php             # Authentication service
│   └── Middleware/
│       └── AdminMiddleware.php         # Authorization middleware
├── database/
│   ├── migrations/
│   │   └── *_create_employees_table.php
│   └── seeders/
│       └── AdminSeeder.php
└── routes/
    └── api.php                         # API routes
```

### Frontend Files
```
frontend/
├── src/
│   ├── app/admin/employee/
│   │   ├── employee-database/
│   │   │   └── page.tsx               # Employee list page
│   │   ├── new-employee/
│   │   │   └── page.tsx               # Create employee form
│   │   ├── employee-detail/[nik]/
│   │   │   └── page.tsx               # Employee detail view
│   │   └── edit-employee/[nik]/
│   │       └── page.tsx               # Edit employee form
│   ├── services/
│   │   └── employee.ts                # Employee API service
│   └── components/
│       ├── layout/
│       │   └── DashboardLayout.tsx
│       └── auth/
│           └── AuthWrapper.tsx
```

## 🚀 Usage Guide

### 1. Employee List Management

**URL:** `/admin/employee/employee-database`

**Features:**
- Paginated employee listing
- Advanced search and filters
- Bulk selection and operations
- Export functionality
- Statistics dashboard

**Search & Filters:**
- **Global Search:** Search across name, NIK, phone, position, branch
- **Gender Filter:** Men/Woman
- **Branch Filter:** All available branches
- **Position Filter:** All positions
- **Contract Type:** Permanent/Contract
- **Education Level:** SMA/SMK Sederajat, S1, S2
- **Bank Filter:** BCA, BNI, BRI, BSI, BTN, CMIB, Mandiri, Permata
- **Grade Filter:** Available grades
- **Age Range:** Min/Max age filter

### 2. Creating New Employee

**URL:** `/admin/employee/new-employee`

**Required Fields:**
```typescript
{
  nik: string;              // 16-digit unique identifier
  first_name: string;       // Employee first name
  last_name: string;        // Employee last name
  mobile_phone: string;     // Phone number with country code
  gender: 'Men' | 'Woman';  // Gender selection
  last_education: string;   // Education level
  place_of_birth: string;   // Birth place
  date_of_birth: string;    // Birth date (YYYY-MM-DD)
  position: string;         // Job position
  branch: string;           // Work branch
  contract_type: string;    // Contract type
  grade: string;            // Employee grade
  bank: string;             // Bank name
  account_number: string;   // Bank account number
  acc_holder_name: string;  // Account holder name
  letter_id?: number;       // Optional letter format ID
  avatar?: File;            // Optional profile picture
}
```

**Validation Rules:**
- NIK: Must be exactly 16 digits and unique
- Date of birth: Must be in the past
- Mobile phone: Valid phone number format
- All enum fields: Must match predefined values

### 3. Viewing Employee Details

**URL:** `/admin/employee/employee-detail/[nik]`

**Information Displayed:**
- Personal information (name, NIK, gender, age)
- Contact details (phone, address)
- Employment details (position, branch, contract type, grade)
- Financial information (bank details)
- Profile avatar
- Work experience calculation
- Associated letter formats

### 4. Editing Employee Information

**URL:** `/admin/employee/edit-employee/[nik]`

**Features:**
- Pre-populated form with current data
- All fields editable except NIK
- Avatar upload with preview
- Real-time validation
- Change tracking

## 🔒 Authentication & Authorization

### User Roles

1. **Super Admin**
   - Full CRUD access
   - Can delete employees
   - Can perform bulk operations
   - System administration

2. **Admin**
   - Create, read, update employees
   - Cannot delete employees
   - Can export data
   - Can import employees

3. **Regular User**
   - No employee management access
   - View own profile only

### API Authentication

All API requests require Bearer token authentication:

```typescript
headers: {
  'Authorization': `Bearer ${authToken}`,
  'Accept': 'application/json'
}
```

## 📊 API Endpoints

### Employee CRUD Operations

| Method | Endpoint | Description | Auth Level |
|--------|----------|-------------|------------|
| GET | `/api/employees` | List employees with filters | Admin+ |
| POST | `/api/employees` | Create new employee | Admin+ |
| GET | `/api/employees/{nik}` | Get single employee | Admin+ |
| PUT | `/api/employees/{nik}` | Update employee | Admin+ |
| DELETE | `/api/employees/{nik}` | Delete employee | Super Admin |

### Advanced Operations

| Method | Endpoint | Description | Auth Level |
|--------|----------|-------------|------------|
| POST | `/api/employees/{nik}/avatar` | Upload avatar | Admin+ |
| GET | `/api/employees-export` | Export employees CSV | Admin+ |
| POST | `/api/employees/import` | Import employees CSV | Admin+ |
| POST | `/api/employees/bulk-delete` | Bulk delete employees | Super Admin |
| GET | `/api/employees/template/download` | Download CSV template | Admin+ |

### Request/Response Examples

#### Create Employee
```typescript
// Request
POST /api/employees
Content-Type: multipart/form-data

{
  nik: "1234567890123456",
  first_name: "John",
  last_name: "Doe",
  // ... other fields
  avatar: File
}

// Response
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "nik": "1234567890123456",
    "full_name": "John Doe",
    "avatar_url": "storage/avatars/avatar.png",
    // ... other fields
  }
}
```

#### Get Employees with Filters
```typescript
// Request
GET /api/employees?search=john&gender=Men&per_page=10&page=1

// Response
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "data": [...employees],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 45,
    "from": 1,
    "to": 10
  },
  "stats": {
    "total_employees": 45,
    "men_count": 30,
    "women_count": 15,
    "permanent_count": 40,
    "contract_count": 5
  }
}
```

## 🔄 Import/Export Features

### CSV Import

**Features:**
- Bulk employee import from CSV
- Comprehensive validation
- Duplicate detection
- Error reporting
- Progress tracking

**CSV Format:**
```csv
nik,first_name,last_name,mobile_phone,gender,last_education,place_of_birth,date_of_birth,position,branch,contract_type,grade,bank,account_number,acc_holder_name,letter_id
1234567890123456,John,Doe,+628123456789,Men,S1,Jakarta,1990-01-01,Developer,Head Office,Permanent,Senior,BCA,1234567890,John Doe,
```

### CSV Export

**Features:**
- Export filtered results
- All employee data included
- Proper CSV formatting
- Date formatting
- Unicode support

## 🛠️ Error Handling

### Validation Errors
```typescript
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "nik": ["NIK must be exactly 16 digits"],
    "email": ["Email format is invalid"]
  }
}
```

### Authentication Errors
```typescript
{
  "success": false,
  "message": "Unauthorized access",
  "code": 403
}
```

### System Errors
```typescript
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

## 🎨 Frontend Components

### EmployeeService
Main service for API communication:

```typescript
import { employeeService } from '@/services/employee';

// Get employees
const employees = await employeeService.getEmployees({
  search: 'john',
  gender: 'Men',
  page: 1,
  per_page: 10
});

// Create employee
const result = await employeeService.createEmployee(employeeData);

// Update employee
const result = await employeeService.updateEmployee(nik, updateData);
```

### Form Components
Reusable form components with validation:

```typescript
<EmployeeForm
  initialData={employee}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isEdit={true}
/>
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hris_database
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=HRIS Employee Management
```

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check if user has admin/super admin role
   - Verify token is not expired
   - Ensure proper login credentials

2. **File Upload Issues**
   - Check file size limits (max 2MB for avatars)
   - Verify file type (jpg, png, jpeg only)
   - Ensure storage permissions

3. **Validation Errors**
   - Verify NIK is exactly 16 digits
   - Check enum values match database constraints
   - Ensure required fields are provided

4. **Database Connection**
   - Verify database credentials in .env
   - Check if MySQL service is running
   - Run migrations if tables don't exist

## 📈 Performance Optimization

### Database Optimization
- Indexed search fields (NIK, name, phone)
- Eager loading for relationships
- Pagination for large datasets
- Query optimization for filters

### Frontend Optimization
- Debounced search inputs
- Lazy loading for large lists
- Image optimization for avatars
- Caching for static data

## 🔮 Future Enhancements

### Planned Features
1. **Advanced Reporting**
   - Employee analytics dashboard
   - Custom report generation
   - Data visualization charts

2. **Integration Features**
   - LDAP/Active Directory sync
   - Third-party HR system integration
   - API webhooks for events

3. **Enhanced Security**
   - Two-factor authentication
   - Audit logging
   - Data encryption

4. **Mobile App**
   - React Native mobile app
   - Offline capability
   - Push notifications

## 📞 Support

### Contact Information
- **Documentation:** This guide
- **API Reference:** `/api/documentation`
- **Issue Tracking:** GitHub Issues
- **Support Email:** support@hris.com

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

---

**Last Updated:** June 12, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
