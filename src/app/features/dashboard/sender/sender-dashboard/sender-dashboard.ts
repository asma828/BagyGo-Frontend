import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SenderDashboard, BaggageRequest, ActivityItem } from '../../../../core/models';

@Component({
  selector: 'app-sender-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sender-dashboard.html',
  styleUrls: ['./sender-dashboard.scss']
})
export class SenderDashboardComponent implements OnInit {
get user() {
  return this.auth.currentUser();
}  loading = signal(true);

  stats = signal({
    activeRequests: 4,
    offersReceived: 12,
    delivered: 8,
    avgRating: 4.9
  });

  recentActivity = signal<ActivityItem[]>([
    {
      id: 1,
      type: 'NEW_OFFER',
      title: 'New offer received',
      description: 'Yassine B. proposed 130 MAD for Casa → Marrakech',
      timestamp: '2 minutes ago',
      icon: ''
    },
    {
      id: 2,
      type: 'DELIVERED',
      title: 'Bag delivered!',
      description: 'Sara M. delivered your bag: Rabat → Fès',
      timestamp: '1 hour ago',
      icon: ''
    },
    {
      id: 3,
      type: 'RATING',
      title: 'New rating received',
      description: 'Ahmed K. gave you 5 stars ',
      timestamp: '3 hours ago',
      icon: ''
    },
    {
      id: 4,
      type: 'ACCEPTED',
      title: 'Offer accepted',
      description: 'Your offer was accepted: Agadir → Tanger',
      timestamp: 'Yesterday',
      icon: ''
    }
  ]);

  activeRequests = signal<BaggageRequest[]>([
    {
      id: 1,
      sender: null as any,
      departureCity: 'Casablanca',
      arrivalCity: 'Marrakech',
      desiredDate: '2025-12-15',
      weightKg: 8,
      description: 'Clothes and personal items',
      proposedPrice: 150,
      status: 'PENDING',
      isFragile: false,
      createdAt: '2025-12-10T10:00:00',
      offersCount: 3
    },
    {
      id: 2,
      sender: null as any,
      departureCity: 'Rabat',
      arrivalCity: 'Fès',
      desiredDate: '2025-12-18',
      weightKg: 5,
      description: 'Electronic equipment',
      proposedPrice: 80,
      status: 'OPEN',
      isFragile: true,
      createdAt: '2025-12-11T14:00:00',
      offersCount: 1
    },
    {
      id: 3,
      sender: null as any,
      departureCity: 'Agadir',
      arrivalCity: 'Tanger',
      desiredDate: '2025-12-20',
      weightKg: 12,
      description: 'Household items',
      proposedPrice: 200,
      status: 'OPEN',
      isFragile: false,
      createdAt: '2025-12-12T09:00:00',
      offersCount: 0
    }
  ]);

  requestProgress = signal([
    { label: 'Casa → Marrakech', pct: 87, color: 'var(--primary)' },
    { label: 'Rabat → Fès',      pct: 55, color: 'var(--secondary)' },
    { label: 'Agadir → Tanger',  pct: 22, color: 'var(--accent-dark)' }
  ]);

  greeting = signal('');

  constructor(public auth: AuthService) {}

  ngOnInit() {
    const hour = new Date().getHours();
    if (hour < 12)      this.greeting.set('Good morning');
    else if (hour < 18) this.greeting.set('Good afternoon');
    else                this.greeting.set('Good evening');

    setTimeout(() => this.loading.set(false), 600);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      OPEN: 'badge-open',
      PENDING: 'badge-pending',
      ACCEPTED: 'badge-accepted',
      IN_TRANSIT: 'badge-delivered',
      DELIVERED: 'badge-delivered',
      CANCELLED: 'badge-cancelled'
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
      CANCELLED: ' Cancelled'
    };
    return map[status] || status;
  }

  getActivityClass(type: string): string {
    const map: Record<string, string> = {
      NEW_OFFER: 'act-offer',
      DELIVERED: 'act-deliver',
      RATING:    'act-rating',
      ACCEPTED:  'act-accepted',
      MESSAGE:   'act-message'
    };
    return map[type] || 'act-offer';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}