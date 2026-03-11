import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div
          class="toast toast--{{ toast.type }} animate-slide-left"
          role="alert"
        >
          <span class="toast__icon">{{ icons[toast.type] }}</span>
          <div class="toast__body">
            <div class="toast__title">{{ toast.title }}</div>
            @if (toast.message) {
              <div class="toast__message">{{ toast.message }}</div>
            }
          </div>
          <button class="toast__close" (click)="toastSvc.dismiss(toast.id)">✕</button>
          <div
            class="toast__progress"
            [style.animation-duration.ms]="toast.duration"
          ></div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./toast.scss']
})
export class ToastContainerComponent {
  icons: Record<ToastType, string> = {
    success: '✅',
    error:   '❌',
    info:    '💬',
    warning: '⚠️'
  };

  constructor(public toastSvc: ToastService) {}
}