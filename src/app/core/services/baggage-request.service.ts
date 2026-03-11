import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaggageRequest, CreateBaggageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class BaggageRequestService {
  private readonly API = `${environment.apiUrl}/requests`;
  private http = inject(HttpClient);

  /** POST /api/requests — sender creates a new request */
  create(payload: CreateBaggageRequest) {
    return this.http.post<BaggageRequest>(this.API, payload);
  }

  /** GET /api/requests/my — sender's own requests */
  getMine() {
    return this.http.get<BaggageRequest[]>(`${this.API}/my`);
  }

  /** GET /api/requests/open — public open requests (for transporters) */
  getOpen() {
    return this.http.get<BaggageRequest[]>(`${this.API}/open`);
  }

  /** GET /api/requests/:id */
  getById(id: number) {
    return this.http.get<BaggageRequest>(`${this.API}/${id}`);
  }

  /** PATCH /api/requests/:id/cancel */
  cancel(id: number) {
    return this.http.patch<BaggageRequest>(`${this.API}/${id}/cancel`, {});
  }
}