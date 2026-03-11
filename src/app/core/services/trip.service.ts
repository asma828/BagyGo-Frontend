import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Trip, CreateTripRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class TripService {
  private readonly API = `${environment.apiUrl}/trips`;
  private http = inject(HttpClient);

  /** POST /api/trips — transporter posts a new trip */
  create(payload: CreateTripRequest) {
    return this.http.post<Trip>(this.API, payload);
  }

  /** GET /api/trips/my — transporter's own trips */
  getMine() {
    return this.http.get<Trip[]>(`${this.API}/my`);
  }

  /** GET /api/trips/open — all open trips (for senders to browse) */
  getOpen() {
    return this.http.get<Trip[]>(`${this.API}/open`);
  }

  /** GET /api/trips/:id */
  getById(id: number) {
    return this.http.get<Trip>(`${this.API}/${id}`);
  }

  /** PATCH /api/trips/:id/cancel */
  cancel(id: number) {
    return this.http.patch<Trip>(`${this.API}/${id}/cancel`, {});
  }
}