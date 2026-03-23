import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-monitoring-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="monitoring-page">
      <h1 class="page-title"><i class="fa-solid fa-satellite-dish"></i> Live Platform Monitoring</h1>

      <div class="tabs">
        <button class="tab-btn" [class.active]="tab() === 'trips'" (click)="tab.set('trips')">Trips</button>
        <button class="tab-btn" [class.active]="tab() === 'requests'" (click)="tab.set('requests')">Baggage Requests</button>
        <button class="tab-btn" [class.active]="tab() === 'payments'" (click)="tab.set('payments')">Payments</button>
      </div>

      <div class="monitor-card animate-fade-in">
        <!-- TRIPS TAB -->
        @if (tab() === 'trips') {
          <div class="list-container">
            @for (trip of trips(); track trip.id) {
              <div class="list-item">
                <div class="item-main">
                  <div class="item-icon trip"><i class="fa-solid fa-plane"></i></div>
                  <div class="item-details">
                    <h4>{{ trip.departureCity }} → {{ trip.arrivalCity }}</h4>
                    <p>Transporter: <strong>{{ trip.transporter?.firstName }} {{ trip.transporter?.lastName }}</strong></p>
                    <small>{{ trip.departureDate | date:'mediumDate' }}</small>
                  </div>
                </div>
                <div class="item-meta">
                  <span class="amount">{{ trip.availableSpace }} kg left</span>
                  <span class="status badge" [ngClass]="'badge-' + trip.status.toLowerCase()">{{ trip.status }}</span>
                </div>
              </div>
            }
            @if (trips().length === 0) {
              <div class="empty-list">No active trips found.</div>
            }
          </div>
        }

        <!-- REQUESTS TAB -->
        @if (tab() === 'requests') {
          <div class="list-container">
            @for (req of requests(); track req.id) {
              <div class="list-item">
                <div class="item-main">
                  <div class="item-icon request"><i class="fa-solid fa-box"></i></div>
                  <div class="item-details">
                    <h4>{{ req.departureCity }} → {{ req.arrivalCity }}</h4>
                    <p>Sender: <strong>{{ req.sender?.firstName }} {{ req.sender?.lastName }}</strong></p>
                    <small>Weight: {{ req.weightKg }}kg</small>
                  </div>
                </div>
                <div class="item-meta">
                  <span class="amount">{{ req.proposedPrice | number:'1.0-0' }} MAD</span>
                  <span class="status badge" [ngClass]="'badge-' + req.status.toLowerCase()">{{ req.status }}</span>
                </div>
              </div>
            }
            @if (requests().length === 0) {
              <div class="empty-list">No active baggage requests found.</div>
            }
          </div>
        }

        <!-- PAYMENTS TAB -->
        @if (tab() === 'payments') {
          <div class="list-container">
            @for (p of payments(); track p.id) {
              <div class="list-item">
                <div class="item-main">
                  <div class="item-icon payment"><i class="fa-solid fa-sack-dollar"></i></div>
                  <div class="item-details">
                    <h4>Payment #{{ p.id }}</h4>
                    <p>Method: {{ p.paymentMethod || 'Stripe Card' }}</p>
                    <small>{{ p.createdAt | date:'medium' }}</small>
                  </div>
                </div>
                <div class="item-meta">
                  <span class="amount">{{ p.amount | number:'1.2-2' }} MAD</span>
                  <span class="status font-bold" [style.color]="p.status === 'PAID' ? 'var(--success)' : 'var(--danger)'">{{ p.status }}</span>
                </div>
              </div>
            }
            @if (payments().length === 0) {
              <div class="empty-list">No payment history available.</div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .monitoring-page {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      animation: fadeIn 0.5s ease-out;
    }

    .page-title {
      font-family: var(--font-display);
      font-size: 2.25rem;
      font-weight: 900;
      color: var(--dark);
      letter-spacing: -0.5px;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      background: var(--white);
      padding: 0.75rem;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-card);
      width: fit-content;
    }

    .tab-btn {
      padding: 0.875rem 2.25rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: var(--transition-base);
      background: transparent;
      color: var(--muted);
      border: none;
      font-family: var(--font-body);
    }

    .tab-btn:hover:not(.active) {
      color: var(--dark);
      background: var(--light);
    }

    .tab-btn.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(255,107,53,0.3);
    }

    .monitor-card {
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .list-container {
      display: flex;
      flex-direction: column;
    }

    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.75rem 2.5rem;
      border-bottom: 1px solid rgba(26,26,46,0.05);
      transition: var(--transition-fast);
    }

    .list-item:hover { 
      background: #fafafa;
      transform: scale(1.005);
    }
    
    .list-item:last-child { border-bottom: none; }

    .item-main { display: flex; align-items: center; gap: 1.5rem; }
    
    .item-icon { 
      width: 52px; height: 52px; border-radius: 14px; 
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    }
    
    .item-icon.trip { background: #f0fdf4; color: #22c55e; }
    .item-icon.request { background: #eff6ff; color: #3b82f6; }
    .item-icon.payment { background: var(--primary-pale); color: var(--primary); }

    .item-details h4 { 
      margin: 0; 
      font-family: var(--font-display); 
      color: var(--dark);
      font-size: 1.15rem;
      font-weight: 800;
    }
    
    .item-details p { 
      margin: 0.25rem 0; 
      font-size: 0.95rem; 
      color: var(--mid); 
    }
    
    .item-details small { color: var(--muted); font-weight: 500; }

    .item-meta { text-align: right; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; }
    
    .amount { 
      display: block; 
      font-weight: 800; 
      color: var(--dark); 
      font-size: 1.25rem;
      font-family: var(--font-display);
    }
    
    .status { 
      font-size: 0.75rem; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
    }

    .empty-list {
      padding: 5rem;
      text-align: center;
      color: var(--muted);
      font-weight: 600;
      font-size: 1.1rem;
    }

    .badge {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 800;
    }

    .badge-open { background: #F0FFF4; color: #276749; }
    .badge-pending { background: #FFF8E7; color: #B8860B; }
    .badge-in_transit { background: #EBF8FF; color: #2B6CB0; }
    .badge-delivered { background: #F0FFF4; color: #276749; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in { animation: fadeIn 0.4s ease-out both; }
  `]
})
export class MonitoringViewComponent implements OnInit {
  tab = signal('trips');
  trips = signal<any[]>([]);
  requests = signal<any[]>([]);
  payments = signal<any[]>([]);

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.adminSvc.getTrips().subscribe((res: any) => this.trips.set(res.content || []));
    this.adminSvc.getRequests().subscribe((res: any) => this.requests.set(res.content || []));
    this.adminSvc.getPayments().subscribe((res: any) => this.payments.set(res.content || []));
  }
}
