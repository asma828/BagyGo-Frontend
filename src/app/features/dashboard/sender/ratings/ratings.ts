import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingService } from '../../../../core/services/rating.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Rating, RatingSummary } from '../../../../core/models';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './ratings.html',
  styleUrls: ['./ratings.scss']
})
export class RatingsComponent implements OnInit {
  loading   = signal(true);
  summary   = signal<RatingSummary | null>(null);
  ratings   = signal<Rating[]>([]);
get user() {
  return this.auth.currentUser();
}
  // Give a rating modal
  showGiveRating = signal(false);
  submitting     = signal(false);
  giveForm: FormGroup;
  hoverStar = signal(0);
  selectedStar = signal(0);

  stars = [1, 2, 3, 4, 5];

  constructor(
    private ratingSvc: RatingService,
    private toast: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.giveForm = this.fb.group({
      toUserId: [null, Validators.required],
      score:    [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment:  ['', Validators.maxLength(400)]
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.ratingSvc.getMySummary().subscribe({
      next: (s) => { this.summary.set(s); },
      error: () => {}
    });
    this.ratingSvc.getMyRatings().subscribe({
      next: (r) => { this.ratings.set(r); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  // ── Distribution bar width ────────────────────────────
  barWidth(star: number): number {
    const s = this.summary();
    if (!s || s.total === 0) return 0;
    return Math.round(((s.distribution[star] ?? 0) / s.total) * 100);
  }

  // ── Star render helpers ───────────────────────────────
  starArray(score: number): { filled: boolean }[] {
    return [1, 2, 3, 4, 5].map(i => ({ filled: i <= score }));
  }

  // ── Give rating form ──────────────────────────────────
  setStar(star: number) {
    this.selectedStar.set(star);
    this.giveForm.patchValue({ score: star });
  }

  submitRating() {
    if (this.giveForm.invalid) { this.giveForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.ratingSvc.submit(this.giveForm.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showGiveRating.set(false);
        this.giveForm.reset();
        this.selectedStar.set(0);
        this.toast.success('Rating submitted! ⭐');
        this.load();
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error('Could not submit rating', err.error?.message ?? 'Try again.');
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Render filled/half/empty stars for the summary average
  filledStars   = computed(() => Math.floor(this.summary()?.average ?? 0));
  hasHalfStar   = computed(() => (this.summary()?.average ?? 0) % 1 >= 0.5);
  emptyStars    = computed(() => 5 - this.filledStars() - (this.hasHalfStar() ? 1 : 0));
}