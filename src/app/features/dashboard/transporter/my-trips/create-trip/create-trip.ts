import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripService } from '../../../../../core/services/trip.service';
import { ToastService } from '../../../../../core/services/toast.service';

const MOROCCAN_CITIES = [
  'Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir',
  'Meknès','Oujda','Kenitra','Tétouan','Safi','Mohammedia',
  'Khouribga','El Jadida','Béni Mellal','Nador','Laâyoune','Settat'
];

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-trip.html',
  styleUrls: ['./create-trip.scss']
})
export class CreateTripComponent {
  form: FormGroup;
  loading   = signal(false);
  step      = signal<1 | 2 | 3>(1);
  submitted = signal(false);
  cities    = MOROCCAN_CITIES;

  // Min datetime = now
  get minDateTime(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  steps = [
    { num: 1, label: 'Route',   icon: '📍' },
    { num: 2, label: 'Details', icon: '📋' },
    { num: 3, label: 'Review',  icon: '✅' },
  ];

  constructor(
    private fb: FormBuilder,
    private tripSvc: TripService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      departureCity:    ['', Validators.required],
      arrivalCity:      ['', Validators.required],
      departureDate:    ['', Validators.required],
      estimatedArrival: [''],
      availableSpace:   [null, [Validators.required, Validators.min(1), Validators.max(500)]],
      pricePerKg:       [null, [Validators.required, Validators.min(1)]],
      notes:            ['', Validators.maxLength(300)],
    });
  }

  get f() { return this.form.controls; }

  get step1Valid(): boolean {
    const { departureCity, arrivalCity, departureDate } = this.form.value;
    return !!(departureCity && arrivalCity && departureDate && departureCity !== arrivalCity);
  }

  get step2Valid(): boolean {
    return this.f['availableSpace'].valid && this.f['pricePerKg'].valid;
  }

  sameCityError(): boolean {
    const { departureCity, arrivalCity } = this.form.value;
    return !!(departureCity && arrivalCity && departureCity === arrivalCity);
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
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.tripSvc.create(this.form.value).subscribe({
      next: (trip) => {
        this.loading.set(false);
        this.submitted.set(true);
        this.toast.success('Trip posted! 🚗', 'Senders can now find your trip and make requests.');
        setTimeout(() => this.router.navigate(['/dashboard/transporter/trips', trip.id]), 1800);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error('Failed to post trip', err.error?.message ?? 'Please try again.');
      }
    });
  }

  formatDT(dt: string): string {
    if (!dt) return '';
    return new Date(dt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}