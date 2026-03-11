import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars" [class.stars--interactive]="interactive" [class]="'stars--' + size">

      @for (star of [1,2,3,4,5]; track star) {
        <button
          type="button"
          class="star"
          [class.star--full]="isFull(star)"
          [class.star--half]="isHalf(star)"
          [class.star--empty]="isEmpty(star)"
          [class.star--hover]="isHovered(star)"
          [disabled]="!interactive"
          (mouseenter)="onHover(star)"
          (mouseleave)="onLeave()"
          (click)="onSelect(star)"
          [attr.aria-label]="'Rate ' + star + ' out of 5'"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <!-- Full / hover fill -->
            <defs>
              <linearGradient [id]="'half-' + star" x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" [attr.stop-color]="fillColor(star)" />
                <stop offset="50%" stop-color="transparent" />
              </linearGradient>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              [attr.fill]="starFill(star)"
              [attr.stroke]="fillColor(star)"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      }

      @if (showCount && count !== undefined) {
        <span class="stars__count">({{ count }})</span>
      }

      @if (showValue) {
        <span class="stars__value">{{ value.toFixed(1) }}</span>
      }

    </div>
  `,
  styleUrls: ['./rating-stars.scss']
})
export class RatingStarsComponent {
  @Input() value   = 0;        // 0–5, supports decimals
  @Input() count?: number;     // e.g. "(42 ratings)"
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() interactive = false;
  @Input() showCount   = false;
  @Input() showValue   = false;
  @Input() color       = 'var(--accent)';      // filled star color
  @Input() emptyColor  = 'var(--light)';       // empty star color

  @Output() rated = new EventEmitter<number>();

  hoveredStar = 0;

  isFull(star: number):  boolean { return (this.hoveredStar || this.value) >= star; }
  isHalf(star: number):  boolean {
    const v = this.hoveredStar || this.value;
    return !this.isFull(star) && v >= star - 0.5;
  }
  isEmpty(star: number): boolean { return !this.isFull(star) && !this.isHalf(star); }
  isHovered(star: number): boolean { return this.interactive && this.hoveredStar >= star; }

  fillColor(star: number): string {
    return this.isFull(star) || this.isHalf(star) || this.isHovered(star)
      ? this.color
      : this.emptyColor;
  }

  starFill(star: number): string {
    if (this.isHovered(star)) return this.color;
    if (this.isFull(star))    return this.color;
    if (this.isHalf(star))    return `url(#half-${star})`;
    return 'transparent';
  }

  onHover(star: number) { if (this.interactive) this.hoveredStar = star; }
  onLeave()             { this.hoveredStar = 0; }
  onSelect(star: number) {
    if (!this.interactive) return;
    this.rated.emit(star);
  }
}