const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
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

  async checkClockIn(data: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/clock-in`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeaders().Authorization,
          'Accept': 'application/json',
          // Don't set Content-Type for FormData
        },
        body: data,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Clock in error:', error);
      throw error;
    }
  }

  async checkClockOut(data: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/clock-out`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeaders().Authorization,
          'Accept': 'application/json',
        },
        body: data,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Clock out error:', error);
      throw error;
    }
  }

  async breakStart(data: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/break-start`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeaders().Authorization,
          'Accept': 'application/json',
        },
        body: data,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Break start error:', error);
      throw error;
    }
  }

  async breakEnd(data: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/break-end`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeaders().Authorization,
          'Accept': 'application/json',
        },
        body: data,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Break end error:', error);
      throw error;
    }
  }

  async getAttendanceRecords(params?: any) {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`${API_BASE_URL}/api/check-clock?${queryString}`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get attendance error:', error);
      throw error;
    }
  }

  async getTodayStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-clock/today-status`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get today status error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();