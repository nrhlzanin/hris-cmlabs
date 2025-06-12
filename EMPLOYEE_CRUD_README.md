# 🏢 HRIS Employee CRUD System

[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen.svg)]()
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)]()

A comprehensive Employee Management CRUD system built with Laravel 11 and Next.js 14, featuring advanced search, bulk operations, import/export capabilities, and role-based access control.

## ✨ Features

### 🎯 Core CRUD Operations
- ✅ **Create** - Add new employees with comprehensive validation
- ✅ **Read** - List and view employee details with advanced filtering
- ✅ **Update** - Edit employee information with real-time validation
- ✅ **Delete** - Remove employees with proper authorization

### 🚀 Advanced Features
- 📊 **Advanced Search & Filtering** - Multi-criteria search across all fields
- 📥 **CSV Import/Export** - Bulk data operations with validation
- 🖼️ **Avatar Upload** - Profile picture management with image processing
- 🔐 **Role-Based Access** - Admin and Super Admin authorization levels
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔄 **Real-time Updates** - Live data synchronization
- 📈 **Statistics Dashboard** - Employee analytics and insights

## 🛠️ Tech Stack

### Backend
- **Laravel 11** - PHP framework with modern features
- **MySQL 8.0** - Robust database with proper indexing
- **Laravel Sanctum** - API authentication
- **Laravel Validation** - Comprehensive form validation
- **Intervention Image** - Avatar processing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Modern state management
- **Form Validation** - Client-side validation

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
PHP 8.2+
Composer
MySQL 8.0+
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hris-cmlabs
```

2. **Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=AdminSeeder
php artisan serve --host=0.0.0.0 --port=8000
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:8000
- Employee Management: http://localhost:3001/admin/employee/employee-database

### Default Admin Credentials
```
Email: admin@hris.com
Password: Admin123#

Super Admin:
Email: superadmin@hris.com  
Password: SuperAdmin123#
```

## 📁 Project Structure

```
hris-cmlabs/
├── backend/                          # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── EmployeeController.php    # Main CRUD controller
│   │   ├── Models/
│   │   │   └── Employee.php              # Employee model
│   │   └── Services/
│   │       └── AuthService.php           # Authentication service
│   ├── database/
│   │   ├── migrations/                   # Database schemas
│   │   └── seeders/                      # Initial data
│   └── routes/
│       └── api.php                       # API routes
├── frontend/                         # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/admin/employee/           # Employee pages
│   │   │   ├── employee-database/        # Main listing
│   │   │   ├── new-employee/             # Create form
│   │   │   ├── employee-detail/[nik]/    # Detail view
│   │   │   └── edit-employee/[nik]/      # Edit form
│   │   ├── services/
│   │   │   └── employee.ts               # API service layer
│   │   └── components/                   # Reusable components
│   └── public/                           # Static assets
└── docs/                             # Documentation
```

## 🔧 API Endpoints

### Authentication Required (Admin+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | List employees with pagination & filters |
| `POST` | `/api/employees` | Create new employee |
| `GET` | `/api/employees/{nik}` | Get employee details |
| `PUT` | `/api/employees/{nik}` | Update employee |
| `POST` | `/api/employees/{nik}/avatar` | Upload employee avatar |
| `GET` | `/api/employees-export` | Export employees to CSV |
| `POST` | `/api/employees/import` | Import employees from CSV |

### Super Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| `DELETE` | `/api/employees/{nik}` | Delete employee |
| `POST` | `/api/employees/bulk-delete` | Bulk delete employees |

## 💻 Usage Examples

### Frontend Service Usage

```typescript
import { employeeService } from '@/services/employee';

// Get employees with filters
const response = await employeeService.getEmployees({
  search: 'john',
  gender: 'Men',
  branch: 'Head Office',
  page: 1,
  per_page: 10
});

// Create new employee
const newEmployee = await employeeService.createEmployee({
  nik: '1234567890123456',
  first_name: 'John',
  last_name: 'Doe',
  // ... other fields
});

// Update employee
const updated = await employeeService.updateEmployee('1234567890123456', {
  position: 'Senior Developer',
  grade: 'Lead'
});

// Delete employee (Super Admin only)
await employeeService.deleteEmployee('1234567890123456');
```

### API Request Examples

```bash
# Get employees with search
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8000/api/employees?search=john&gender=Men"

# Create employee
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "nik=1234567890123456" \
  -F "first_name=John" \
  -F "last_name=Doe" \
  http://localhost:8000/api/employees

# Upload avatar
curl -X POST \
  -H "Authorization: Bearer {token}" \
  -F "avatar=@avatar.jpg" \
  http://localhost:8000/api/employees/1234567890123456/avatar
```

## 🧪 Testing

### Run API Tests
```bash
cd frontend
node test-employee-crud-api.js
```

### Test Results
```
🎯 CRUD Operations Status:
- GET Employees List: ✅
- CREATE Employee: ✅  
- GET Single Employee: ✅
- UPDATE Employee: ✅
- DELETE Employee: ✅
- BULK DELETE: ✅
- EXPORT Employees: ✅

📈 Success Rate: 100%
```

### Manual Testing
1. Open http://localhost:3001/admin/employee/employee-database
2. Test search and filters
3. Create new employee
4. Edit existing employee
5. Upload avatar
6. Export/Import CSV

## 🔒 Security Features

### Authentication
- Bearer token authentication
- Token expiration handling
- Automatic token refresh

### Authorization
- Role-based access control (Admin, Super Admin)
- Route protection
- API endpoint security

### Data Validation
- Frontend form validation
- Backend API validation
- File upload restrictions
- SQL injection prevention

## 📊 Performance

### Optimizations Implemented
- Database indexing on search fields
- Eager loading for relationships
- Pagination for large datasets
- Image optimization for avatars
- Debounced search inputs
- Lazy loading components

### Benchmarks
- Page load time: < 2 seconds
- API response time: < 500ms
- Search performance: < 300ms
- File upload: < 5 seconds

## 🐛 Troubleshooting

### Common Issues

**1. Authentication Failed**
```bash
# Check if user has admin role
# Verify token in localStorage/sessionStorage
# Ensure backend is running on port 8000
```

**2. File Upload Errors**
```bash
# Check file size (max 2MB)
# Verify file type (jpg, png, jpeg)
# Ensure storage directory permissions
```

**3. Database Connection**
```bash
# Verify .env database credentials
# Check MySQL service status
# Run migrations: php artisan migrate
```

## 📈 Analytics & Reporting

### Built-in Statistics
- Total employees count
- Gender distribution
- Contract type breakdown
- Branch distribution
- Age demographics

### Export Capabilities
- Filtered CSV exports
- Complete employee database
- Custom date ranges
- Multiple file formats

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Admin users created
- [ ] File permissions set
- [ ] SSL certificates installed
- [ ] Backup strategy implemented

### Environment Setup
```bash
# Production environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=hris_production

# File Storage
FILESYSTEM_DISK=s3  # For production
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use TypeScript for all frontend code
- Write tests for new features
- Update documentation
- Ensure 100% test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Laravel team for the amazing framework
- Next.js team for the excellent React framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

## 📞 Support

- **Documentation:** [Full Documentation](EMPLOYEE_CRUD_DOCUMENTATION.md)
- **Testing Report:** [Test Results](EMPLOYEE_CRUD_TESTING_REPORT.md)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Made with ❤️ for efficient HR management**

*Last updated: June 12, 2025*
