import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface AppNotification {
    id: number;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.apiUrl}/notifications`;

    // Real-time signals
    notifications = signal<AppNotification[]>([]);
    unreadCount = signal<number>(0);

    private pollingSub?: Subscription;

    constructor(private http: HttpClient, private auth: AuthService) {
        // Start polling automatically if user is logged in
        effect(() => {
            const user = this.auth.currentUser(); // Assuming auth.currentUser is a signal
            if (user) {
                this.startPolling();
            } else {
                this.stopPolling();
            }
        });
    }

    startPolling() {
        if (this.pollingSub) return;

        // Fetch immediately, then every 15 seconds
        this.pollingSub = timer(0, 15000).pipe(
            switchMap(() => this.getUnreadNotifications().pipe(
                catchError(err => {
                    console.error('Error fetching notifications:', err);
                    return of([]);
                })
            ))
        ).subscribe(notifs => {
            this.notifications.set(notifs);
            this.unreadCount.set(notifs.filter(n => !n.isRead).length);
        });
    }

    stopPolling() {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
            this.pollingSub = undefined;
        }
        this.notifications.set([]);
        this.unreadCount.set(0);
    }

    getUnreadNotifications() {
        return this.http.get<AppNotification[]>(`${this.apiUrl}/unread`);
    }

    getAllNotifications() {
        return this.http.get<AppNotification[]>(this.apiUrl);
    }

    markAsRead(id: number) {
        return this.http.put(`${this.apiUrl}/${id}/read`, {}).pipe(
            tap(() => {
                // Optimistically update signals
                const current = this.notifications();
                const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
                this.notifications.set(updated);
                this.unreadCount.set(updated.filter(n => !n.isRead).length);
            })
        );
    }

    markAllAsRead() {
        return this.http.put(`${this.apiUrl}/read-all`, {}).pipe(
            tap(() => {
                const current = this.notifications();
                const updated = current.map(n => ({ ...n, isRead: true }));
                this.notifications.set(updated);
                this.unreadCount.set(0);
            })
        );
    }
}
