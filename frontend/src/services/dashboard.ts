import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for dashboard data
export interface AttendanceSummary {
  total_employees: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  early_leave_today: number;
  attendance_rate: number;
}

export interface EmployeeStats {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  departments: Array<{
    department: string;
    count: number;
  }>;
}

export interface RecentActivity {
  id: number;
  employee_name: string;
  action: string;
  time: string;
  status: string;
}

export interface DashboardOverview {
  attendance: AttendanceSummary;
  employees: EmployeeStats;
  recent_activities: RecentActivity[];
  weekly_attendance: Array<{
    date: string;
    present: number;
    absent: number;
    total: number;
  }>;
}

export interface TodayStatus {
  employee_id: number;
  employee_name: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  work_hours: string | null;
}

class DashboardService {  private getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }
  // Get attendance summary for today
  async getAttendanceSummary(): Promise<AttendanceSummary> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-clock/dashboard-attendance-summary`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      throw new Error('Failed to fetch attendance summary');
    }
  }
  // Get employee statistics (using attendance summary for now)
  async getEmployeeStats(): Promise<EmployeeStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-clock/dashboard-attendance-summary`, {
        headers: this.getAuthHeaders()
      });
      const data = response.data.data;
      
      // Transform attendance data to employee stats format
      return {
        total_employees: data.total_employees,
        active_employees: data.total_employees, // Assuming all employees are active
        inactive_employees: 0,
        departments: [] // This would need a separate endpoint for department data
      };
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      throw new Error('Failed to fetch employee statistics');
    }
  }
  // Get today's attendance status for all employees
  async getTodayStatus(): Promise<TodayStatus[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-clock/all-employees-today-status`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching today status:', error);
      throw new Error('Failed to fetch today status');
    }
  }

  // Get recent activities
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-clock/recent-activities?limit=${limit}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }
  // Get weekly attendance data for charts
  async getWeeklyAttendance(): Promise<Array<{
    date: string;
    present: number;
    absent: number;
    total: number;
  }>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-clock/weekly-attendance`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching weekly attendance:', error);
      throw new Error('Failed to fetch weekly attendance');
    }
  }
  // Get complete dashboard overview (combines multiple endpoints)
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const [attendance, employees, recentActivities, weeklyAttendance] = await Promise.all([
        this.getAttendanceSummary(),
        this.getEmployeeStats(),
        this.getRecentActivities(5),
        this.getWeeklyAttendance()
      ]);

      return {
        attendance,
        employees,
        recent_activities: recentActivities,
        weekly_attendance: weeklyAttendance
      };
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw new Error('Failed to fetch dashboard overview');
    }
  }
}

export const dashboardService = new DashboardService();