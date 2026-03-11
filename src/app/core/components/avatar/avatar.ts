import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar"
      [class]="'avatar--' + size + ' ' + (online ? 'avatar--online' : '')"
      [style.background]="gradient"
      [title]="user ? user.firstName + ' ' + user.lastName : label"
    >
      @if (user?.avatarUrl) {
        <img [src]="user!.avatarUrl" [alt]="initials" class="avatar__img" />
      } @else {
        <span class="avatar__initials">{{ initials }}</span>
      }
      @if (online) {
        <span class="avatar__dot"></span>
      }
      @if (showRating && user?.rating) {
        <span class="avatar__rating">{{ user!.rating.toFixed(1) }}</span>
      }
    </div>
  `,
  styleUrls: ['./avatar.scss']
})
export class AvatarComponent implements OnChanges {
  @Input() user?: User | null;
  @Input() label = '';           // fallback if no user
  @Input() size: AvatarSize = 'md';
  @Input() online = false;
  @Input() showRating = false;

  initials = '?';
  gradient = '';

  private gradients = [
    'linear-gradient(135deg, #FF6B35, #FFD166)',
    'linear-gradient(135deg, #2EC4B6, #4FD8CC)',
    'linear-gradient(135deg, #FF6B35, #E5531A)',
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
  ];

  ngOnChanges(changes: SimpleChanges) {
    this.computeInitials();
    this.computeGradient();
  }

  private computeInitials() {
    if (this.user) {
      this.initials = `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase();
    } else if (this.label) {
      this.initials = this.label.slice(0, 2).toUpperCase();
    } else {
      this.initials = '?';
    }
  }

  private computeGradient() {
    const seed = this.user?.id ?? this.label.charCodeAt(0) ?? 0;
    this.gradient = this.gradients[seed % this.gradients.length];
  }
}