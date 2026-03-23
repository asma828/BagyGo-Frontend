import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestStatus, OfferStatus, TripStatus } from '../../../models';

export type BadgeStatus = RequestStatus | OfferStatus | TripStatus | string;

interface BadgeConfig {
  label: string;
  icon:  string;
  cls:   string;
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [class]="config.cls + ' status-badge--' + size">
      <span class="status-badge__dot"></span>
      @if (showIcon) { <span class="status-badge__icon" [innerHTML]="config.icon"></span> }
      <span class="status-badge__label">{{ config.label }}</span>
    </span>
  `,
  styleUrls: ['./status-badge.scss']
})
export class StatusBadgeComponent {
  @Input() status: BadgeStatus = 'OPEN';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() showIcon = true;

  private configs: Record<string, BadgeConfig> = {
    // Request statuses
    OPEN:       { label: 'Open',       icon: '🟢', cls: 'badge--open'      },
    PENDING:    { label: 'Pending',    icon: '⏳', cls: 'badge--pending'   },
    ACCEPTED:   { label: 'Accepted',   icon: '<i class="fa-solid fa-circle-check text-success"></i>', cls: 'badge--accepted'  },
    IN_TRANSIT: { label: 'In Transit', icon: '<i class="fa-solid fa-truck-fast"></i>', cls: 'badge--transit'   },
    DELIVERED:  { label: 'Delivered',  icon: '📬', cls: 'badge--delivered' },
    CANCELLED:  { label: 'Cancelled',  icon: '<i class="fa-solid fa-circle-xmark text-danger"></i>', cls: 'badge--cancelled' },

    // Offer statuses
    COUNTERED:  { label: 'Countered',  icon: '🔄', cls: 'badge--pending'   },
    DECLINED:   { label: 'Declined',   icon: '🚫', cls: 'badge--cancelled' },

    // Trip statuses
    FULL:        { label: 'Full',        icon: '<i class="fa-solid fa-circle text-danger"></i>', cls: 'badge--cancelled' },
    IN_PROGRESS: { label: 'In Progress', icon: '<i class="fa-solid fa-car"></i>', cls: 'badge--transit'   },
    COMPLETED:   { label: 'Completed',   icon: '<i class="fa-solid fa-flag-checkered"></i>', cls: 'badge--delivered' },
  };

  get config(): BadgeConfig {
    return this.configs[this.status] ?? { label: this.status, icon: '●', cls: 'badge--open' };
  }
}