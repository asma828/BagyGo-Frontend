import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  form: FormGroup;
  step      = signal<1 | 2>(1);   // 2-step registration
  loading   = signal(false);
  error     = signal('');
  showPass  = signal(false);
  selectedRole = signal<UserRole>('EXPEDITEUR');

  steps = [
    { num: 1, label: 'Your Info' },
    { num: 2, label: 'Account' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private uploadSvc: UploadService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // Step 1
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      phone:     ['', [Validators.required, Validators.pattern(/^[+\d\s\-]{8,15}$/)]],
      role:      ['EXPEDITEUR', Validators.required],
      // Step 2
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm:  ['', Validators.required],
      transportDocumentUrl: ['']
    }, { validators: [this.passwordMatch, this.transporterDocRequired] });
  }

  private transporterDocRequired(ctrl: AbstractControl) {
    const role = ctrl.get('role')?.value;
    const doc  = ctrl.get('transportDocumentUrl')?.value;
    if (role === 'TRANSPORTEUR' && !doc) {
      return { docRequired: true };
    }
    return null;
  }

  private passwordMatch(ctrl: AbstractControl) {
    const pass    = ctrl.get('password')?.value;
    const confirm = ctrl.get('confirm')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  selectRole(role: UserRole) {
    this.selectedRole.set(role);
    this.form.patchValue({ role });
  }

  get f() { return this.form.controls; }

  nextStep() {
    const step1Fields = ['firstName', 'lastName', 'phone'];
    step1Fields.forEach(f => this.form.get(f)!.markAsTouched());
    const valid = step1Fields.every(f => this.form.get(f)!.valid);
    if (valid) this.step.set(2);
  }

  prevStep() { this.step.set(1); }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.loading.set(true);
    this.uploadSvc.upload(file).subscribe({
      next: (res) => {
        this.form.patchValue({ transportDocumentUrl: res.fileUrl });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to upload document. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    this.error.set('');

    const { confirm, ...payload } = this.form.value;

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }

  togglePass() { this.showPass.update(v => !v); }

  getPasswordStrength(): { level: number; label: string; color: string } {
    const pw = this.f['password'].value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: 'Weak',   color: 'var(--danger)' };
    if (score === 2) return { level: 2, label: 'Fair',   color: 'var(--warning)' };
    if (score === 3) return { level: 3, label: 'Good',   color: 'var(--secondary)' };
    return             { level: 4, label: 'Strong', color: 'var(--success)' };
  }
}