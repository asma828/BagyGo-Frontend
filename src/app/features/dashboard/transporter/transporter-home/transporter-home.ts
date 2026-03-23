import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TripService } from '../../../../core/services/trip.service';
import { OfferService } from '../../../../core/services/offer.service';
import { UserService } from '../../../../core/services/user.service';
import { BaggageRequestService } from '../../../../core/services/baggage-request.service';
import { ToastService } from '../../../../core/services/../services/toast.service';
import { Trip, BaggageRequest } from '../../../../core/models';
import { StatusBadgeComponent } from '../../../../core/components/shared/status-badge/status-badge';

@Component({
  selector: 'app-transporter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  templateUrl: './transporter-home.html',
  styleUrls: ['./transporter-home.scss']
})
export class TransporterDashboardComponent implements OnInit {
  get user() {
    return this.auth.currentUser();
  } loading = signal(true);
  greeting = signal('');

  stats = signal({
    activeTrips: 0,
    offersMade: 0,
    delivered: 0,
    avgRating: 0
  });

  recentTrips = signal<Trip[]>([]);
  recentRequests = signal<BaggageRequest[]>([]);

  // ... (quickActions omitted for brevity in replacement if possible, but I'll keep them for safety)
  quickActions = [
    { icon: '<i class="fa-solid fa-car"></i>', label: 'Post a Trip', route: '/dashboard/transporter/trips/new', color: 'var(--primary)' },
    { icon: '<i class="fa-solid fa-box"></i>', label: 'Browse Requests', route: '/dashboard/transporter/requests', color: 'var(--secondary)' },
    { icon: '<i class="fa-solid fa-message"></i>', label: 'Messages', route: '/dashboard/messages', color: '#667eea' },
    { icon: '<i class="fa-solid fa-star"></i>', label: 'My Ratings', route: '/dashboard/ratings', color: 'var(--accent-dark)' },
  ];

  constructor(
    public auth: AuthService,
    private tripSvc: TripService,
    private userSvc: UserService,
    private reqSvc: BaggageRequestService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    const h = new Date().getHours();
    this.greeting.set(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    // Load trips
    this.tripSvc.getMine().subscribe({
      next: (trips) => {
        this.recentTrips.set(trips.slice(0, 3));
        const active = trips.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
        const delivered = trips.filter(t => t.status === 'COMPLETED').length;
        this.stats.update(s => ({ ...s, activeTrips: active, delivered }));
      }
    });

    // Load requests (Flow A)
    this.reqSvc.getForTransporter().subscribe({
      next: (reqs) => {
        this.recentRequests.set(reqs.slice(0, 3));
        this.stats.update(s => ({ ...s, offersMade: reqs.length }));
      }
    });

    // Load dashboard stats
    this.userSvc.getTransporterDashboard().subscribe({
      next: (dash) => {
        this.stats.update(s => ({
          ...s,
          avgRating: dash.avgRating ?? this.user?.rating ?? 0
        }));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onAcceptRequest(req: BaggageRequest) {
    if (!confirm('Are you sure you want to accept this transport request?')) return;

    this.reqSvc.accept(req.id).subscribe({
      next: () => {
        this.toast.success('Request accepted!', 'The sender has been notified.');
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Please try again.';
        this.toast.error('Failed to accept request', msg);
      }
    });
  }

  onDeclineRequest(req: BaggageRequest) {
    if (!confirm('Are you sure you want to decline this transport request?')) return;

    this.reqSvc.reject(req.id).subscribe({
      next: () => {
        this.toast.warning('Request declined', 'The sender has been notified.');
        this.loadData();
      },
      error: () => this.toast.error('Failed to decline request', 'Please try again.')
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  updateRequestStatus(requestId: number, newStatus: 'IN_TRANSIT' | 'DELIVERED') {
    if (!confirm(`Are you sure you want to mark this request as ${newStatus.replace('_', ' ')}?`)) return;

    this.reqSvc.updateStatus(requestId, newStatus).subscribe({
      next: () => {
        this.toast.success(`Request marked as ${newStatus.replace('_', ' ')}!`, 'The sender has been notified.');
        this.loadData();
      },
      error: (err) => {
        this.toast.error('Failed to update status', err.error?.message || 'Please try again.');
      }
    });
  }
}