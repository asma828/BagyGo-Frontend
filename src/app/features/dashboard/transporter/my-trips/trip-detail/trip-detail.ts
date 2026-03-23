import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripService } from '../../../../../core/services/trip.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Trip } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { ConfirmDialogComponent } from '../../../../../core/components/shared/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';
import { MapComponent } from '../../../../../core/components/shared/map/map.component';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, ConfirmDialogComponent, EmptyStateComponent, MapComponent],
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.scss']
})
export class TripDetailComponent implements OnInit {
  loading      = signal(true);
  trip         = signal<Trip | null>(null);
  cancelDialog = signal(false);
  cancelling   = signal(false);

  // Geolocation
  isSharing = signal(false);
  watchId: any = null;

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

  startTrip() {
    this.tripSvc.updateStatus(this.trip()!.id, 'IN_PROGRESS').subscribe({
      next: (updated: Trip) => {
        this.trip.set(updated);
        this.toast.success('Trip started! You can now share your location.');
      },
      error: () => this.toast.error('Failed to start trip')
    });
  }

  finishTrip() {
    if (!confirm('Are you sure you want to finish this trip? Status will be set to COMPLETED.')) return;
    this.tripSvc.updateStatus(this.trip()!.id, 'COMPLETED').subscribe({
      next: (updated: Trip) => {
        this.trip.set(updated);
        this.toast.info('Trip finished.');
      },
      error: () => this.toast.error('Failed to finish trip')
    });
  }

  toggleShareLocation() {
    if (this.isSharing()) {
      this.stopSharing();
    } else {
      this.startSharing();
    }
  }

  private startSharing() {
    if (!navigator.geolocation) {
      this.toast.error('Geolocation is not supported by your browser');
      return;
    }

    this.isSharing.set(true);
    this.toast.info('Starting location sharing...');

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.tripSvc.updateLocation(this.trip()!.id, latitude, longitude).subscribe({
          next: (updated) => {
            this.trip.set(updated);
            console.log('Location updated', latitude, longitude);
          },
          error: () => this.toast.error('Failed to update location on server')
        });
      },
      (err) => {
        this.toast.error('Error getting location: ' + err.message);
        this.stopSharing();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  private stopSharing() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isSharing.set(false);
    this.toast.info('Location sharing stopped');
  }

  ngOnDestroy() {
    this.stopSharing();
  }

  canCancel(): boolean { return this.trip()?.status === 'OPEN'; }

  formatDT(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}