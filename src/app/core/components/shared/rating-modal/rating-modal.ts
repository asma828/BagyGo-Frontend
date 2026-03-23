import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-modal.html',
  styleUrls: ['./rating-modal.scss']
})
export class RatingModalComponent {
  isOpen = input<boolean>(false);
  submitting = input<boolean>(false);

  close = output<void>();
  rate = output<{ score: number, comment: string }>();

  currentScore = signal(0);
  hoverScore = signal(0);
  comment = signal('');

  setScore(score: number) {
    this.currentScore.set(score);
  }

  updateComment(event: Event) {
    this.comment.set((event.target as HTMLTextAreaElement).value);
  }

  submit() {
    if (this.currentScore() === 0) return;
    this.rate.emit({
      score: this.currentScore(),
      comment: this.comment()
    });
  }
}
