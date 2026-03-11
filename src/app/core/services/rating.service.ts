import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Rating, RatingSummary, CreateRatingRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly API = `${environment.apiUrl}/ratings`;
  private http = inject(HttpClient);

  /** POST /api/ratings — submit a rating for a user */
  submit(payload: CreateRatingRequest) {
    return this.http.post<Rating>(this.API, payload);
  }

  /** GET /api/ratings/me/summary — current user's rating summary */
  getMySummary() {
    return this.http.get<RatingSummary>(`${this.API}/me/summary`);
  }

  /** GET /api/ratings/me — full list of ratings received */
  getMyRatings() {
    return this.http.get<Rating[]>(`${this.API}/me`);
  }

  /** GET /api/ratings/user/:id/summary — public summary for any user */
  getSummaryForUser(userId: number) {
    return this.http.get<RatingSummary>(`${this.API}/user/${userId}/summary`);
  }
}