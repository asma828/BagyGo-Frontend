import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StripeSessionResponse {
    sessionId: string;
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    processPayment(requestId: number): Observable<StripeSessionResponse> {
        return this.http.post<StripeSessionResponse>(`${this.apiUrl}/process/${requestId}`, {});
    }

    verifySession(sessionId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/verify/${sessionId}`);
    }
}
