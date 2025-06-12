/**
 * Employee Service for HRIS Frontend
 * Handles all employee-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Employee {
  nik: string;
  avatar: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  mobile_phone: string;
  gender: string;
  last_education: string;
  place_of_birth: string;
  date_of_birth: string;
  age: number;
  position: string;
  branch: string;
  contract_type: string;
  grade: string;
  bank: string;
  account_number: string;
  acc_holder_name: string;
  letter_id: number | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  letter_format?: {
    id_letter: number;
    name: string;
  };
  user_account?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface EmployeeCreateData {
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
  letter_id?: string;
  avatar?: File;
}

export interface EmployeeUpdateData {
  first_name?: string;
  last_name?: string;
  mobile_phone?: string;
  gender?: string;
  last_education?: string;
  place_of_birth?: string;
  date_of_birth?: string;
  position?: string;
  branch?: string;
  contract_type?: string;
  grade?: string;
  bank?: string;
  account_number?: string;
  acc_holder_name?: string;
  letter_id?: string;
  avatar?: File;
}

export interface EmployeeFilters {
  search?: string;
  gender?: string;
  branch?: string;
  position?: string;
  contract_type?: string;
  last_education?: string;
  bank?: string;
  grade?: string;
  age_min?: string;
  age_max?: string;
  page?: number;
  per_page?: number;
}

export interface EmployeeStats {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  men_count: number;
  women_count: number;
  permanent_count: number;
  contract_count: number;
}

export interface EmployeeListResponse {
  success: boolean;
  data: {
    data: Employee[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  stats: EmployeeStats;
  message?: string;
}

export interface EmployeeResponse {
  success: boolean;
  data: Employee;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    imported: number;
    failed: number;
    total_rows: number;
  };
  total_errors?: number;
  duplicates?: string[];
  errors?: string[];
}

class EmployeeService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeadersForFormData() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      // Don't set Content-Type for FormData, let browser set it
    };
  }

  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${response.status}`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  /**
   * Get list of employees with optional filters
   */
  async getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/employees${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get employees error:', error);
      throw error;
    }
  }

  /**
   * Get single employee by NIK
   */
  async getEmployee(nik: string): Promise<EmployeeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${nik}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get employee error:', error);
      throw error;
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(data: EmployeeCreateData): Promise<EmployeeResponse> {
    try {
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value);
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create employee error:', error);
      throw error;
    }
  }

  /**
   * Update employee by NIK
   */
  async updateEmployee(nik: string, data: EmployeeUpdateData): Promise<EmployeeResponse> {
    try {
      const formData = new FormData();

      // Add method override for PUT request via FormData
      formData.append('_method', 'PUT');

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value);
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/employees/${nik}`, {
        method: 'POST', // Use POST with _method override for file uploads
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update employee error:', error);
      throw error;
    }
  }

  /**
   * Delete employee by NIK
   */
  async deleteEmployee(nik: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${nik}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Delete employee error:', error);
      throw error;
    }
  }

  /**
   * Import employees from CSV file
   */
  async importEmployees(file: File): Promise<ImportResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/employees/import`, {
        method: 'POST',
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Import employees error:', error);
      throw error;
    }
  }

  /**
   * Export employees to CSV
   */
  async exportEmployees(filters: EmployeeFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/employees/export${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Export employees error:', error);
      throw error;
    }
  }

  /**
   * Get filter options (unique values for dropdowns)
   */
  async getFilterOptions(): Promise<{
    genders: string[];
    branches: string[];
    positions: string[];
    contractTypes: string[];
    educations: string[];
    banks: string[];
    grades: string[];
  }> {
    try {
      // Get all employees to extract unique values
      const response = await this.getEmployees({ per_page: 1000 });
      const employees = response.data.data;

      if (!Array.isArray(employees)) {
        return {
          genders: [],
          branches: [],
          positions: [],
          contractTypes: [],
          educations: [],
          banks: [],
          grades: [],
        };
      }

      return {
        genders: [...new Set(employees.map(emp => emp.gender))].filter(Boolean).sort(),
        branches: [...new Set(employees.map(emp => emp.branch))].filter(Boolean).sort(),
        positions: [...new Set(employees.map(emp => emp.position))].filter(Boolean).sort(),
        contractTypes: [...new Set(employees.map(emp => emp.contract_type))].filter(Boolean).sort(),
        educations: [...new Set(employees.map(emp => emp.last_education))].filter(Boolean).sort(),
        banks: [...new Set(employees.map(emp => emp.bank))].filter(Boolean).sort(),
        grades: [...new Set(employees.map(emp => emp.grade))].filter(Boolean).sort(),
      };
    } catch (error) {
      console.error('Get filter options error:', error);
      // Return default empty options if error
      return {
        genders: ['Men', 'Woman'],
        branches: [],
        positions: [],
        contractTypes: ['Permanent', 'Contract'],
        educations: ['SMA/SMK Sederajat', 'S1', 'S2'],
        banks: ['BCA', 'BNI', 'BRI', 'BSI', 'BTN', 'CMIB', 'Mandiri', 'Permata'],
        grades: [],
      };
    }
  }
  /**
   * Bulk delete employees
   */
  async bulkDeleteEmployees(niks: string[]): Promise<{ success: boolean; message: string; results: any[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/bulk-delete`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ niks }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Bulk delete employees error:', error);
      throw error;
    }
  }

  /**
   * Search employees (enhanced search with suggestions)
   */
  async searchEmployees(query: string, limit: number = 10): Promise<Employee[]> {
    try {
      const response = await this.getEmployees({ 
        search: query, 
        per_page: limit 
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Search employees error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();
export default employeeService;
