const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AttendanceRecord {
  id: number;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  status: string;
  statusColor: string;
}

export interface AttendanceFilters {
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  type?: string;
  per_page?: number;
}

export interface AttendanceResponse {
  success: boolean;
  data: AttendanceRecord[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  today_status: {
    date: string;
    formatted_date: string;
    clock_in: string | null;
    clock_out: string | null;
    work_hours: string | null;
    status: string;
    break_start: string | null;
    break_end: string | null;
  };
  filters_applied: AttendanceFilters;
}

class AttendanceService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
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
   * Get user's attendance records with optional filters
   */
  async getAttendanceRecords(filters: AttendanceFilters = {}): Promise<AttendanceResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.search) params.append('search', filters.search);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.status && filters.status !== 'All Status') params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/check-clock${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get attendance records error:', error);
      throw error;
    }
  }

  /**
   * Get today's attendance status
   */
  async getTodayStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/today-status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get today status error:', error);
      throw error;
    }
  }

  /**
   * Get attendance summary (Admin only)
   */
  async getAttendanceSummary(startDate?: string, endDate?: string) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/check-clock/attendance-summary${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get attendance summary error:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
