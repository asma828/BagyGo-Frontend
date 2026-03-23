import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaggageRequestService } from '../../../../../core/services/baggage-request.service';
import { OfferService } from '../../../../../core/services/offer.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PaymentService } from '../../../../../core/services/payment.service';
import { BaggageRequest } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../../core/components/shared/confirm-dialog/confirm-dialog';

type FilterStatus = 'ALL' | 'OPEN' | 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StatusBadgeComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './request-list.html',
  styleUrls: ['./request-list.scss']
})
export class RequestListComponent implements OnInit {
  loading = signal(true);
  requests = signal<BaggageRequest[]>([]);
  activeFilter = signal<FilterStatus>('ALL');
  cancelTarget = signal<BaggageRequest | null>(null);
  cancelling = signal(false);
  payingId = signal<number | null>(null);

  filters: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'ALL' },
    { label: '<i class="fa-solid fa-circle text-success"></i> Open', value: 'OPEN' },
    { label: '<i class="fa-solid fa-hourglass-half"></i> Pending', value: 'PENDING' },
    { label: '<i class="fa-solid fa-circle-check text-success"></i> Accepted', value: 'ACCEPTED' },
    { label: '<i class="fa-solid fa-truck-fast"></i> Transit', value: 'IN_TRANSIT' },
    { label: '<i class="fa-solid fa-box-open"></i> Delivered', value: 'DELIVERED' },
  ];

  filtered = computed(() => {
    const f = this.activeFilter();
    if (f === 'ALL') return this.requests();
    return this.requests().filter(r => r.status === f);
  });

  counts = computed(() => {
    const all = this.requests();
    return {
      total: all.length,
      open: all.filter(r => r.status === 'OPEN').length,
      pending: all.filter(r => r.status === 'PENDING').length,
      accepted: all.filter(r => r.status === 'ACCEPTED').length,
      delivered: all.filter(r => r.status === 'DELIVERED').length,
    };
  });

  constructor(
    private requestSvc: BaggageRequestService,
    private paymentSvc: PaymentService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.requestSvc.getMine().subscribe({
      next: (data) => { this.requests.set(data); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load requests'); this.loading.set(false); }
    });
  }

  setFilter(f: FilterStatus) { this.activeFilter.set(f); }

  askCancel(req: BaggageRequest) { this.cancelTarget.set(req); }

  confirmCancel() {
    const req = this.cancelTarget();
    if (!req) return;
    this.cancelling.set(true);
    this.requestSvc.cancel(req.id).subscribe({
      next: (updated) => {
        this.requests.update(list => list.map(r => r.id === updated.id ? updated : r));
        this.toast.success('Request cancelled');
        this.cancelTarget.set(null);
        this.cancelling.set(false);
      },
      error: () => {
        this.toast.error('Could not cancel request');
        this.cancelling.set(false);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  canCancel(req: BaggageRequest): boolean {
    return req.status === 'OPEN' || req.status === 'PENDING';
  }

  proceedToPayment(requestId: number) {
    this.payingId.set(requestId);
    this.paymentSvc.processPayment(requestId).subscribe({
      next: (res) => {
        // Redirect completely to Stripe Checkout
        window.location.href = res.url;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to initiate payment');
        this.payingId.set(null);
      }
    });
  }

  confirmDelivery(requestId: number) {
    if (!confirm('Have you received your package? This will complete the delivery process.')) return;

    this.requestSvc.updateStatus(requestId, 'COMPLETED').subscribe({
      next: (updated) => {
        this.requests.update(list => list.map(r => r.id === updated.id ? updated : r));
        this.toast.success('Delivery confirmed!', 'Thank you for using BagyGo.');
        this.router.navigate(['/dashboard/sender']);
      },
      error: () => this.toast.error('Failed to confirm delivery')
    });
  }
}