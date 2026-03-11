import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TransportOffer } from '../../../core/models';
import { AvatarComponent } from '../avatar/avatar';
import { RatingStarsComponent } from '../rating-stars/rating-stars';
import { StatusBadgeComponent } from '../shared/status-badge/status-badge';

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent, RatingStarsComponent, StatusBadgeComponent],
  templateUrl: './offer-card.html',
  styleUrls: ['./offer-card.scss']
})
export class OfferCardComponent {
  @Input() offer!: TransportOffer;
  @Input() canRespond = false;   // true for the sender who received the offer
  @Input() loading    = false;

  @Output() accepted    = new EventEmitter<void>();
  @Output() declined    = new EventEmitter<void>();
  @Output() countered   = new EventEmitter<number>();

  showCounterForm = false;
  counterCtrl = new FormControl<number>(0, [Validators.required, Validators.min(1)]);

  get transporter() { return this.offer.transporter; }
  get isPending()   { return this.offer.status === 'PENDING'; }

  toggleCounter() {
    this.showCounterForm = !this.showCounterForm;
    if (this.showCounterForm) {
      this.counterCtrl.setValue(this.offer.proposedPrice);
    }
  }

  submitCounter() {
    if (this.counterCtrl.invalid) return;
    this.countered.emit(this.counterCtrl.value!);
    this.showCounterForm = false;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
}