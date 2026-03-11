import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TransportOffer, CreateOfferRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly API = `${environment.apiUrl}/offers`;
  private http = inject(HttpClient);

  /** GET /api/offers/request/:requestId — offers on a specific request */
  getForRequest(requestId: number) {
    return this.http.get<TransportOffer[]>(`${this.API}/request/${requestId}`);
  }

  /** GET /api/offers/my — transporter's own offers */
  getMine() {
    return this.http.get<TransportOffer[]>(`${this.API}/my`);
  }

  /** POST /api/offers — transporter makes an offer */
  create(payload: CreateOfferRequest) {
    return this.http.post<TransportOffer>(this.API, payload);
  }

  /** PATCH /api/offers/:id/accept */
  accept(id: number) {
    return this.http.patch<TransportOffer>(`${this.API}/${id}/accept`, {});
  }

  /** PATCH /api/offers/:id/decline */
  decline(id: number) {
    return this.http.patch<TransportOffer>(`${this.API}/${id}/decline`, {});
  }

  /** PATCH /api/offers/:id/counter */
  counter(id: number, proposedPrice: number) {
    return this.http.patch<TransportOffer>(`${this.API}/${id}/counter`, { proposedPrice });
  }
}