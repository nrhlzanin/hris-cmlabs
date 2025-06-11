/**
 * Authentication Service for HRIS Frontend
 * Handles all authentication-related API calls and token management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  nik: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  mobile_phone?: string;
  last_login_at?: string;
  email_verified_at?: string;
}

export interface Employee {
  nik: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  position: string;
  branch: string;
  contract_type: string;
  grade: string;
  avatar_url?: string;
  mobile_phone: string;
  date_of_birth: string;
  place_of_birth: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    employee?: Employee;
    token: string;
    token_type: string;
  };
  errors?: Record<string, string[]>;
}

export interface LoginData {
  login: string; // email, phone, username, or NIK
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile_phone?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  private getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
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
  // Token Management
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token: string, remember: boolean = true): void {
    if (typeof window !== 'undefined') {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('auth_token', token);
      // Remove from the other storage
      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem('auth_token');
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      sessionStorage.removeItem('user_data');
    }
  }

  // User Data Management
  getUserData(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  setUserData(user: User, remember: boolean = true): void {
    if (typeof window !== 'undefined') {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('user_data', JSON.stringify(user));
      // Remove from the other storage
      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem('user_data');
    }
  }

  // Authentication State
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUserData();
    return user?.role === 'admin' || user?.role === 'super_admin';
  }

  isSuperAdmin(): boolean {
    const user = this.getUserData();
    return user?.role === 'super_admin';
  }

  // API Methods
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUserData(response.data.user);
    }

    return response;
  }
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      const remember = data.remember || false;
      this.setToken(response.data.token, remember);
      this.setUserData(response.data.user, remember);
    }

    return response;
  }

  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/login/google', {
      method: 'POST',
      body: JSON.stringify({ google_token: googleToken }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setUserData(response.data.user);
    }

    return response;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    return await this.makeRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    return await this.makeRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<{ success: boolean; data?: { user: User; employee: Employee } }> {
    return await this.makeRequest('/profile', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    return await this.makeRequest('/change-password', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      this.removeToken();
      return response;
    } catch (error) {
      // Even if the API call fails, remove local tokens
      this.removeToken();
      throw error;
    }
  }

  async logoutFromAllDevices(): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/logout-all-devices', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      this.removeToken();
      return response;
    } catch (error) {
      // Even if the API call fails, remove local tokens
      this.removeToken();
      throw error;
    }
  }

  // Route helpers
  getRedirectPath(user: User): string {
    if (user.role === 'super_admin' || user.role === 'admin') {
      return '/admin';
    }
    return '/user';
  }

  // Validation helpers
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
