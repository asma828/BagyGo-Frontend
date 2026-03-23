import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../../../core/services/trip.service';
import { Trip } from '../../../../core/models';
import { RouteCardComponent } from '../../../../core/components/route-card/route-card';
import { ToastService } from '../../../../core/services/toast.service';

const MOROCCAN_CITIES = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
    'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia',
    'Khouribga', 'El Jadida', 'Béni Mellal', 'Nador', 'Laâyoune', 'Settat'
];

@Component({
    selector: 'app-find-transport',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouteCardComponent],
    templateUrl: './find-transport.html',
    styleUrls: ['./find-transport.scss']
})
export class FindTransportComponent {
    private fb = inject(FormBuilder);
    private tripSvc = inject(TripService);
    private router = inject(Router);
    private toast = inject(ToastService);

    searchForm: FormGroup;
    trips = signal<Trip[]>([]);
    loading = signal(false);
    hasSearched = signal(false);
    cities = MOROCCAN_CITIES;
    today = new Date().toISOString().split('T')[0];

    constructor() {
        this.searchForm = this.fb.group({
            pickupCity: ['', Validators.required],
            deliveryCity: ['', Validators.required],
            date: [this.today, Validators.required],
            weight: [1, [Validators.required, Validators.min(0.5)]]
        });
    }

    onSearch() {
        if (this.searchForm.invalid) return;

        this.loading.set(true);
        this.hasSearched.set(true);

        const { pickupCity, deliveryCity, date, weight } = this.searchForm.value;

        // We need to pass the date in a format the backend expects (LocalDateTime.parse)
        // LocalDateTime.parse expects "2026-03-11T00:00:00"
        const formattedDate = `${date}T00:00:00`;

        this.tripSvc.searchTrips({
            departureCity: pickupCity,
            arrivalCity: deliveryCity,
            date: formattedDate,
            weight: weight
        }).subscribe({
            next: (results) => {
                this.trips.set(results);
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                this.toast.error('Search failed', 'Could not retrieve trips. Please try again.');
            }
        });
    }

    viewDetails(trip: Trip) {
        // Navigate to create-request with tripId
        this.router.navigate(['/dashboard/sender/requests/new'], {
            queryParams: {
                tripId: trip.id,
                pickupCity: trip.departureCity,
                deliveryCity: trip.arrivalCity,
                weight: this.searchForm.value.weight,
                date: trip.departureDate ? trip.departureDate.split('T')[0] : this.searchForm.value.date
            }
        });
    }
}
