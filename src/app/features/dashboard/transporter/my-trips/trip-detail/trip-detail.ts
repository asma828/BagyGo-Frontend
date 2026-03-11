import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripService } from '../../../../../core/services/trip.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Trip } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { ConfirmDialogComponent } from '../../../../../core/components/shared/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, ConfirmDialogComponent, EmptyStateComponent],
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.scss']
})
export class TripDetailComponent implements OnInit {
  loading      = signal(true);
  trip         = signal<Trip | null>(null);
  cancelDialog = signal(false);
  cancelling   = signal(false);

  constructor(
    private route: ActivatedRoute,
    private tripSvc: TripService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripSvc.getById(id).subscribe({
      next:  (t) => { this.trip.set(t); this.loading.set(false); },
      error: ()  => { this.toast.error('Trip not found'); this.loading.set(false); }
    });
  }

  cancelTrip() {
    this.cancelling.set(true);
    this.tripSvc.cancel(this.trip()!.id).subscribe({
      next: (updated) => {
        this.trip.set(updated);
        this.cancelDialog.set(false);
        this.cancelling.set(false);
        this.toast.warning('Trip cancelled');
      },
      error: () => { this.toast.error('Could not cancel trip'); this.cancelling.set(false); }
    });
  }

  canCancel(): boolean { return this.trip()?.status === 'OPEN'; }

  formatDT(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}