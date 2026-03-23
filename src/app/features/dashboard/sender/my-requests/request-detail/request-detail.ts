import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaggageRequestService } from '../../../../../core/services/baggage-request.service';
import { OfferService } from '../../../../../core/services/offer.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { BaggageRequest, TransportOffer } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { OfferCardComponent } from '../../../../../core/components/offer-card/offer-card';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../../core/components/shared/confirm-dialog/confirm-dialog';
import { MapComponent } from '../../../../../core/components/shared/map/map.component';
import { TripService } from '../../../../../core/services/trip.service';
import { PaymentService } from '../../../../../core/services/payment.service';
import { OnDestroy } from '@angular/core';
import { Subscription, interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    StatusBadgeComponent, OfferCardComponent,
    EmptyStateComponent, ConfirmDialogComponent, MapComponent
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
  payingId     = signal<number | null>(null);
  actionLoading = signal<number | null>(null); // offer id being processed

  // Polling for location
  private pollingSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private requestSvc: BaggageRequestService,
    private offerSvc: OfferService,
    private tripSvc: TripService,
    private paymentSvc: PaymentService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest(id);
    this.loadOffers(id);
  }

  loadRequest(id: number) {
    this.requestSvc.getById(id).subscribe({
      next:  (r) => { 
        this.request.set(r); 
        this.loading.set(false);
        if (r.status === 'IN_TRANSIT' && r.trip) {
          this.startLocationPolling(r.trip.id);
        } else {
          this.stopLocationPolling();
        }
      },
      error: ()  => { this.toast.error('Request not found'); this.loading.set(false); }
    });
  }

  startLocationPolling(tripId: number) {
    if (this.pollingSub) return;
    
    this.pollingSub = interval(10000).pipe(
      startWith(0),
      switchMap(() => this.tripSvc.getById(tripId))
    ).subscribe({
      next: (updatedTrip) => {
        this.request.update(req => {
          if (!req) return null;
          return { ...req, trip: updatedTrip };
        });
      },
      error: (err) => console.error('Error polling location:', err)
    });
  }

  stopLocationPolling() {
    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;
  }

  ngOnDestroy() {
    this.stopLocationPolling();
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

  proceedToPayment() {
    const req = this.request();
    if (!req) return;
    this.payingId.set(req.id);
    this.paymentSvc.processPayment(req.id).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to initiate payment');
        this.payingId.set(null);
      }
    });
  }

  confirmDelivery() {
    const req = this.request();
    if (!req || !confirm('Have you received your package? This will complete the delivery process.')) return;

    this.requestSvc.updateStatus(req.id, 'COMPLETED').subscribe({
      next: (updated) => {
        this.request.set(updated);
        this.toast.success('Delivery confirmed!', 'Thank you for using BagyGo.');
        this.router.navigate(['/dashboard/sender']);
      },
      error: (err) => {
        console.error('Confirm delivery error:', err);
        this.toast.error('Failed to confirm delivery. ' + (err.error?.message || ''));
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