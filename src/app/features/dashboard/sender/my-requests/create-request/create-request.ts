import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaggageRequestService } from '../../../../../core/services/baggage-request.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ActivatedRoute } from '@angular/router';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia',
  'Khouribga', 'El Jadida', 'Béni Mellal', 'Nador', 'Laâyoune', 'Settat'
];

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-request.html',
  styleUrls: ['./create-request.scss']
})
export class CreateRequestComponent {
  form: FormGroup;
  loading = signal(false);
  step = signal<1 | 2 | 3>(1);
  submitted = signal(false);

  cities = MOROCCAN_CITIES;

  // Today's date for min date input
  today = new Date().toISOString().split('T')[0];

  steps = [
    { num: 1, label: 'Route', icon: '<i class="fa-solid fa-location-dot"></i>' },
    { num: 2, label: 'Baggage', icon: '<i class="fa-solid fa-box"></i>' },
    { num: 3, label: 'Review', icon: '<i class="fa-solid fa-circle-check text-success"></i>' },
  ];

  constructor(
    private fb: FormBuilder,
    private requestSvc: BaggageRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      // Step 1 — Route
      departureCity: ['', Validators.required],
      arrivalCity: ['', Validators.required],
      desiredDate: ['', Validators.required],

      // Step 2 — Baggage
      weightKg: [null, [Validators.required, Validators.min(0.5), Validators.max(100)]],
      proposedPrice: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      isFragile: [false],
      tripId: [null],
      message: [''],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tripId']) {
        this.form.patchValue({
          tripId: +params['tripId'],
          departureCity: params['pickupCity'],
          arrivalCity: params['deliveryCity'],
          weightKg: params['weight'] ? +params['weight'] : null,
          desiredDate: params['date'] || ''
        });
        if (params['pickupCity'] && params['deliveryCity'] && params['date']) {
          this.step.set(2);
        }
      }
    });
  }

  get f() { return this.form.controls; }

  // Step 1 fields valid?
  get step1Valid(): boolean {
    const { departureCity, arrivalCity, desiredDate } = this.form.value;
    return !!(departureCity && arrivalCity && desiredDate && departureCity !== arrivalCity);
  }

  // Step 2 fields valid?
  get step2Valid(): boolean {
    return this.f['weightKg'].valid &&
      this.f['proposedPrice'].valid &&
      this.f['description'].valid;
  }

  nextStep() {
    if (this.step() === 1 && this.step1Valid) this.step.set(2);
    else if (this.step() === 2 && this.step2Valid) this.step.set(3);
  }

  prevStep() {
    if (this.step() === 2) this.step.set(1);
    else if (this.step() === 3) this.step.set(2);
  }

  onSubmit() {
    if (this.loading()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Form invalid', 'Please check all required fields.');
      console.error('Form invalid:', this.form.errors, this.form.value);
      return;
    }

    this.loading.set(true);

    this.requestSvc.create(this.form.value).subscribe({
      next: (req) => {
        this.loading.set(false);
        this.submitted.set(true);
        this.toast.success('Request posted! 🎉', 'Transporters will start making offers soon.');
        setTimeout(() => this.router.navigate(['/dashboard/sender/requests', req.id]), 1800);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error('Failed to post request', err.error?.message ?? 'Please try again.');
      }
    });
  }

  // Price suggestion based on weight
  suggestPrice(): number {
    const w = this.f['weightKg'].value;
    if (!w) return 0;
    return Math.round(w * 15); // 15 MAD/kg baseline
  }

  applySuggestion() {
    this.f['proposedPrice'].setValue(this.suggestPrice());
  }

  sameCityError(): boolean {
    const { departureCity, arrivalCity } = this.form.value;
    return !!(departureCity && arrivalCity && departureCity === arrivalCity);
  }
}