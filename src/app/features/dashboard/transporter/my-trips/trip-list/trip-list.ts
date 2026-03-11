import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService } from '../../../../../core/services/trip.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Trip } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../../core/components/shared/confirm-dialog/confirm-dialog';

type FilterStatus = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.scss']
})
export class TripListComponent implements OnInit {
  loading      = signal(true);
  trips        = signal<Trip[]>([]);
  activeFilter = signal<FilterStatus>('ALL');
  cancelTarget = signal<Trip | null>(null);
  cancelling   = signal(false);

  filters: { label: string; value: FilterStatus }[] = [
    { label: 'All',          value: 'ALL'         },
    { label: '🟢 Open',      value: 'OPEN'        },
    { label: '🚗 In Progress',value: 'IN_PROGRESS' },
    { label: '🏁 Completed', value: 'COMPLETED'   },
  ];

  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'ALL' ? this.trips() : this.trips().filter(t => t.status === f);
  });

  counts = computed(() => {
    const all = this.trips();
    return {
      total:      all.length,
      open:       all.filter(t => t.status === 'OPEN').length,
      active:     all.filter(t => t.status === 'IN_PROGRESS').length,
      completed:  all.filter(t => t.status === 'COMPLETED').length,
    };
  });

  constructor(private tripSvc: TripService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.tripSvc.getMine().subscribe({
      next:  (data) => { this.trips.set(data); this.loading.set(false); },
      error: ()     => { this.toast.error('Failed to load trips'); this.loading.set(false); }
    });
  }

  askCancel(trip: Trip) { this.cancelTarget.set(trip); }

  confirmCancel() {
    const trip = this.cancelTarget();
    if (!trip) return;
    this.cancelling.set(true);
    this.tripSvc.cancel(trip.id).subscribe({
      next: (updated) => {
        this.trips.update(list => list.map(t => t.id === updated.id ? updated : t));
        this.toast.success('Trip cancelled');
        this.cancelTarget.set(null);
        this.cancelling.set(false);
      },
      error: () => {
        this.toast.error('Could not cancel trip');
        this.cancelling.set(false);
      }
    });
  }

  canCancel(trip: Trip): boolean { return trip.status === 'OPEN'; }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}