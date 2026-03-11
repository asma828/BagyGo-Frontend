import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class SettingsComponent implements OnInit {
get user() {
  return this.auth.currentUser();
}  saving  = signal(false);
  saved   = signal(false);

  profileForm: FormGroup;

  roleLabels: Record<string, string> = {
    EXPEDITEUR:  '📦 Sender (Expéditeur)',
    TRANSPORTEUR: '🚗 Transporter (Transporteur)'
  };

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userSvc: UserService,
    private toast: ToastService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      lastName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      phone:     ['', [Validators.minLength(6), Validators.maxLength(20)]],
      avatarUrl: [''],
    });
  }

  ngOnInit() {
    const u = this.user;
    if (u) {
      this.profileForm.patchValue({
        firstName: u.firstName,
        lastName:  u.lastName,
        phone:     u.phone,
        avatarUrl: u.avatarUrl ?? ''
      });
    }
  }

  get f() { return this.profileForm.controls; }

  get hasChanges(): boolean {
    const u = this.user;
    if (!u) return false;
    const v = this.profileForm.value;
    return v.firstName !== u.firstName ||
           v.lastName  !== u.lastName  ||
           v.phone     !== u.phone     ||
           (v.avatarUrl || '') !== (u.avatarUrl || '');
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.hasChanges || this.saving()) return;
    this.saving.set(true);

    // Only send fields that actually changed
    const u = this.user!;
    const v = this.profileForm.value;
    const patch: Record<string, string> = {};
    if (v.firstName !== u.firstName) patch['firstName'] = v.firstName;
    if (v.lastName  !== u.lastName)  patch['lastName']  = v.lastName;
    if (v.phone     !== u.phone)     patch['phone']     = v.phone;
    if ((v.avatarUrl || '') !== (u.avatarUrl || '')) patch['avatarUrl'] = v.avatarUrl;

    this.userSvc.updateProfile(patch).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        this.toast.success('Profile updated! ✅');
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error('Could not save profile', err.error?.message ?? 'Please try again.');
      }
    });
  }

  getInitials(): string {
    const u = this.user;
    if (!u) return '?';
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
  }
}