import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../../../core/services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
      @if (verifying()) {
        <div class="loading loading-spinner loading-lg text-primary mb-6"></div>
        <h1 class="text-2xl font-semibold text-gray-700">Verifying Payment...</h1>
      } @else {
        <div class="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center text-3xl mb-6">
          <i class="fa-solid fa-circle-check text-success"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p class="text-gray-500 mb-8 max-w-md text-center">
          Your payment has been processed successfully. The transporter has been notified.
        </p>
        <a routerLink="/dashboard/sender/requests" class="btn btn-primary">
          Return to My Requests
        </a>
      }
    </div>
  `,
  styles: ``
})
export class PaymentSuccessComponent implements OnInit {
  verifying = signal(true);

  constructor(
    private route: ActivatedRoute,
    private paymentSvc: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      console.log('Payment success page loaded. Session ID:', sessionId);
      if (sessionId) {
        this.paymentSvc.verifySession(sessionId).subscribe({
          next: (res) => {
            console.log('Payment verification response:', res);
            this.verifying.set(false);
          },
          error: (err) => {
            console.error('Session verification failed:', err);
            this.verifying.set(false);
          }
        });
      } else {
        console.warn('No session_id found in URL');
        this.verifying.set(false);
      }
    });
  }
}
