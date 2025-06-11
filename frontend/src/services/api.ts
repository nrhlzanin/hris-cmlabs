const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }  private async handleResponse(response: Response) {
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

  async getAttendanceRecords(params?: Record<string, string>) {
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

  // Letter API methods
  async getLetters(params?: Record<string, string>) {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`${API_BASE_URL}/api/letters?${queryString}`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get letters error:', error);
      throw error;
    }
  }

  async getLetter(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get letter error:', error);
      throw error;
    }
  }

  async createLetter(data: FormData | Record<string, any>) {
    try {
      const isFormData = data instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/api/letters`, {
        method: 'POST',
        headers: isFormData ? {
          'Authorization': this.getAuthHeaders().Authorization,
          'Accept': 'application/json',
        } : this.getAuthHeaders(),
        body: isFormData ? data : JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create letter error:', error);
      throw error;
    }
  }

  async updateLetter(id: number, data: Record<string, any>) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update letter error:', error);
      throw error;
    }
  }

  async deleteLetter(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Delete letter error:', error);
      throw error;
    }
  }

  async getLetterHistory(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}/history`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get letter history error:', error);
      throw error;
    }
  }

  async approveLetter(id: number, description?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}/approve`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ description: description || 'Letter approved by admin' }),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Approve letter error:', error);
      throw error;
    }
  }

  async declineLetter(id: number, description: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/letters/${id}/decline`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ description }),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Decline letter error:', error);
      throw error;
    }
  }

  async getLetterFormats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/available-letter-formats`, {
        headers: this.getAuthHeaders(),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get letter formats error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();