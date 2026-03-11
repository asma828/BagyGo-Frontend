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
      @if (showIcon) { <span class="status-badge__icon">{{ config.icon }}</span> }
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
    ACCEPTED:   { label: 'Accepted',   icon: '✅', cls: 'badge--accepted'  },
    IN_TRANSIT: { label: 'In Transit', icon: '🚛', cls: 'badge--transit'   },
    DELIVERED:  { label: 'Delivered',  icon: '📬', cls: 'badge--delivered' },
    CANCELLED:  { label: 'Cancelled',  icon: '❌', cls: 'badge--cancelled' },

    // Offer statuses
    COUNTERED:  { label: 'Countered',  icon: '🔄', cls: 'badge--pending'   },
    DECLINED:   { label: 'Declined',   icon: '🚫', cls: 'badge--cancelled' },

    // Trip statuses
    FULL:        { label: 'Full',        icon: '🔴', cls: 'badge--cancelled' },
    IN_PROGRESS: { label: 'In Progress', icon: '🚗', cls: 'badge--transit'   },
    COMPLETED:   { label: 'Completed',   icon: '🏁', cls: 'badge--delivered' },
  };

  get config(): BadgeConfig {
    return this.configs[this.status] ?? { label: this.status, icon: '●', cls: 'badge--open' };
  }
}