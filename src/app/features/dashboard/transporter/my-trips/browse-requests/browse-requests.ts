import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BaggageRequestService } from '../../../../../core/services/baggage-request.service';
import { OfferService } from '../../../../../core/services/offer.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { BaggageRequest } from '../../../../../core/models';
import { StatusBadgeComponent } from '../../../../../core/components/shared/status-badge/status-badge';
import { EmptyStateComponent } from '../../../../../core/components/shared/empty-state/empty-state';

const MOROCCAN_CITIES = [
  '','Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir',
  'Meknès','Oujda','Kenitra','Tétouan','Safi','Mohammedia',
  'Khouribga','El Jadida','Béni Mellal','Nador','Laâyoune','Settat'
];

@Component({
  selector: 'app-browse-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './browse-requests.html',
  styleUrls: ['./browse-requests.scss']
})
export class BrowseRequestsComponent implements OnInit {
  loading       = signal(true);
  requests      = signal<BaggageRequest[]>([]);
  offeringOn    = signal<number | null>(null);   // request id with open offer form
  submitting    = signal<number | null>(null);   // request id being submitted
  alreadyOffered = signal<Set<number>>(new Set());

  // Filters
  filterFrom   = signal('');
  filterTo     = signal('');
  filterMaxKg  = signal<number | null>(null);
  cities = MOROCCAN_CITIES;

  filtered = computed(() => {
    let list = this.requests();
    const from = this.filterFrom().toLowerCase();
    const to   = this.filterTo().toLowerCase();
    const maxKg = this.filterMaxKg();
    if (from)  list = list.filter(r => r.departureCity.toLowerCase().includes(from));
    if (to)    list = list.filter(r => r.arrivalCity.toLowerCase().includes(to));
    if (maxKg) list = list.filter(r => r.weightKg <= maxKg);
    return list;
  });

  // Offer forms keyed by request id
  offerForms = new Map<number, FormGroup>();

  constructor(
    private requestSvc: BaggageRequestService,
    private offerSvc: OfferService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.requestSvc.getOpen().subscribe({
      next: (data) => { this.requests.set(data); this.loading.set(false); },
      error: ()    => { this.toast.error('Failed to load requests'); this.loading.set(false); }
    });

    // Load my offers to track which requests I already offered on
    this.offerSvc.getMine().subscribe({
      next: (offers) => {
        const ids = new Set(offers.map(o => o.baggageRequest?.id).filter(Boolean) as number[]);
        this.alreadyOffered.set(ids);
      }
    });
  }

  getForm(requestId: number): FormGroup {
    if (!this.offerForms.has(requestId)) {
      this.offerForms.set(requestId, this.fb.group({
        proposedPrice: [null, [Validators.required, Validators.min(1)]],
        message:       ['', Validators.maxLength(200)]
      }));
    }
    return this.offerForms.get(requestId)!;
  }

  openOfferForm(id: number) {
    this.offeringOn.set(this.offeringOn() === id ? null : id);
  }

  submitOffer(request: BaggageRequest) {
    const form = this.getForm(request.id);
    if (form.invalid) { form.markAllAsTouched(); return; }

    this.submitting.set(request.id);
    this.offerSvc.create({
      baggageRequestId: request.id,
      proposedPrice:    form.value.proposedPrice,
      message:          form.value.message || undefined
    }).subscribe({
      next: () => {
        this.alreadyOffered.update(s => new Set([...s, request.id]));
        this.offeringOn.set(null);
        this.submitting.set(null);
        this.toast.success('Offer sent! ', `Your offer for ${request.departureCity} → ${request.arrivalCity} was submitted.`);
      },
      error: (err) => {
        this.submitting.set(null);
        this.toast.error('Could not send offer', err.error?.message ?? 'Please try again.');
      }
    });
  }

  clearFilters() {
    this.filterFrom.set('');
    this.filterTo.set('');
    this.filterMaxKg.set(null);
  }

  hasActiveFilters(): boolean {
    return !!(this.filterFrom() || this.filterTo() || this.filterMaxKg());
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}