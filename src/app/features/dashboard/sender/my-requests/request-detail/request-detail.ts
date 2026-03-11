import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaggageRequestService } from '../../../../../core/services/baggage-request.service';
import { OfferService } from '../../../../../core/services/offer.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { BaggageRequest, TransportOffer } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { OfferCardComponent } from '../../../../../core/components/offer-card/offer-card';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../../core/components/shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    StatusBadgeComponent, OfferCardComponent,
    EmptyStateComponent, ConfirmDialogComponent
  ],
  templateUrl: './request-detail.html',
  styleUrls: ['./request-detail.scss']
})
export class RequestDetailComponent implements OnInit {
  loading      = signal(true);
  offersLoading = signal(true);
  request      = signal<BaggageRequest | null>(null);
  offers       = signal<TransportOffer[]>([]);
  cancelDialog = signal(false);
  cancelling   = signal(false);
  actionLoading = signal<number | null>(null); // offer id being processed

  constructor(
    private route: ActivatedRoute,
    private requestSvc: BaggageRequestService,
    private offerSvc: OfferService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest(id);
    this.loadOffers(id);
  }

  loadRequest(id: number) {
    this.requestSvc.getById(id).subscribe({
      next:  (r) => { this.request.set(r); this.loading.set(false); },
      error: ()  => { this.toast.error('Request not found'); this.loading.set(false); }
    });
  }

  loadOffers(id: number) {
    this.offerSvc.getForRequest(id).subscribe({
      next:  (o) => { this.offers.set(o); this.offersLoading.set(false); },
      error: ()  => { this.offersLoading.set(false); }
    });
  }

  acceptOffer(offer: TransportOffer) {
    this.actionLoading.set(offer.id);
    this.offerSvc.accept(offer.id).subscribe({
      next: (updated) => {
        this.offers.update(list => list.map(o => o.id === updated.id ? updated : o));
        this.toast.success('Offer accepted! 🎉', 'The transporter will be in touch.');
        // Refresh the request to update status
        this.loadRequest(this.request()!.id);
        this.actionLoading.set(null);
      },
      error: () => {
        this.toast.error('Could not accept offer');
        this.actionLoading.set(null);
      }
    });
  }

  declineOffer(offer: TransportOffer) {
    this.actionLoading.set(offer.id);
    this.offerSvc.decline(offer.id).subscribe({
      next: (updated) => {
        this.offers.update(list => list.map(o => o.id === updated.id ? updated : o));
        this.toast.info('Offer declined');
        this.actionLoading.set(null);
      },
      error: () => {
        this.toast.error('Could not decline offer');
        this.actionLoading.set(null);
      }
    });
  }

  counterOffer(offer: TransportOffer, price: number) {
    this.actionLoading.set(offer.id);
    this.offerSvc.counter(offer.id, price).subscribe({
      next: (updated) => {
        this.offers.update(list => list.map(o => o.id === updated.id ? updated : o));
        this.toast.success('Counter-offer sent!');
        this.actionLoading.set(null);
      },
      error: () => {
        this.toast.error('Could not send counter-offer');
        this.actionLoading.set(null);
      }
    });
  }

  cancelRequest() {
    this.cancelling.set(true);
    this.requestSvc.cancel(this.request()!.id).subscribe({
      next: (updated) => {
        this.request.set(updated);
        this.cancelDialog.set(false);
        this.cancelling.set(false);
        this.toast.warning('Request cancelled');
      },
      error: () => {
        this.toast.error('Could not cancel request');
        this.cancelling.set(false);
      }
    });
  }

  get pendingOffers() { return this.offers().filter(o => o.status === 'PENDING'); }
  get otherOffers()   { return this.offers().filter(o => o.status !== 'PENDING'); }

  canCancel(): boolean {
    const s = this.request()?.status;
    return s === 'OPEN' || s === 'PENDING';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}