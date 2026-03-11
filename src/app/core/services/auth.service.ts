import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError, EMPTY } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API      = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'bagygo_token';
  private readonly USER_KEY  = 'bagygo_user';  

  private http   = inject(HttpClient);
  private router = inject(Router);

  // ── Reactive state ────────────────────────────────────
  private _currentUser = signal<User | null>(this.loadUser());
  private _token       = signal<string | null>(this.loadToken());

  readonly currentUser    = this._currentUser.asReadonly();
  readonly token          = this._token.asReadonly();
  readonly isLoggedIn     = computed(() => !!this._token() && !this.isTokenExpired());
  readonly isExpéditeur   = computed(() => this._currentUser()?.role === 'EXPEDITEUR');
  readonly isTransporteur = computed(() => this._currentUser()?.role === 'TRANSPORTEUR');

  // ── Public methods ────────────────────────────────────
  login(req: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.API}/login`, req).pipe(
      tap(res => this.setSession(res)),
      catchError(err => throwError(() => err))
    );
  }

  register(req: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.API}/register`, req).pipe(
      tap(res => this.setSession(res)),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Called once on app init — refreshes user from backend
   * so UI stays in sync with the latest profile data (rating, deliveries, etc.)
   */
  refreshCurrentUser() {
    if (!this.isLoggedIn()) return EMPTY;

    return this.http.get<User>(`${this.API}/me`).pipe(
      tap(user => this.updateCurrentUser(user)),
      catchError(() => {
        // Token invalid / expired server-side → force logout
        this.logout();
        return EMPTY;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { return this._token(); }

  updateCurrentUser(user: User) {
    this._currentUser.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // ── Helpers ───────────────────────────────────────────
  private setSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this._token.set(res.token);
    this._currentUser.set(res.user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    try { return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }

  private isTokenExpired(): boolean {
    const token = this._token();
    if (!token) return true;
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}