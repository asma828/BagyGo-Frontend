import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SenderDashboard, TransporterDashboard } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users/me/dashboard`;

    getSenderDashboard(): Observable<SenderDashboard> {
        return this.http.get<SenderDashboard>(`${this.apiUrl}/sender`);
    }

    getTransporterDashboard(): Observable<TransporterDashboard> {
        return this.http.get<TransporterDashboard>(`${this.apiUrl}/transporter`);
    }
}
