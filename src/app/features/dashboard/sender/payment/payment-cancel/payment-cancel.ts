import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-payment-cancel',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div class="w-16 h-16 bg-error/20 text-error rounded-full flex items-center justify-center text-3xl mb-6">
        <i class="fa-solid fa-circle-xmark text-danger"></i>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
      <p class="text-gray-500 mb-8 max-w-md text-center">
        The payment checkout was cancelled. You can try again later.
      </p>
      <div class="flex gap-4">
        <a routerLink="/dashboard/sender/requests" class="btn btn-outline">
          Return to Details
        </a>
      </div>
    </div>
  `,
    styles: ``
})
export class PaymentCancelComponent { }
