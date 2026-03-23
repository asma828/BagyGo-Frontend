import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-page">
      <div class="page-header">
        <h1 class="page-title">👥 User Management</h1>
      </div>

      <div class="search-box">
        <input 
          type="text" 
          [ngModel]="searchQuery()" 
          (ngModelChange)="searchQuery.set($event)"
          placeholder="Search users by name, email or phone..."
          (keyup.enter)="search()"
        >
        <button class="btn-search" (click)="search()">Search Users</button>
      </div>

      <div class="table-container animate-fade-in">
        <table>
          <thead>
            <tr>
              <th>User Details</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr class="user-row">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
                    <div class="user-main">
                      <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                      <span class="email">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-role" [ngClass]="user.role.toLowerCase()">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span [class]="user.isBanned ? 'status-banned' : 'status-active'">
                    {{ user.isBanned ? '● Banned' : '● Active' }}
                  </span>
                </td>
                <td>
                  <div class="verify-cell">
                    <span class="chip" [class.chip-success]="user.isVerified" [class.chip-muted]="!user.isVerified">
                      {{ user.isVerified ? 'Verified' : 'Pending' }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    @if (!user.isBanned) {
                      <button class="btn-ban" (click)="updateBan(user, true)">Ban User</button>
                    } @else {
                      <button class="btn-unban" (click)="updateBan(user, false)">Unban</button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (users().length === 0) {
          <div class="empty-list">No users found matching your criteria.</div>
        }

        <div class="pagination">
          <div class="page-info">Showing {{ users().length }} users</div>
          <div class="page-controls">
             @for (p of [].constructor(totalPages()); track $index) {
              <button 
                class="page-btn" 
                [class.active]="page() === $index"
                (click)="loadPage($index)"
              >
                {{ $index + 1 }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-page {
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

    .search-box {
      background: var(--white);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      display: flex;
      gap: 1rem;
    }

    .search-box input {
      flex: 1;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-full);
      border: 2px solid var(--light);
      background: var(--light);
      font-family: var(--font-body);
      font-size: 1rem;
      transition: var(--transition-fast);
    }

    .search-box input:focus {
      border-color: var(--primary);
      background: var(--white);
      box-shadow: 0 0 0 4px var(--primary-pale);
    }

    .btn-search {
      padding: 0.875rem 2.5rem;
      background: var(--primary);
      color: white;
      border-radius: var(--radius-full);
      font-weight: 700;
      border: none;
      cursor: pointer;
      font-family: var(--font-body);
      box-shadow: 0 6px 16px rgba(255,107,53,0.3);
      transition: var(--transition-base);
    }

    .btn-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255,107,53,0.45);
    }

    .table-container {
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-body);
    }

    th {
      text-align: left;
      padding: 1.5rem;
      background: #fcfcfd;
      border-bottom: 2px solid var(--light);
      color: var(--mid);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.75px;
    }

    td {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(26,26,46,0.05);
      color: var(--dark);
      font-size: 0.95rem;
      vertical-align: middle;
    }

    .user-row:hover td {
      background: #fafafa;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .user-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--primary-pale);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-family: var(--font-display);
      font-size: 1rem;
    }

    .user-main {
      display: flex;
      flex-direction: column;
    }

    .user-main strong {
      font-size: 1.05rem;
      color: var(--dark);
    }

    .email {
      font-size: 0.85rem;
      color: var(--muted);
      font-weight: 500;
    }

    .badge-role {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .badge-role.expediteur { background: var(--secondary-pale); color: var(--secondary); }
    .badge-role.transporteur { background: #EBF8FF; color: #3182CE; }
    .badge-role.admin { background: var(--primary-pale); color: var(--primary); }

    .status-active { color: var(--success); font-weight: 700; }
    .status-banned { color: var(--danger); font-weight: 700; }

    .chip {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    
    .chip-success { background: #F0FFF4; color: #276749; }
    .chip-muted { background: var(--light); color: var(--muted); }

    .actions { display: flex; gap: 0.5rem; }

    .btn-ban, .btn-unban {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .btn-ban { background: #fee2e2; color: #b91c1c; }
    .btn-unban { background: #dcfce7; color: #15803d; }
    
    .btn-ban:hover { background: #fecaca; }
    .btn-unban:hover { background: #bbf7d0; }

    .empty-list {
      padding: 4rem;
      text-align: center;
      color: var(--muted);
      font-weight: 600;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #fcfcfd;
      border-top: 1px solid var(--light);
    }

    .page-info { font-size: 0.9rem; color: var(--muted); font-weight: 500; }

    .page-controls { display: flex; gap: 0.5rem; }

    .page-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: white;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-fast);
      color: var(--mid);
    }

    .page-btn:hover { border-color: var(--primary); color: var(--primary); }

    .page-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 4px 8px rgba(255,107,53,0.2);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.4s ease-out both; }
  `]
})
export class UserListComponent implements OnInit {
  users = signal<any[]>([]);
  searchQuery = signal<string>('');
  page = signal(0);
  size = 10;
  totalElements = signal(0);
  totalPages = signal(0);

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.loadPage(0);
  }

  loadPage(p: number) {
    this.page.set(p);
    this.adminSvc.getUsers(p, this.size).subscribe((res: any) => {
      this.users.set(res.content || []);
      this.totalElements.set(res.totalElements || 0);
      this.totalPages.set(res.totalPages || 0);
    });
  }

  search() {
    if (!this.searchQuery()) {
      this.loadPage(0);
      return;
    }
    this.adminSvc.searchUsers(this.searchQuery(), 0, this.size).subscribe((res: any) => {
      this.users.set(res.content || []);
      this.totalElements.set(res.totalElements || 0);
      this.totalPages.set(res.totalPages || 0);
      this.page.set(0);
    });
  }

  updateBan(user: any, banned: boolean) {
    const action = banned ? 'ban' : 'unban';
    if (confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) {
      this.adminSvc.updateBanStatus(user.id, banned).subscribe({
        next: () => {
          // Update the user object in the signal array to trigger UI refresh
          this.users.update(list => 
            list.map(u => u.id === user.id ? { ...u, isBanned: banned } : u)
          );
        },
        error: () => alert(`Error trying to ${action} user.`)
      });
    }
  }
}
