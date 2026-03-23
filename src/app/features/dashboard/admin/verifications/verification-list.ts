import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-verification-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verif-page">
    <div class="verif-page">
      <h1 class="page-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: bottom; margin-right: 8px; color: var(--primary);"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
        Pending Verifications
      </h1>

      @if (pendingList().length > 0) {
        <div class="grid">
          @for (user of pendingList(); track user.id) {
            <div class="verif-card animate-fade-up">
              <div class="user-header">
                <div class="avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
                <div class="user-info">
                  <h4>{{ user.firstName }} {{ user.lastName }}</h4>
                  <span class="email">{{ user.email }}</span>
                </div>
              </div>

              <div class="docs">
                <p class="font-bold text-dark" style="font-size: 0.8rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Attached Documents</p>
                <a *ngIf="user.transportDocumentUrl" [href]="user.transportDocumentUrl" target="_blank" class="doc-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8l-8.2-1.8c-.5-.1-1 .1-1.3.4-.3.4-.4 1-.1 1.4l7.2 3.6-3.6 7.2c-.4.3-.4.9-.1 1.4.3.3.8.5 1.2.4L16 18l2.2 2.2c.5.5 1.3.5 1.8 0 .5-.5.5-1.3 0-1.8Z"/></svg>
                  Means of Transport
                </a>
              </div>

              <div class="actions">
                <button class="btn btn-reject" (click)="reject(user.id)" [disabled]="processing().has(user.id) || verified().has(user.id)">Reject</button>
                <button 
                  class="btn btn-approve" 
                  [disabled]="processing().has(user.id) || verified().has(user.id)" 
                  (click)="approve(user.id)"
                >
                  @if (processing().has(user.id)) { Processing... }
                  @else if (verified().has(user.id)) { <i class="fa-solid fa-circle-check text-success"></i> Verified }
                  @else { Approve User }
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state animate-fade-in">
          <span class="empty-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success);"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </span>
          <h3>All caught up!</h3>
          <p class="text-muted">There are no pending verification requests at the moment.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .verif-page {
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

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .verif-card {
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      transition: var(--transition-base);
    }

    .verif-card:hover { 
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }

    .user-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .avatar {
      width: 56px;
      height: 56px;
      background: var(--primary-pale);
      color: var(--primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.5rem;
      font-family: var(--font-display);
    }

    .user-info h4 {
      font-family: var(--font-display);
      margin: 0;
      color: var(--dark);
      font-size: 1.15rem;
      font-weight: 800;
    }

    .email { font-size: 0.9rem; color: var(--muted); }

    .docs {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .doc-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--light);
      border-radius: var(--radius-md);
      color: var(--dark);
      font-weight: 600;
      font-size: 0.95rem;
      transition: var(--transition-fast);
      border: 1px solid transparent;
    }

    .doc-link:hover { 
      background: var(--secondary-pale); 
      color: var(--secondary);
      border-color: var(--secondary-light);
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: auto;
    }

    .btn {
      flex: 1;
      padding: 1rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      transition: var(--transition-base);
      font-family: var(--font-body);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-approve { 
      background: var(--success); 
      color: white; 
      box-shadow: 0 4px 12px rgba(72,187,120,0.25); 
    }
    
    .btn-reject { 
      background: rgba(252, 129, 129, 0.1); 
      color: var(--danger); 
    }

    .btn:hover:not(:disabled) { 
      transform: translateY(-3px); 
    }
    
    .btn-approve:hover:not(:disabled) {
      box-shadow: 0 8px 16px rgba(72,187,120,0.4);
    }

    .empty-state {
      text-align: center;
      padding: 6rem 2rem;
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .empty-icon { 
      font-size: 4rem; 
      display: block; 
      margin-bottom: 2rem; 
    }
    
    .empty-state h3 {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 0.5rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-up { animation: fadeInUp 0.5s ease-out both; }
  `]
})
export class VerificationListComponent implements OnInit {
  pendingList = signal<any[]>([]);
  processing = signal<Set<number>>(new Set());
  verified = signal<Set<number>>(new Set());

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.adminSvc.getPendingVerifications().subscribe((res: any) => {
      // Don't overwrite the verified visual state if we just successfully verified someone,
      // but if a full refresh happens, reset the signals.
      this.pendingList.set(res.content || []);
    });
  }

  approve(id: number) {
    if (confirm('Are you sure you want to approve this transporter?')) {
      const p = new Set(this.processing());
      p.add(id);
      this.processing.set(p);

      this.adminSvc.verifyTransporter(id, true).subscribe({
        next: () => {
          const v = new Set(this.verified());
          v.add(id);
          this.verified.set(v);
          
          const p2 = new Set(this.processing());
          p2.delete(id);
          this.processing.set(p2);
          
          alert('User has been verified successfully!');
        },
        error: (err) => {
          const p2 = new Set(this.processing());
          p2.delete(id);
          this.processing.set(p2);
          alert('Error approving transporter');
        }
      });
    }
  }

  reject(id: number) {
    if (confirm('Are you sure you want to reject this verification?')) {
      const p = new Set(this.processing());
      p.add(id);
      this.processing.set(p);

      this.adminSvc.verifyTransporter(id, false).subscribe({
        next: () => {
          // Immediately hide rejected users from list
          this.pendingList.update(list => list.filter(u => u.id !== id));
          
          const p2 = new Set(this.processing());
          p2.delete(id);
          this.processing.set(p2);
        },
        error: (err) => {
          const p2 = new Set(this.processing());
          p2.delete(id);
          this.processing.set(p2);
          alert('Error rejecting verification');
        }
      });
    }
  }
}
