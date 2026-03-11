import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="empty-state" [class]="'empty-state--' + size">
      <div class="empty-state__illustration">
        <div class="es-circle">
          <span class="es-icon">{{ icon }}</span>
        </div>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__desc">{{ description }}</p>
      @if (actionLabel && actionRoute) {
        <a [routerLink]="actionRoute" class="btn btn-primary">
          {{ actionLabel }}
        </a>
      }
      @if (actionLabel && !actionRoute) {
        <ng-content></ng-content>
      }
    </div>
  `,
  styleUrls: ['./empty-state.scss']
})
export class EmptyStateComponent {
  @Input() icon        = '📭';
  @Input() title       = 'Nothing here yet';
  @Input() description = '';
  @Input() actionLabel = '';
  @Input() actionRoute = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}