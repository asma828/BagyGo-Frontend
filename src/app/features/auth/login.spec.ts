import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';

import { vi, Mock } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any; // Simplified for Vitest TestBed usage

  beforeEach(async () => {
    const authSpy = {
      login: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should have an invalid form when fields are empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const email = component.form.controls['email'];
    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTruthy();
    
    email.setValue('test@bagygo.com');
    expect(email.valid).toBeTruthy();
  });

  it('should enforce minimum password length', () => {
    const password = component.form.controls['password'];
    password.setValue('123');
    expect(password.hasError('minlength')).toBeTruthy();
    
    password.setValue('password123');
    expect(password.valid).toBeTruthy();
  });

  it('should not call authService.login if form is invalid', () => {
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });
});
