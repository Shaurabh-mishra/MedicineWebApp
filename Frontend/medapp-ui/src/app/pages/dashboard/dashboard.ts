import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MedicineService } from '../../services/medicine.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userName: string | null = null;
  userEmail: string | null = null;

  medCount: number | null = null;
  loading = false;

  constructor(private svc: MedicineService, private router: Router) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('name');
    this.userEmail = localStorage.getItem('email');

    // initial load
    this.reload();

    // reload when navigation completes to this route (handles redirects)
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.router.url && this.router.url.includes('/dashboard')) {
        this.reload();
      }
    });
  }

  private reload() {
    this.loading = true;
    this.svc.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (arr) => { this.medCount = Array.isArray(arr) ? arr.length : 0; this.loading = false; },
      error: () => { this.medCount = 0; this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
