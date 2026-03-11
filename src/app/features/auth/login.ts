import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading  = signal(false);
  error    = signal('');
  showPass = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailCtrl()    { return this.form.get('email')!; }
  get passwordCtrl() { return this.form.get('password')!; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        const role = res.user.role;
        this.router.navigate([role === 'TRANSPORTEUR' ? '/dashboard/transporter' : '/dashboard/sender']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.error?.message || 'Invalid email or password. Please try again.'
        );
      }
    });
  }

  togglePass() { this.showPass.update(v => !v); }
}