/**
 * Employee CRUD API Testing Script
 * Automated testing for Employee Management System
 * 
 * Usage: node test-employee-crud-api.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

class EmployeeCRUDAPITester {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        this.authToken = null;
        this.testEmployee = null;
        this.testResults = [];        // Test credentials - make sure these exist in your database
        this.testCredentials = {
            login: 'superadmin@hris.com',
            password: 'SuperAdmin123#'
        };
    }

    async makeRequest(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            const url = new URL(`${this.baseURL}/api${endpoint}`);
            const protocol = url.protocol === 'https:' ? https : http;
            
            const requestOptions = {
                hostname: url.hostname,
                port: url.port || (url.protocol === 'https:' ? 443 : 80),
                path: url.pathname + url.search,
                method: options.method || 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Employee-CRUD-Tester/1.0',
                    ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
                    ...options.headers
                }
            };

            const req = protocol.request(requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve({
                            status: res.statusCode,
                            headers: res.headers,
                            data: jsonData,
                            success: res.statusCode >= 200 && res.statusCode < 300
                        });
                    } catch (error) {
                        resolve({
                            status: res.statusCode,
                            headers: res.headers,
                            data: data,
                            success: false,
                            error: 'Invalid JSON response'
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (options.body) {
                req.write(options.body);
            }

            req.end();
        });
    }

    async login() {
        console.log('🔐 Attempting to login...');
        
        try {
            const response = await this.makeRequest('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.testCredentials)
            });

            if (response.success && response.data.success) {
                this.authToken = response.data.data.token;
                console.log('✅ Login successful');
                return true;
            } else {
                console.log('❌ Login failed:', response.data.message);
                return false;
            }
        } catch (error) {
            console.log('❌ Login error:', error.message);
            return false;
        }
    }

    logTest(testName, success, message, data = null) {
        const result = { testName, success, message, data, timestamp: new Date().toISOString() };
        this.testResults.push(result);
        
        const icon = success ? '✅' : '❌';
        console.log(`${icon} ${testName}: ${message}`);
        if (data && typeof data === 'object') {
            console.log('   📊 Data:', JSON.stringify(data, null, 2));
        }
    }

    async testGetEmployees() {
        console.log('\n📋 Testing GET Employees...');
        
        try {
            const response = await this.makeRequest('/employees?per_page=5');
            
            if (response.success && response.data.success) {
                this.logTest(
                    'GET Employees List',
                    true,
                    `Retrieved ${response.data.data.total} employees`,
                    {
                        total: response.data.data.total,
                        current_page: response.data.data.current_page,
                        stats: response.data.stats
                    }
                );
            } else {
                this.logTest('GET Employees List', false, response.data.message || 'Failed to fetch employees');
            }
        } catch (error) {
            this.logTest('GET Employees List', false, error.message);
        }
    }

    async testCreateEmployee() {
        console.log('\n👤 Testing CREATE Employee...');
        
        try {            const testEmployeeData = {
                nik: '1111222233334444', // Unique NIK for testing
                first_name: 'API',
                last_name: 'Test',
                mobile_phone: '+628123456777',
                gender: 'Men',
                last_education: 'S1',
                place_of_birth: 'Jakarta',
                date_of_birth: '1990-01-01',
                position: 'API Tester',
                branch: 'Head Office',
                contract_type: 'Contract',
                grade: 'Senior',
                bank: 'BCA',
                account_number: '1234567777',
                acc_holder_name: 'API Test'
            };

            // Create FormData-like string for the request
            const boundary = '----formdata-' + Math.random().toString(36).substring(2);
            let formData = '';
            
            Object.entries(testEmployeeData).forEach(([key, value]) => {
                formData += `--${boundary}\r\n`;
                formData += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
                formData += `${value}\r\n`;
            });
            formData += `--${boundary}--\r\n`;

            const response = await this.makeRequest('/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': Buffer.byteLength(formData)
                },
                body: formData
            });

            if (response.success && response.data.success) {
                this.testEmployee = response.data.data;
                this.logTest(
                    'CREATE Employee',
                    true,
                    `Employee created successfully`,
                    {
                        nik: response.data.data.nik,
                        name: response.data.data.full_name,
                        position: response.data.data.position
                    }
                );
            } else {
                this.logTest('CREATE Employee', false, response.data.message || 'Failed to create employee', response.data.errors);
            }
        } catch (error) {
            this.logTest('CREATE Employee', false, error.message);
        }
    }

    async testGetSingleEmployee() {
        console.log('\n🔍 Testing GET Single Employee...');
        
        if (!this.testEmployee) {
            this.logTest('GET Single Employee', false, 'No test employee available');
            return;
        }

        try {
            const response = await this.makeRequest(`/employees/${this.testEmployee.nik}`);
            
            if (response.success && response.data.success) {
                this.logTest(
                    'GET Single Employee',
                    true,
                    `Employee details retrieved`,
                    {
                        nik: response.data.data.nik,
                        name: response.data.data.full_name,
                        age: response.data.data.age,
                        position: response.data.data.position
                    }
                );
            } else {
                this.logTest('GET Single Employee', false, response.data.message || 'Failed to fetch employee');
            }
        } catch (error) {
            this.logTest('GET Single Employee', false, error.message);
        }
    }

    async testUpdateEmployee() {
        console.log('\n✏️ Testing UPDATE Employee...');
        
        if (!this.testEmployee) {
            this.logTest('UPDATE Employee', false, 'No test employee available');
            return;
        }

        try {
            const updateData = {
                position: 'Senior API Tester',
                grade: 'Lead',
                mobile_phone: '+628123456888'
            };

            // Create FormData with _method=PUT
            const boundary = '----formdata-' + Math.random().toString(36).substring(2);
            let formData = '';
            
            formData += `--${boundary}\r\n`;
            formData += `Content-Disposition: form-data; name="_method"\r\n\r\n`;
            formData += `PUT\r\n`;
            
            Object.entries(updateData).forEach(([key, value]) => {
                formData += `--${boundary}\r\n`;
                formData += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
                formData += `${value}\r\n`;
            });
            formData += `--${boundary}--\r\n`;

            const response = await this.makeRequest(`/employees/${this.testEmployee.nik}`, {
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': Buffer.byteLength(formData)
                },
                body: formData
            });

            if (response.success && response.data.success) {
                this.logTest(
                    'UPDATE Employee',
                    true,
                    'Employee updated successfully',
                    {
                        new_position: response.data.data.employee.position,
                        new_grade: response.data.data.employee.grade
                    }
                );
            } else {
                this.logTest('UPDATE Employee', false, response.data.message || 'Failed to update employee', response.data.errors);
            }
        } catch (error) {
            this.logTest('UPDATE Employee', false, error.message);
        }
    }

    async testExportEmployees() {
        console.log('\n📤 Testing EXPORT Employees...');
        
        try {
            const response = await this.makeRequest('/employees-export');
            
            if (response.success && response.data.success) {
                this.logTest(
                    'EXPORT Employees',
                    true,
                    `Exported ${response.data.data.length} employees`,
                    { count: response.data.data.length }
                );
            } else {
                this.logTest('EXPORT Employees', false, response.data.message || 'Failed to export employees');
            }
        } catch (error) {
            this.logTest('EXPORT Employees', false, error.message);
        }
    }

    async testBulkDelete() {
        console.log('\n🗑️ Testing BULK DELETE...');
        
        try {
            const dummyNiks = ['9999999999999995', '9999999999999996'];
              const response = await this.makeRequest('/employees/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ niks: dummyNiks })
            });

            // Expecting validation error since NIKs don't exist
            if (response.status === 422 || (response.data.success && response.data.data.failed > 0)) {
                this.logTest(
                    'BULK DELETE',
                    true,
                    'Bulk delete endpoint working correctly',
                    { status: response.status, message: response.data.message }
                );
            } else {
                this.logTest('BULK DELETE', false, 'Unexpected response from bulk delete');
            }
        } catch (error) {
            this.logTest('BULK DELETE', false, error.message);
        }
    }

    async testDeleteEmployee() {
        console.log('\n🗑️ Testing DELETE Employee...');
        
        if (!this.testEmployee) {
            this.logTest('DELETE Employee', false, 'No test employee to delete');
            return;
        }

        try {
            const response = await this.makeRequest(`/employees/${this.testEmployee.nik}`, {
                method: 'DELETE'
            });

            if (response.success && response.data.success) {
                this.logTest(
                    'DELETE Employee',
                    true,
                    `Test employee deleted (NIK: ${this.testEmployee.nik})`
                );
                this.testEmployee = null;
            } else {
                this.logTest('DELETE Employee', false, response.data.message || 'Failed to delete employee');
            }
        } catch (error) {
            this.logTest('DELETE Employee', false, error.message);
        }
    }

    async runAllTests() {
        console.log('🚀 Starting Employee CRUD API Testing...\n');
        console.log('==========================================\n');
        
        // Login first
        const loginSuccess = await this.login();
        if (!loginSuccess) {
            console.log('❌ Cannot proceed without authentication');
            return;
        }

        // Run all tests
        await this.testGetEmployees();
        await this.testCreateEmployee();
        await this.testGetSingleEmployee();
        await this.testUpdateEmployee();
        await this.testExportEmployees();
        await this.testBulkDelete();
        await this.testDeleteEmployee();

        // Display results
        this.displayResults();
    }

    displayResults() {
        console.log('\n\n📊 EMPLOYEE CRUD API TEST RESULTS');
        console.log('==================================');
        
        const passed = this.testResults.filter(r => r.success).length;
        const failed = this.testResults.filter(r => !r.success).length;
        const total = this.testResults.length;
        
        console.log(`✅ Passed: ${passed}/${total}`);
        console.log(`❌ Failed: ${failed}/${total}`);
        console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`);
        
        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults.filter(r => !r.success).forEach(test => {
                console.log(`   - ${test.testName}: ${test.message}`);
            });
        }
        
        console.log('\n🎯 CRUD Operations Status:');
        const operations = [
            'GET Employees List',
            'CREATE Employee', 
            'GET Single Employee',
            'UPDATE Employee',
            'DELETE Employee',
            'BULK DELETE',
            'EXPORT Employees'
        ];
        
        operations.forEach(op => {
            const result = this.testResults.find(r => r.testName === op);
            const status = result ? (result.success ? '✅' : '❌') : '⭕';
            console.log(`- ${op}: ${status}`);
        });
        
        // Generate report file
        this.generateReport();
        
        console.log('\n🏁 Employee CRUD API Testing Complete!');
        console.log('📄 Detailed report saved to: employee-crud-test-report.json');
    }

    generateReport() {
        const report = {
            testSuite: 'Employee CRUD API Tests',
            timestamp: new Date().toISOString(),
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.success).length,
                failed: this.testResults.filter(r => !r.success).length,
                successRate: Math.round((this.testResults.filter(r => r.success).length / this.testResults.length) * 100)
            },
            results: this.testResults,
            environment: {
                backend: this.baseURL,
                node_version: process.version,
                platform: process.platform
            }
        };

        fs.writeFileSync('employee-crud-test-report.json', JSON.stringify(report, null, 2));
    }
}

// Run tests if script is executed directly
if (require.main === module) {
    const tester = new EmployeeCRUDAPITester();
    tester.runAllTests().catch(console.error);
}

module.exports = EmployeeCRUDAPITester;
