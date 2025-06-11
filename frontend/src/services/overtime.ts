// Overtime service types and functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Direct database access - no throttling for fast loading
// API utility function for overtime service
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Direct API call without any delays
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  
  const config: RequestInit = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, config);
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
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Export the OvertimeRecord interface for use in other files
export interface OvertimeRecord {
  id: number;
  user_id: number;
  overtime_date: string;
  start_time: string;
  end_time: string | null;
  duration_hours: number | null;
  overtime_type: 'regular' | 'holiday' | 'weekend';
  reason: string;
  tasks_completed?: string;
  supporting_document_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_remarks?: string;
  created_at: string;
  updated_at: string;
  date: string; // alias for overtime_date
  employee?: {
    id: number;
    name: string;
    employee_id: string;
    department?: string;
  };
}

export interface OvertimeFormData {
  overtime_date: string;
  start_time: string;
  end_time?: string;
  overtime_type: 'regular' | 'holiday' | 'weekend';
  reason: string;
  tasks_completed?: string;
  supporting_document?: File;
}

export interface OvertimeListResponse {
  data: OvertimeRecord[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}

export interface OvertimeStatistics {
  total_overtime_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  total_overtime_hours: number;
  average_overtime_hours: number;
  monthly_breakdown: {
    month: string;
    total_requests: number;
    total_hours: number;
  }[];
  department_breakdown: {
    department: string;
    total_requests: number;
    total_hours: number;
  }[];
}

export interface OvertimeFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  user_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: 'overtime_date' | 'created_at' | 'duration_hours';
  sort_order?: 'asc' | 'desc';
}

class OvertimeService {  /**
   * Get overtime requests with filters and pagination
   */
  async getOvertimeRecords(filters: OvertimeFilters = {}): Promise<OvertimeListResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/overtime${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<OvertimeListResponse>(url, {
      method: 'GET',
    });
  }

  /**
   * Get specific overtime request by ID
   */
  async getOvertime(id: number): Promise<OvertimeRecord> {
    return apiRequest<OvertimeRecord>(`/overtime/${id}`, {
      method: 'GET',
    });
  }
  /**
   * Create new overtime request
   */
  async createOvertime(data: OvertimeFormData): Promise<OvertimeRecord> {
    const formData = new FormData();
    
    // Add form fields
    formData.append('overtime_date', data.overtime_date);
    formData.append('start_time', data.start_time);
    formData.append('overtime_type', data.overtime_type);
    formData.append('reason', data.reason);
    
    // Only append end_time if it exists
    if (data.end_time) {
      formData.append('end_time', data.end_time);
    }
    
    if (data.tasks_completed) {
      formData.append('tasks_completed', data.tasks_completed);
    }
    
    if (data.supporting_document) {
      formData.append('supporting_document', data.supporting_document);
    }

    return apiRequest<OvertimeRecord>('/overtime', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser set it for FormData
      headers: {},
    });
  }

  /**
   * Update existing overtime request (only for pending requests)
   */
  async updateOvertime(id: number, data: Partial<OvertimeFormData>): Promise<OvertimeRecord> {
    const formData = new FormData();
    
    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'supporting_document') {
        formData.append(key, value.toString());
      }
    });
    
    if (data.supporting_document) {
      formData.append('supporting_document', data.supporting_document);
    }

    return apiRequest<OvertimeRecord>(`/overtime/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  }

  /**
   * Delete overtime request (only for pending requests)
   */
  async deleteOvertime(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/overtime/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Approve overtime request (admin only)
   */
  async approveOvertime(id: number, notes?: string): Promise<OvertimeRecord> {
    return apiRequest<OvertimeRecord>(`/overtime/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({
        admin_notes: notes,
      }),
    });
  }

  /**
   * Reject overtime request (admin only)
   */
  async rejectOvertime(id: number, notes: string): Promise<OvertimeRecord> {
    return apiRequest<OvertimeRecord>(`/overtime/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        admin_notes: notes,
      }),
    });
  }

  /**
   * Get overtime statistics (admin only)
   */
  async getOvertimeStatistics(): Promise<OvertimeStatistics> {
    return apiRequest<OvertimeStatistics>('/overtime/admin/statistics', {
      method: 'GET',
    });
  }

  /**
   * Download supporting document
   */  async downloadSupportingDocument(id: number): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/overtime/${id}/document`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return response.blob();
  }

  /**
   * Get user's overtime summary
   */
  async getUserOvertimeSummary(): Promise<{
    total_requests: number;
    pending_requests: number;
    approved_requests: number;
    rejected_requests: number;
    total_hours_this_month: number;
    total_hours_this_year: number;
  }> {
    return apiRequest('/overtime/summary', {
      method: 'GET',
    });
  }

  /**
   * Export overtime data to Excel/CSV (admin only)
   */
  async exportOvertimes(
    format: 'excel' | 'csv' = 'excel',
    filters: Omit<OvertimeFilters, 'page' | 'per_page'> = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    queryParams.append('format', format);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/overtime/export?${queryParams.toString()}`,      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export overtime data');
    }

    return response.blob();
  }
  /**
   * Update overtime status (admin only)
   */
  async updateOvertimeStatus(
    id: number,
    data: {
      status: 'approved' | 'rejected';
      admin_remarks?: string;
    }
  ): Promise<OvertimeRecord> {
    return apiRequest<OvertimeRecord>(`/overtime/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get overtime requests that need admin attention
   */
  async getPendingOvertimes(): Promise<OvertimeRecord[]> {
    const response = await this.getOvertimeRecords({
      status: 'pending',
      sort_by: 'created_at',
      sort_order: 'asc',
    });

    return response.data;
  }

  /**
   * Get overtime requests for a specific date range
   */
  async getOvertimesByDateRange(
    startDate: string,
    endDate: string,
    userId?: number
  ): Promise<OvertimeRecord[]> {
    const filters: OvertimeFilters = {
      date_from: startDate,
      date_to: endDate,
    };

    if (userId) {
      filters.user_id = userId;
    }

    const response = await this.getOvertimeRecords(filters);
    return response.data;
  }

  /**
   * Bulk approve multiple overtime requests (admin only)
   */
  async bulkApproveOvertimes(
    overtimeIds: number[],
    notes?: string
  ): Promise<{ approved: number; failed: number; errors: string[] }> {
    return apiRequest('/overtime/bulk-approve', {
      method: 'POST',
      body: JSON.stringify({
        overtime_ids: overtimeIds,
        admin_notes: notes,
      }),
    });
  }

  /**
   * Bulk reject multiple overtime requests (admin only)
   */
  async bulkRejectOvertimes(
    overtimeIds: number[],
    notes: string
  ): Promise<{ rejected: number; failed: number; errors: string[] }> {
    return apiRequest('/overtime/bulk-reject', {
      method: 'POST',
      body: JSON.stringify({
        overtime_ids: overtimeIds,
        admin_notes: notes,
      }),
    });
  }

  /**
   * Complete overtime request by uploading evidence and end time
   */
  async completeOvertime(
    id: number, 
    data: {
      end_time: string;
      supporting_document?: File;
      tasks_completed?: string;
    }
  ): Promise<OvertimeRecord> {
    const formData = new FormData();
    
    formData.append('end_time', data.end_time);
    
    if (data.tasks_completed) {
      formData.append('tasks_completed', data.tasks_completed);
    }
    
    if (data.supporting_document) {
      formData.append('supporting_document', data.supporting_document);
    }

    return apiRequest<OvertimeRecord>(`/overtime/${id}/complete`, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }
}

export const overtimeService = new OvertimeService();
