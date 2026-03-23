import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ── Landing ───────────────────────────────────────────────
  {
    path: '',
    loadComponent: () => import('./features/landing/landing')
      .then(m => m.LandingComponent),
    title: 'BagyGo — Ship bags with people already going'
  },

  // ── Auth ──────────────────────────────────────────────────
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-layout.component')
      .then(m => m.AuthLayoutComponent),
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./features/auth/login').then(m => m.LoginComponent), title: 'Login — BagyGo' },
      { path: 'register', loadComponent: () => import('./features/auth/register').then(m => m.RegisterComponent), title: 'Register — BagyGo' }
    ]
  },

  // ── Dashboard ─────────────────────────────────────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-layout')
      .then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'sender', pathMatch: 'full' },


      // ── SENDER ──────────────────────────────────────────
      {
        path: 'sender',
        loadComponent: () => import('./features/dashboard/sender/sender-dashboard/sender-dashboard')
          .then(m => m.SenderDashboardComponent),
        title: 'Dashboard — BagyGo'
      },
      {
        path: 'sender/requests',
        loadComponent: () => import('./features/dashboard/sender/my-requests/request-list/request-list')
          .then(m => m.RequestListComponent),
        title: 'My Requests — BagyGo'
      },
      {
        path: 'sender/requests/new',
        loadComponent: () => import('./features/dashboard/sender/my-requests/create-request/create-request')
          .then(m => m.CreateRequestComponent),
        title: 'New Request — BagyGo'
      },
      {
        path: 'sender/find-transport',
        loadComponent: () => import('./features/dashboard/sender/find-transport/find-transport')
          .then(m => m.FindTransportComponent),
        title: 'Find Transport — BagyGo'
      },
      {
        path: 'sender/requests/:id',
        loadComponent: () => import('./features/dashboard/sender/my-requests/request-detail/request-detail')
          .then(m => m.RequestDetailComponent),
        title: 'Request Detail — BagyGo'
      },
      {
        path: 'sender/payment/success',
        loadComponent: () => import('./features/dashboard/sender/payment/payment-success/payment-success')
          .then(m => m.PaymentSuccessComponent),
        title: 'Payment Success — BagyGo'
      },
      {
        path: 'sender/payment/cancel',
        loadComponent: () => import('./features/dashboard/sender/payment/payment-cancel/payment-cancel')
          .then(m => m.PaymentCancelComponent),
        title: 'Payment Cancelled — BagyGo'
      },

      // ── TRANSPORTER ─────────────────────────────────────
      {
        path: 'transporter',
        loadComponent: () => import('./features/dashboard/transporter/transporter-home/transporter-home')
          .then(m => m.TransporterDashboardComponent),
        title: 'Transporter Dashboard — BagyGo'
      },
      {
        path: 'transporter/trips',
        loadComponent: () => import('./features/dashboard/transporter/my-trips/trip-list/trip-list')
          .then(m => m.TripListComponent),
        title: 'My Trips — BagyGo'
      },
      {
        path: 'transporter/trips/new',
        loadComponent: () => import('./features/dashboard/transporter/my-trips/create-trip/create-trip')
          .then(m => m.CreateTripComponent),
        title: 'Post a Trip — BagyGo'
      },
      {
        path: 'transporter/trips/:id',
        loadComponent: () => import('./features/dashboard/transporter/my-trips/trip-detail/trip-detail')
          .then(m => m.TripDetailComponent),
        title: 'Trip Detail — BagyGo'
      },
      {
        path: 'transporter/requests',
        loadComponent: () => import('./features/dashboard/transporter/my-trips/browse-requests/browse-requests')
          .then(m => m.BrowseRequestsComponent),
        title: 'Browse Requests — BagyGo'
      },

      // ── SHARED (placeholders for Phase 5+) ──────────────
      {
        path: 'messages',
        loadComponent: () => import('./features/dashboard/sender/sender-dashboard/sender-dashboard')
          .then(m => m.SenderDashboardComponent),
        title: 'Messages — BagyGo'
      },
      {
        path: 'tracking',
        loadComponent: () => import('./features/dashboard/sender/sender-dashboard/sender-dashboard')
          .then(m => m.SenderDashboardComponent),
        title: 'Tracking — BagyGo'
      },
      {
        path: 'ratings',
        loadComponent: () => import('./features/dashboard/sender/ratings/ratings')
          .then(m => m.RatingsComponent),
        title: 'Ratings — BagyGo'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/sender/settings/settings')
          .then(m => m.SettingsComponent),
        title: 'Settings — BagyGo'
      },
    ]
  },

  // ── Admin Panel ──────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./features/dashboard/admin/admin-layout')
      .then(m => m.AdminLayoutComponent),
    canActivate: [authGuard], // Should ideally be adminGuard
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/admin/admin-dashboard/admin-dashboard')
          .then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard — BagyGo'
      },
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/admin/users/user-list')
          .then(m => m.UserListComponent),
        title: 'User Management — BagyGo'
      },
      {
        path: 'verifications',
        loadComponent: () => import('./features/dashboard/admin/verifications/verification-list')
          .then(m => m.VerificationListComponent),
        title: 'Transporter Verification — BagyGo'
      },
      {
        path: 'monitoring',
        loadComponent: () => import('./features/dashboard/admin/monitoring/monitoring-view')
          .then(m => m.MonitoringViewComponent),
        title: 'Platform Monitoring — BagyGo'
      },
    ]
  },

  { path: '**', redirectTo: '/' }
];