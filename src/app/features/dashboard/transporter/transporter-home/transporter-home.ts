import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TripService } from '../../../../core/services/trip.service';
import { OfferService } from '../../../../core/services/offer.service';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/../services/toast.service';
import { Trip, TransportOffer } from '../../../../core/models';
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
}  loading  = signal(true);
  greeting = signal('');

  stats = signal({
    activeTrips:  0,
    offersMade:   0,
    delivered:    0,
    avgRating:    0
  });

  recentTrips  = signal<Trip[]>([]);
  recentOffers = signal<TransportOffer[]>([]);

  quickActions = [
    { icon: '🚗', label: 'Post a Trip',       route: '/dashboard/transporter/trips/new',      color: 'var(--primary)' },
    { icon: '📦', label: 'Browse Requests',   route: '/dashboard/transporter/requests',        color: 'var(--secondary)' },
    { icon: '💬', label: 'Messages',          route: '/dashboard/messages',                    color: '#667eea' },
    { icon: '⭐', label: 'My Ratings',        route: '/dashboard/ratings',                     color: 'var(--accent-dark)' },
  ];

  constructor(
    public auth: AuthService,
    private tripSvc: TripService,
    private offerSvc: OfferService,
    private userSvc: UserService,
    private toast: ToastService
  ) {}

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

    // Load offers
    this.offerSvc.getMine().subscribe({
      next: (offers) => {
        this.recentOffers.set(offers.slice(0, 3));
        this.stats.update(s => ({ ...s, offersMade: offers.length }));
      }
    });

    // Load dashboard stats
    this.userSvc.getTransporterDashboard().subscribe({
      next: (dash) => {
        this.stats.set({
          activeTrips: dash.activeTrips,
          offersMade:  dash.offersMade,
          delivered:   dash.delivered,
          avgRating:   dash.avgRating ?? this.user?.rating ?? 0
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}