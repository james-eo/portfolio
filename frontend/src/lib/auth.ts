export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const auth = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      let errorMessage = 'Login failed';
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${res.status}`;
        }
      } else {
        errorMessage = `Server error: ${res.status}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data: AuthResponse = await res.json();

    // Store token in cookie and localStorage
    this.setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.data));

    return data;
  },

  async logout(): Promise<void> {
    this.clearToken();
    localStorage.removeItem('user');
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;

    // Store in localStorage for client-side access
    localStorage.setItem('authToken', token);

    // Store in cookie for middleware
    document.cookie = `authToken=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;
  },

  clearToken(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; max-age=0';
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  async verifyAuth(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return false;
      const contentType = res.headers.get('content-type');
      return contentType?.includes('application/json') ? res.ok : false;
    } catch {
      return false;
    }
  },
};
