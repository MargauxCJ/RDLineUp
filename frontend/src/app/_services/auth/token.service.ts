import {jwtDecode, JwtPayload} from 'jwt-decode';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey = 'userToken';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp ? decoded.exp > Date.now() / 1000 : false;
    } catch {
      return false;
    }
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || '';
    } catch {
      return '';
    }
  }
}
