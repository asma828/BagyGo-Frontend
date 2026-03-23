import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaggageRequest } from '../models';

export interface RespondToRequestRequest {
  departureDate: string;
  estimatedArrival: string;
  pricePerKg: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BaggageRequestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/requests`;

  getMine(): Observable<BaggageRequest[]> {
    return this.http.get<BaggageRequest[]>(this.apiUrl);
  }

  getOpen(): Observable<BaggageRequest[]> {
    return this.http.get<BaggageRequest[]>(`${this.apiUrl}/open`);
  }

  getForTransporter(): Observable<BaggageRequest[]> {
    return this.http.get<BaggageRequest[]>(`${this.apiUrl}/transporter`);
  }

  getById(id: number): Observable<BaggageRequest> {
    return this.http.get<BaggageRequest>(`${this.apiUrl}/${id}`);
  }

  respond(id: number, req: RespondToRequestRequest): Observable<BaggageRequest> {
    return this.http.post<BaggageRequest>(`${this.apiUrl}/${id}/respond`, req);
  }

  accept(id: number): Observable<BaggageRequest> {
    return this.http.patch<BaggageRequest>(`${this.apiUrl}/${id}/accept`, {});
  }

  reject(id: number): Observable<BaggageRequest> {
    return this.http.patch<BaggageRequest>(`${this.apiUrl}/${id}/reject`, {});
  }

  create(req: any): Observable<BaggageRequest> {
    return this.http.post<BaggageRequest>(this.apiUrl, req);
  }

  updateStatus(id: number, status: string): Observable<BaggageRequest> {
    return this.http.patch<BaggageRequest>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  cancel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}