import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Rating, RatingSummary, ApiResponse } from '../models';

export interface CreateRating {
  requestId: number;
  score: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly API = `${environment.apiUrl}/ratings`;
  private http = inject(HttpClient);

  create(payload: CreateRating) {
    return this.http.post<Rating>(this.API, payload);
  }

  submit(payload: CreateRating) {
    return this.create(payload);
  }

  getUserRatings(userId: number) {
    return this.http.get<Rating[]>(`${this.API}/user/${userId}`);
  }

  getMyRatings() {
    return this.http.get<Rating[]>(`${this.API}/my-ratings`);
  }

  getMySummary() {
    return this.http.get<RatingSummary>(`${this.API}/my-summary`);
  }

  getRatableTransporters() {
    return this.http.get<any[]>(`${this.API}/ratable-transporters`);
  }
}