/**
 * Comprehensive Employee CRUD Testing Script
 * Tests all CRUD operations for the Employee management system
 * Run this in browser console after logging in as admin
 */

class EmployeeCRUDTester {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.testResults = [];
        this.testEmployee = null;
        this.authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        if (!this.authToken) {
            console.error('❌ No auth token found. Please login first.');
            return;
        }
    }

    async runAllTests() {
        console.log('🚀 Starting Employee CRUD Tests...\n');
        
        try {
            await this.testGetEmployees();
            await this.testCreateEmployee();
            await this.testGetSingleEmployee();
            await this.testUpdateEmployee();
            await this.testUploadAvatar();
            await this.testExportEmployees();
            await this.testBulkDelete();
            await this.testDeleteEmployee();
            
            this.displayResults();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async makeRequest(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Accept': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        const data = await response.json();
        return { response, data };
    }

    logTest(testName, success, message, data = null) {
        const result = { testName, success, message, data };
        this.testResults.push(result);
        
        const icon = success ? '✅' : '❌';
        console.log(`${icon} ${testName}: ${message}`);
        if (data) console.log('   Data:', data);
    }

    // Test 1: Get Employees List
    async testGetEmployees() {
        try {
            const { response, data } = await this.makeRequest('/employees?per_page=5');
            
            if (response.ok && data.success) {
                this.logTest(
                    'GET Employees List', 
                    true, 
                    `Found ${data.data.total} employees`,
                    { count: data.data.data.length, stats: data.stats }
                );
            } else {
                this.logTest('GET Employees List', false, data.message || 'Failed to fetch employees');
            }
        } catch (error) {
            this.logTest('GET Employees List', false, error.message);
        }
    }

    // Test 2: Create Employee
    async testCreateEmployee() {
        try {
            const testEmployeeData = {
                nik: '1234567890123999', // Unique NIK for testing
                first_name: 'Test',
                last_name: 'Employee',
                mobile_phone: '+628123456789',
                gender: 'Men',
                last_education: 'S1',
                place_of_birth: 'Jakarta',
                date_of_birth: '1990-01-01',
                position: 'Software Engineer',
                branch: 'Head Office',
                contract_type: 'Permanent',
                grade: 'Senior',
                bank: 'BCA',
                account_number: '1234567890',
                acc_holder_name: 'Test Employee'
            };

            const formData = new FormData();
            Object.entries(testEmployeeData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const { response, data } = await this.makeRequest('/employees', {
                method: 'POST',
                body: formData,
                headers: {} // Don't set Content-Type for FormData
            });

            if (response.ok && data.success) {
                this.testEmployee = data.data;
                this.logTest(
                    'CREATE Employee', 
                    true, 
                    `Employee created with NIK: ${data.data.nik}`,
                    { nik: data.data.nik, name: data.data.full_name }
                );
            } else {
                this.logTest('CREATE Employee', false, data.message || 'Failed to create employee', data.errors);
            }
        } catch (error) {
            this.logTest('CREATE Employee', false, error.message);
        }
    }

    // Test 3: Get Single Employee
    async testGetSingleEmployee() {
        if (!this.testEmployee) {
            this.logTest('GET Single Employee', false, 'No test employee to fetch');
            return;
        }

        try {
            const { response, data } = await this.makeRequest(`/employees/${this.testEmployee.nik}`);
            
            if (response.ok && data.success) {
                this.logTest(
                    'GET Single Employee', 
                    true, 
                    `Employee details retrieved for ${data.data.full_name}`,
                    { 
                        nik: data.data.nik, 
                        position: data.data.position,
                        age: data.data.age 
                    }
                );
            } else {
                this.logTest('GET Single Employee', false, data.message || 'Failed to fetch employee');
            }
        } catch (error) {
            this.logTest('GET Single Employee', false, error.message);
        }
    }

    // Test 4: Update Employee
    async testUpdateEmployee() {
        if (!this.testEmployee) {
            this.logTest('UPDATE Employee', false, 'No test employee to update');
            return;
        }

        try {
            const updateData = {
                position: 'Senior Software Engineer',
                grade: 'Lead',
                mobile_phone: '+628123456790'
            };

            const formData = new FormData();
            formData.append('_method', 'PUT');
            Object.entries(updateData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const { response, data } = await this.makeRequest(`/employees/${this.testEmployee.nik}`, {
                method: 'POST', // Laravel uses POST with _method=PUT for FormData
                body: formData,
                headers: {}
            });

            if (response.ok && data.success) {
                this.logTest(
                    'UPDATE Employee', 
                    true, 
                    `Employee updated successfully`,
                    { 
                        new_position: data.data.employee.position,
                        new_grade: data.data.employee.grade 
                    }
                );
            } else {
                this.logTest('UPDATE Employee', false, data.message || 'Failed to update employee', data.errors);
            }
        } catch (error) {
            this.logTest('UPDATE Employee', false, error.message);
        }
    }

    // Test 5: Upload Avatar
    async testUploadAvatar() {
        if (!this.testEmployee) {
            this.logTest('UPLOAD Avatar', false, 'No test employee for avatar upload');
            return;
        }

        try {
            // Create a test image blob
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(0, 0, 100, 100);
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText('TEST', 25, 55);

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('avatar', blob, 'test-avatar.png');

                const { response, data } = await this.makeRequest(`/employees/${this.testEmployee.nik}/avatar`, {
                    method: 'POST',
                    body: formData,
                    headers: {}
                });

                if (response.ok && data.success) {
                    this.logTest(
                        'UPLOAD Avatar', 
                        true, 
                        'Avatar uploaded successfully',
                        { avatar_url: data.data.avatar_url }
                    );
                } else {
                    this.logTest('UPLOAD Avatar', false, data.message || 'Failed to upload avatar');
                }
            }, 'image/png');
        } catch (error) {
            this.logTest('UPLOAD Avatar', false, error.message);
        }
    }

    // Test 6: Export Employees
    async testExportEmployees() {
        try {
            const { response, data } = await this.makeRequest('/employees-export');
            
            if (response.ok && data.success) {
                this.logTest(
                    'EXPORT Employees', 
                    true, 
                    `Exported ${data.data.length} employees`,
                    { count: data.data.length }
                );
            } else {
                this.logTest('EXPORT Employees', false, data.message || 'Failed to export employees');
            }
        } catch (error) {
            this.logTest('EXPORT Employees', false, error.message);
        }
    }

    // Test 7: Bulk Delete (Test with dummy NIKs)
    async testBulkDelete() {
        try {
            // Test with non-existent NIKs to avoid deleting real data
            const dummyNiks = ['9999999999999999', '9999999999999998'];
            
            const { response, data } = await this.makeRequest('/employees/bulk-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ niks: dummyNiks })
            });

            // Expecting this to fail gracefully since NIKs don't exist
            if (response.status === 422 || (data.success && data.data.failed > 0)) {
                this.logTest(
                    'BULK DELETE', 
                    true, 
                    'Bulk delete endpoint working (tested with dummy NIKs)',
                    { status: response.status, message: data.message }
                );
            } else {
                this.logTest('BULK DELETE', false, 'Unexpected response from bulk delete');
            }
        } catch (error) {
            this.logTest('BULK DELETE', false, error.message);
        }
    }

    // Test 8: Delete Employee (Clean up test data)
    async testDeleteEmployee() {
        if (!this.testEmployee) {
            this.logTest('DELETE Employee', false, 'No test employee to delete');
            return;
        }

        try {
            const { response, data } = await this.makeRequest(`/employees/${this.testEmployee.nik}`, {
                method: 'DELETE'
            });

            if (response.ok && data.success) {
                this.logTest(
                    'DELETE Employee', 
                    true, 
                    `Test employee deleted successfully (NIK: ${this.testEmployee.nik})`
                );
            } else {
                this.logTest('DELETE Employee', false, data.message || 'Failed to delete employee');
            }
        } catch (error) {
            this.logTest('DELETE Employee', false, error.message);
        }
    }

    displayResults() {
        console.log('\n📊 EMPLOYEE CRUD TEST RESULTS');
        console.log('================================');
        
        const passed = this.testResults.filter(r => r.success).length;
        const failed = this.testResults.filter(r => r.success === false).length;
        const total = this.testResults.length;
        
        console.log(`✅ Passed: ${passed}/${total}`);
        console.log(`❌ Failed: ${failed}/${total}`);
        console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%\n`);
        
        if (failed > 0) {
            console.log('❌ Failed Tests:');
            this.testResults.filter(r => !r.success).forEach(test => {
                console.log(`   - ${test.testName}: ${test.message}`);
            });
        }
        
        console.log('\n🎯 CRUD Operations Status:');
        console.log('- CREATE: ' + (this.testResults.find(r => r.testName === 'CREATE Employee')?.success ? '✅' : '❌'));
        console.log('- READ (List): ' + (this.testResults.find(r => r.testName === 'GET Employees List')?.success ? '✅' : '❌'));
        console.log('- READ (Single): ' + (this.testResults.find(r => r.testName === 'GET Single Employee')?.success ? '✅' : '❌'));
        console.log('- UPDATE: ' + (this.testResults.find(r => r.testName === 'UPDATE Employee')?.success ? '✅' : '❌'));
        console.log('- DELETE: ' + (this.testResults.find(r => r.testName === 'DELETE Employee')?.success ? '✅' : '❌'));
        console.log('- BULK DELETE: ' + (this.testResults.find(r => r.testName === 'BULK DELETE')?.success ? '✅' : '❌'));
        console.log('- UPLOAD AVATAR: ' + (this.testResults.find(r => r.testName === 'UPLOAD Avatar')?.success ? '✅' : '❌'));
        console.log('- EXPORT: ' + (this.testResults.find(r => r.testName === 'EXPORT Employees')?.success ? '✅' : '❌'));
        
        console.log('\n🏁 Employee CRUD Testing Complete!');
    }
}

// Auto-run tests if this script is executed
if (typeof window !== 'undefined') {
    console.log('🔧 Employee CRUD Tester loaded. Run: new EmployeeCRUDTester().runAllTests()');
    
    // Optionally auto-run after 2 seconds
    setTimeout(() => {
        console.log('🚀 Auto-starting CRUD tests in 3 seconds...');
        setTimeout(() => {
            const tester = new EmployeeCRUDTester();
            if (tester.authToken) {
                tester.runAllTests();
            }
        }, 3000);
    }, 2000);
}
