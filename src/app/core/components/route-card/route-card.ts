import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaggageRequest, Trip } from '../../../core/models';
import { StatusBadgeComponent } from '../shared/status-badge/status-badge';
import { AvatarComponent } from '../avatar/avatar';
import { RatingStarsComponent } from '../rating-stars/rating-stars';

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, AvatarComponent, RatingStarsComponent],
  templateUrl: './route-card.html',
  styleUrls: ['./route-card.scss']
})
export class RouteCardComponent {
  @Input() type: 'request' | 'trip' = 'request';
  @Input() request?: BaggageRequest;
  @Input() trip?: Trip;

  // Action button config
  @Input() actionLabel = '';
  @Input() actionRoute = '';
  @Input() showAction  = true;

  @Output() actionClick = new EventEmitter<void>();

  get from(): string {
    return this.type === 'request'
      ? this.request?.departureCity ?? ''
      : this.trip?.departureCity ?? '';
  }

  get to(): string {
    return this.type === 'request'
      ? this.request?.arrivalCity ?? ''
      : this.trip?.arrivalCity ?? '';
  }

  get date(): string {
    const raw = this.type === 'request'
      ? this.request?.desiredDate
      : this.trip?.departureDate;
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  get price(): number {
    return this.type === 'request'
      ? (this.request?.proposedPrice ?? 0)
      : (this.trip?.pricePerKg ?? 0);
  }

  get status(): string {
    return this.type === 'request'
      ? (this.request?.status ?? 'OPEN')
      : (this.trip?.status ?? 'OPEN');
  }

  get user() {
    return this.type === 'request' ? this.request?.sender : this.trip?.transporter;
  }

  get weightOrSpace(): string {
    return this.type === 'request'
      ? `${this.request?.weightKg ?? 0} kg`
      : `${this.trip?.availableSpace ?? 0} kg space`;
  }

  get offersCount(): number { return this.request?.offersCount ?? 0; }
  get isFragile():   boolean { return this.request?.isFragile ?? false; }
}