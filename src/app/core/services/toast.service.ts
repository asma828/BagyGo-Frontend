import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private nextId = 1;

  show(type: ToastType, title: string, message?: string, duration = 4000) {
    const toast: Toast = { id: this.nextId++, type, title, message, duration };
    this._toasts.update(list => [...list, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  success(title: string, message?: string) { this.show('success', title, message); }
  error(title: string, message?: string)   { this.show('error',   title, message, 6000); }
  info(title: string, message?: string)    { this.show('info',    title, message); }
  warning(title: string, message?: string) { this.show('warning', title, message, 5000); }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}