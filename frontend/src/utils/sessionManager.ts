/**
 * Session Manager for HRIS Frontend
 * Handles session tracking, token expiration, and automatic logout
 */

export interface SessionData {
  token: string;
  expiresAt: number;
  lastActivity: number;
  userId: string;
}

export interface SessionConfig {
  timeout: number; // in milliseconds (default: 1 hour)
  warningTime: number; // in milliseconds (default: 5 minutes before timeout)
  checkInterval: number; // in milliseconds (default: 30 seconds)
}

class SessionManager {
  private config: SessionConfig;  private timeoutId: NodeJS.Timeout | null = null;
  private warningTimeoutId: NodeJS.Timeout | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private onSessionExpired?: () => void;
  private onSessionWarning?: (timeLeft: number) => void;
  private onRefreshToken?: () => Promise<boolean>;
  private isActive: boolean = false;

  constructor(config?: Partial<SessionConfig>) {
    this.config = {
      timeout: 60 * 60 * 1000, // 1 hour in milliseconds
      warningTime: 5 * 60 * 1000, // 5 minutes in milliseconds
      checkInterval: 30 * 1000, // 30 seconds in milliseconds
      ...config,
    };
  }
  /**
   * Initialize session management
   */
  init(
    onSessionExpired?: () => void,
    onSessionWarning?: (timeLeft: number) => void,
    onRefreshToken?: () => Promise<boolean>
  ): void {
    if (typeof window === 'undefined') return;

    this.onSessionExpired = onSessionExpired;
    this.onSessionWarning = onSessionWarning;
    this.onRefreshToken = onRefreshToken;
    this.isActive = true;

    // Set up activity listeners
    this.setupActivityListeners();

    // Start session monitoring
    this.startMonitoring();

    // Update last activity timestamp
    this.updateActivity();
  }

  /**
   * Destroy session management
   */
  destroy(): void {
    this.isActive = false;
    this.clearAllTimers();
    this.removeActivityListeners();
  }

  /**
   * Create a new session with token
   */
  createSession(token: string, userId: string): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const sessionData: SessionData = {
      token,
      expiresAt: now + this.config.timeout,
      lastActivity: now,
      userId,
    };

    this.saveSessionData(sessionData);
    this.updateActivity();
    this.resetTimers();
  }

  /**
   * Update session activity timestamp
   */
  updateActivity(): void {
    if (typeof window === 'undefined' || !this.isActive) return;

    const sessionData = this.getSessionData();
    if (!sessionData) return;

    const now = Date.now();
    sessionData.lastActivity = now;
    sessionData.expiresAt = now + this.config.timeout;

    this.saveSessionData(sessionData);
    this.resetTimers();
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    const sessionData = this.getSessionData();
    if (!sessionData) return false;

    const now = Date.now();
    return now < sessionData.expiresAt;
  }

  /**
   * Get time remaining in session (in milliseconds)
   */
  getTimeRemaining(): number {
    const sessionData = this.getSessionData();
    if (!sessionData) return 0;

    const now = Date.now();
    return Math.max(0, sessionData.expiresAt - now);
  }

  /**
   * Get session data from storage
   */
  getSessionData(): SessionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem('session_data') || sessionStorage.getItem('session_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  /**
   * Save session data to storage
   */
  private saveSessionData(sessionData: SessionData): void {
    if (typeof window === 'undefined') return;

    try {
      const dataString = JSON.stringify(sessionData);
      // Save to both storages for compatibility
      localStorage.setItem('session_data', dataString);
      sessionStorage.setItem('session_data', dataString);
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  /**
   * Remove session data from storage
   */
  private removeSessionData(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('session_data');
    sessionStorage.removeItem('session_data');
  }
  /**
   * Set up activity event listeners
   */
  private setupActivityListeners(): void {
    if (typeof window === 'undefined') return;

    const events: (keyof DocumentEventMap)[] = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    const activityHandler: EventListener = this.throttle(() => {
      this.updateActivity();
    }, 1000); // Throttle to once per second

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Store reference for cleanup
    this.activityHandler = activityHandler;
    this.activityEvents = events;
  }
  /**
   * Remove activity event listeners
   */
  private removeActivityListeners(): void {
    if (typeof window === 'undefined' || !this.activityHandler || !this.activityEvents) return;

    this.activityEvents.forEach(event => {
      if (this.activityHandler) {
        document.removeEventListener(event, this.activityHandler, true);
      }
    });
  }
  /**
   * Start session monitoring
   */
  private startMonitoring(): void {
    this.intervalId = setInterval(async () => {
      const timeLeft = this.getTimeRemaining();
      
      // Try to refresh token if it's about to expire (5 minutes)
      if (timeLeft > 0 && timeLeft <= 5 * 60 * 1000 && this.onRefreshToken) {
        try {
          const refreshed = await this.onRefreshToken();
          if (refreshed) {
            // Token refreshed successfully, continue monitoring
            return;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
      
      // If token couldn't be refreshed or session expired
      if (!this.isSessionValid()) {
        this.handleSessionExpired();
      }
    }, this.config.checkInterval);
  }

  /**
   * Reset session timers
   */
  private resetTimers(): void {
    this.clearAllTimers();

    const timeRemaining = this.getTimeRemaining();
    if (timeRemaining <= 0) return;

    // Set warning timer
    const warningTime = timeRemaining - this.config.warningTime;
    if (warningTime > 0) {
      this.warningTimeoutId = setTimeout(() => {
        const remaining = this.getTimeRemaining();
        if (remaining > 0 && this.onSessionWarning) {
          this.onSessionWarning(remaining);
        }
      }, warningTime);
    }

    // Set expiration timer
    this.timeoutId = setTimeout(() => {
      this.handleSessionExpired();
    }, timeRemaining);
  }

  /**
   * Clear all timers
   */
  private clearAllTimers(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Handle session expiration
   */
  private handleSessionExpired(): void {
    this.clearAllTimers();
    this.removeSessionData();
    
    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
  }
  /**
   * Throttle function to limit execution frequency
   */
  private throttle(func: () => void, limit: number): EventListener {
    let inThrottle: boolean;
    return function(this: any) {
      if (!inThrottle) {
        func();
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Extend session by updating activity
   */
  extendSession(): void {
    this.updateActivity();
  }

  /**
   * Get formatted time remaining
   */
  getFormattedTimeRemaining(): string {
    const timeLeft = this.getTimeRemaining();
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Store references for cleanup
  private activityHandler?: EventListener;
  private activityEvents?: (keyof DocumentEventMap)[];
}

// Export singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;
