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

export interface CheckClockRecord {
  id: number;
  user_id: number;
  check_clock_type: 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
  check_clock_time: string;
  latitude: number;
  longitude: number;
  address: string;
  supporting_evidence?: string;
  created_at: string;
  updated_at: string;
  user: {
    id_users: number;
    name: string;
    email: string;
    employee?: {
      id: number;
      first_name: string;
      last_name: string;
      position?: string;
    };
  };
}

export interface AdminAttendanceRecord {
  proof_file_url: any;
  id: number;
  name: string;
  position: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  approved: boolean | null;
  user_id: number;
  date: string;
  records: CheckClockRecord[];
  approval_status?: 'pending' | 'approved' | 'declined';
  approved_by?: number;
  approved_at?: string;
  admin_notes?: string;
  is_manual_entry?: boolean;
}

export interface AttendanceFilters {
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  type?: string;
  per_page?: number;
  employee_id?: number;
  page?: number;
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
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
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

export interface AdminAttendanceResponse {
  success: boolean;
  data: AdminAttendanceRecord[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
  today_status?: any;
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

  /**
   * Get all employees' check clock records for admin (Admin only)
   */
  async getAdminCheckClockRecords(filters: AttendanceFilters = {}): Promise<AdminAttendanceResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.search) params.append('search', filters.search);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.status && filters.status !== 'All Status') params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.employee_id) params.append('employee_id', filters.employee_id.toString());

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/check-clock${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      
      // Transform the backend data to match frontend expectations
      const transformedData = this.transformBackendDataForAdmin(result.data);
      
      return {
        ...result,
        data: transformedData
      };
    } catch (error) {
      console.error('Get admin check clock records error:', error);
      throw error;
    }
  }

  /**
   * Transform backend grouped data to admin attendance records
   */
  private transformBackendDataForAdmin(backendData: any[]): AdminAttendanceRecord[] {
    const adminRecords: AdminAttendanceRecord[] = [];
    
    backendData.forEach(dateGroup => {
      const date = dateGroup.date;
      const records = dateGroup.records || [];
      
      // Group by user for each date
      const userGroups = records.reduce((acc: any, record: CheckClockRecord) => {
        const userId = record.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user: record.user,
            records: []
          };
        }
        acc[userId].records.push(record);
        return acc;
      }, {});

      // Create admin record for each user on this date
      Object.values(userGroups).forEach((userGroup: any) => {
        const user = userGroup.user;
        const userRecords = userGroup.records;
        
        const clockInRecord = userRecords.find((r: CheckClockRecord) => r.check_clock_type === 'clock_in');
        const clockOutRecord = userRecords.find((r: CheckClockRecord) => r.check_clock_type === 'clock_out');
          const clockIn = clockInRecord ? this.formatTime(clockInRecord.check_clock_time) : '-';
        const clockOut = clockOutRecord ? this.formatTime(clockOutRecord.check_clock_time) : '-';
        const workHours = this.calculateWorkHours(clockInRecord?.check_clock_time, clockOutRecord?.check_clock_time);
        
        // Use the actual CheckClock record ID for approval/decline operations
        // Prefer clock_in record ID, fallback to first available record ID
        const recordId = clockInRecord?.id || userRecords[0]?.id;
        
        // Determine approval status from records (assuming it's on the individual records)
        const firstRecord = userRecords[0];
        const approvalStatus = firstRecord?.approval_status || 'pending';
        const approvedBy = firstRecord?.approved_by;
        const approvedAt = firstRecord?.approved_at;
        const adminNotes = firstRecord?.admin_notes;
        const isManualEntry = firstRecord?.is_manual_entry || false;
        
        adminRecords.push({
          id: recordId,
          name: user.employee ? `${user.employee.first_name} ${user.employee.last_name}` : user.name,
          position: user.employee?.position || 'N/A',
          clockIn,
          clockOut,
          workHours,
          approved: approvalStatus === 'approved' ? true : approvalStatus === 'declined' ? false : null,
          user_id: user.id_users,
          date,
          records: userRecords,
          approval_status: approvalStatus,
          approved_by: approvedBy,
          approved_at: approvedAt,
          admin_notes: adminNotes,
          is_manual_entry: isManualEntry
        });
      });
    });
    
    return adminRecords;
  }

  /**
   * Format time to Jakarta timezone
   */
  private formatTime(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + ' WIB';
    } catch (error) {
      return '-';
    }
  }
  /**
   * Calculate work hours between clock in and clock out
   */
  private calculateWorkHours(clockInTime?: string, clockOutTime?: string): string {
    if (!clockInTime || !clockOutTime) return '-';
    
    try {
      const clockIn = new Date(clockInTime);
      const clockOut = new Date(clockOutTime);
      const diffMs = clockOut.getTime() - clockIn.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${diffHours}h ${diffMinutes}m`;
    } catch (error) {
      return '-';
    }
  }

  /**
   * Admin approve attendance record
   */
  async approveAttendance(recordId: number, notes?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/${recordId}/approve`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          admin_notes: notes || ''
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Approve attendance error:', error);
      throw error;
    }
  }

  /**
   * Admin decline attendance record
   */
  async declineAttendance(recordId: number, notes: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/${recordId}/decline`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          admin_notes: notes
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Decline attendance error:', error);
      throw error;
    }
  }

  /**
   * Admin manual check-in for user
   */
  async manualCheckIn(data: {
    user_id: number;
    check_clock_type: 'clock_in' | 'clock_out' | 'break_start' | 'break_end';
    check_clock_time: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    admin_notes?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/manual`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Manual check-in error:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
