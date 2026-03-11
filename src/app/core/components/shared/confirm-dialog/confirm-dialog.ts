import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DialogVariant = 'danger' | 'warning' | 'info' | 'success';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss']
})
export class ConfirmDialogComponent {
  @Input() open       = false;
  @Input() title      = 'Are you sure?';
  @Input() message    = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel  = 'Cancel';
  @Input() variant: DialogVariant = 'danger';
  @Input() loading    = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  icons: Record<DialogVariant, string> = {
    danger:  '🗑️',
    warning: '⚠️',
    info:    'ℹ️',
    success: '✅'
  };

  get icon() { return this.icons[this.variant]; }

  onConfirm() { this.confirmed.emit(); }
  onCancel()  { this.cancelled.emit(); }
  onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.onCancel();
    }
  }
}