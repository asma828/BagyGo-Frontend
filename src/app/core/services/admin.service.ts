import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // ── User Management ───────────────────────────────────
  getUsers(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}/users`, { params });
  }

  searchUsers(query: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.apiUrl}/users/search`, { params });
  }

  updateBanStatus(userId: number, banned: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/ban`, null, {
      params: { banned: banned.toString() }
    });
  }

  // ── Transporter Verification ──────────────────────────
  getPendingVerifications(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}/verifications/pending`, { params });
  }

  verifyTransporter(userId: number, approve: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/verifications/${userId}/approve`, null, {
      params: { approve: approve.toString() }
    });
  }

  // ── Monitoring ────────────────────────────────────────
  getTrips(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}/trips`, { params });
  }

  getRequests(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}/requests`, { params });
  }

  getPayments(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}/payments`, { params });
  }

  // ── Statistics ───────────────────────────────────────
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
