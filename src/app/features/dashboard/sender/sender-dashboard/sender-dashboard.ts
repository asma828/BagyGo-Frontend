import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { TripService } from '../../../../core/services/trip.service';
import { SenderDashboard, BaggageRequest, ActivityItem, Trip } from '../../../../core/models';
import { RouteCardComponent } from '../../../../core/components/route-card/route-card';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia',
  'Khouribga', 'El Jadida', 'Béni Mellal', 'Nador', 'Laâyoune', 'Settat'
];

import { BaggageRequestService } from '../../../../core/services/baggage-request.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-sender-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, RouteCardComponent],
  templateUrl: './sender-dashboard.html',
  styleUrls: ['./sender-dashboard.scss']
})
export class SenderDashboardComponent implements OnInit {
  private baggageSvc = inject(BaggageRequestService);
  private toast = inject(ToastService);
  private dashboardSvc = inject(DashboardService);
  private tripSvc = inject(TripService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = signal(true);
  searchLoading = signal(false);
  greeting = signal('');
  cities = MOROCCAN_CITIES;

  stats = signal({
    activeRequests: 0,
    offersReceived: 0,
    delivered: 0,
    pendingPayments: 0,
    avgRating: 0
  });

  recentActivity = signal<ActivityItem[]>([]);
  activeRequests = signal<BaggageRequest[]>([]);
  availableTrips = signal<Trip[]>([]);
  searchResults = signal<Trip[]>([]);
  hasSearched = signal(false);

  searchForm: FormGroup;

  constructor(public auth: AuthService) {
    this.searchForm = this.fb.group({
      pickupCity: [''],
      deliveryCity: ['']
    });
  }

  get user() {
    return this.auth.currentUser();
  }

  ngOnInit() {
    this.updateGreeting();
    this.loadDashboardData();
  }

  private updateGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting.set('Good morning');
    else if (hour < 18) this.greeting.set('Good afternoon');
    else this.greeting.set('Good evening');
  }

  private loadDashboardData() {
    this.loading.set(true);
    this.dashboardSvc.getSenderDashboard().subscribe({
      next: (data: SenderDashboard) => {
        console.log('Sender Dashboard Data:', data);
        this.stats.set({
          activeRequests: data.activeRequests,
          offersReceived: data.offersReceived,
          delivered: data.delivered,
          pendingPayments: data.pendingPayments,
          avgRating: data.avgRating
        });
        this.recentActivity.set(data.recentActivity);
        this.activeRequests.set(data.activeRequestsList);
        this.availableTrips.set(data.availableTrips);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() {
    const { pickupCity, deliveryCity } = this.searchForm.value;

    if (!pickupCity && !deliveryCity) {
      this.hasSearched.set(false);
      this.searchResults.set([]);
      return;
    }

    this.hasSearched.set(true);
    const filterFrom = pickupCity.toLowerCase();
    const filterTo = deliveryCity.toLowerCase();

    const filtered = this.availableTrips().filter(trip => {
      const matchFrom = !filterFrom || trip.departureCity.toLowerCase().includes(filterFrom);
      const matchTo = !filterTo || trip.arrivalCity.toLowerCase().includes(filterTo);
      return matchFrom && matchTo;
    });

    this.searchResults.set(filtered);
  }

  clearSearch() {
    this.searchForm.reset();
    this.hasSearched.set(false);
    this.searchResults.set([]);
  }

  viewTripDetails(trip: Trip) {
    this.router.navigate(['/dashboard/sender/requests/new'], {
      queryParams: {
        tripId: trip.id,
        pickupCity: trip.departureCity,
        deliveryCity: trip.arrivalCity,
        date: trip.departureDate ? trip.departureDate.split('T')[0] : ''
      }
    });
  }

  onAccept(requestId: number) {
    this.baggageSvc.accept(requestId).subscribe({
      next: () => {
        this.toast.success('Accepted', 'You have accepted this transport offer.');
        this.loadDashboardData();
      },
      error: (err) => this.toast.error('Error', err.error?.message || 'Failed to accept offer.')
    });
  }

  onReject(requestId: number) {
    if (!confirm('Are you sure you want to reject this offer?')) return;
    this.baggageSvc.reject(requestId).subscribe({
      next: () => {
        this.toast.success('Rejected', 'Offer declined.');
        this.loadDashboardData();
      },
      error: (err) => this.toast.error('Error', err.error?.message || 'Failed to reject offer.')
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      OPEN: 'badge-open',
      PENDING: 'badge-pending',
      ACCEPTED: 'badge-accepted',
      IN_TRANSIT: 'badge-delivered',
      DELIVERED: 'badge-delivered',
      COMPLETED: 'badge-delivered',
      CANCELLED: 'badge-cancelled',
      REJECTED: 'badge-cancelled'
    };
    return map[status] || 'badge-open';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      OPEN: ' Open',
      PENDING: ' Pending',
      ACCEPTED: ' Accepted',
      IN_TRANSIT: ' In Transit',
      DELIVERED: ' Delivered',
      COMPLETED: ' Completed',
      CANCELLED: ' Cancelled',
      REJECTED: ' Rejected'
    };
    return map[status] || status;
  }

  getActivityClass(type: string): string {
    const map: Record<string, string> = {
      NEW_OFFER: 'act-offer',
      DELIVERED: 'act-deliver',
      RATING: 'act-rating',
      ACCEPTED: 'act-accepted',
      MESSAGE: 'act-message'
    };
    return map[type] || 'act-offer';
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
