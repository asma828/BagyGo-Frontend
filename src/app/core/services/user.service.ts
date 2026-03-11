import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, SenderDashboard, TransporterDashboard } from '../models';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  /** Get any user's public profile */
  getProfile(userId: number) {
    return this.http.get<User>(`${this.API}/${userId}`);
  }

  /** Update own profile */
  updateProfile(data: Partial<User>) {
    return this.http.patch<User>(`${this.API}/me`, data).pipe(
      tap(updated => this.auth.updateCurrentUser(updated))
    );
  }

  /** Get sender dashboard stats */
  getSenderDashboard() {
    return this.http.get<SenderDashboard>(`${this.API}/me/dashboard/sender`);
  }

  /** Get transporter dashboard stats */
  getTransporterDashboard() {
    return this.http.get<TransporterDashboard>(`${this.API}/me/dashboard/transporter`);
  }
}