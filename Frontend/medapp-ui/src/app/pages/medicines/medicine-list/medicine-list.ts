import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicineService, Medicine } from '../../../services/medicine.service';
import { switchMap, finalize, tap, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-list.html',
  styleUrls: ['./medicine-list.scss'],
})
export class MedicineList implements OnInit {
  private destroy$ = new Subject<void>();
  medicines: Medicine[] = [];
  loading = false;
  error: string | null = null;
  statusMsg: string | null = null;

  // Simple in-component toast notifications
  toasts: Array<{ id: number; msg: string; type: 'success' | 'info' | 'danger' }> = [];
  private toastId = 0;

  // For inline editing/adding
  editingId: number | null = null;
  // make editModel non-nullable to simplify template bindings (template uses a local `em` anyway)
  editModel: Medicine = { name: '', company: '', price: 0, stock: 0 } as Medicine;
  newModel: Medicine | null = null;
  newSaving = false;
  editSaving = false;
  deleting = false;

  constructor(private svc: MedicineService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // If the route provided resolved data, use it (ensures table is loaded on refresh/navigation).
    const resolved = this.route.snapshot.data?.['medicines'];
    if (resolved && Array.isArray(resolved)) {
      this.handleLoadedData(resolved);
    } else {
      // initial load when component is created
      this.load().pipe(takeUntil(this.destroy$)).subscribe();
    }

    // re-load when the router navigates back to this route (useful if the component is reused)
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // only reload if we're on the medicines path (defensive)
      if (this.router.url && this.router.url.includes('/medicines')) {
        this.load().pipe(takeUntil(this.destroy$)).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleLoadedData(data: any) {
    // support APIs that return an array or an envelope like { data: [...], items: [...] }
    let arr: any = data as any;
    if (!Array.isArray(arr)) {
      if (Array.isArray((arr as any).data)) arr = (arr as any).data;
      else if (Array.isArray((arr as any).items)) arr = (arr as any).items;
      else if (Array.isArray((arr as any).value)) arr = (arr as any).value;
    }
    if (!Array.isArray(arr)) {
      console.warn('MedicineList.load: unexpected response shape', data);
      this.error = 'Unexpected response format from server';
      this.medicines = [];
      this.statusMsg = null;
    } else {
      // Normalize common server field variations so the template bindings work
      const norm = (it: any) => {
        if (!it) return it;
        // prefer already-correct fields, fallback to other common names
        it.medicineId = it.medicineId ?? it.id ?? it.ID ?? it.MedicineId ?? it.MedicineID ?? null;
        it.name = it.name ?? it.Name ?? '';
        it.company = it.company ?? it.companyName ?? it.Company ?? it.CompanyName ?? '';
        it.price = (it.price ?? it.Price ?? 0);
        it.stock = (it.stock ?? it.Stock ?? 0);
        it.expiryDate = it.expiryDate ?? it.ExpiryDate ?? it.expiry ?? it.expiryDateUtc ?? null;
        it.createdOn = it.createdOn ?? it.createdAt ?? it.CreatedOn ?? it.created ?? null;
        return it as Medicine;
      };

      this.medicines = (arr as any[]).map(norm) as Medicine[];
      this.statusMsg = `Loaded ${this.medicines.length} medicines`;
      console.log('MedicineList.load: received', this.medicines.length, 'items; sample:', this.medicines[0] ?? null);
    }
  }

  // Return an observable that emits the raw server data and handles UI state
  load() {
    this.loading = true;
    this.error = null;
    this.statusMsg = 'Loading...';
    console.log('MedicineList.load: requesting medicines');

    return this.svc.getAll().pipe(
      tap({
        next: (data) => this.handleLoadedData(data),
        error: (err) => {
          this.error = 'Failed to load medicines: ' + (err?.message ?? err?.statusText ?? 'unknown');
          this.statusMsg = null;
          console.error('MedicineList.load error', err);
        }
      }),
      finalize(() => {
        this.loading = false;
        // Clear any save/delete flags after a refresh triggered by save/delete
        this.newSaving = false;
        this.editSaving = false;
        this.deleting = false;
      })
    );
  }

  // Insert a new editable row (inline add)
  startAdd() {
    this.newModel = { name: '', company: '', price: 0, stock: 0 } as Medicine;
  }

  // Template compatibility: some older templates call `add()`; keep a tiny alias.
  add() {
    this.startAdd();
  }

  cancelAdd() {
    this.newModel = null;
  }

  // Start editing an existing row
  startEdit(m: Medicine) {
    this.editingId = m.medicineId ?? null;
    // shallow copy to avoid mutating original until saved
    this.editModel = { ...m } as Medicine;
    // convert ISO expiryDate to local datetime-local input value if present
    if (this.editModel.expiryDate) {
      const d = new Date(this.editModel.expiryDate);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        this.editModel.expiryDate = local;
      }
    }
  }

  cancelEdit() {
    this.editingId = null;
    // reset to default to keep template type-check happy
    this.editModel = { name: '', company: '', price: 0, stock: 0 } as Medicine;
  }

  // Toast helper
  showToast(msg: string, type: 'success' | 'info' | 'danger' = 'info', timeout = 3500) {
    const id = ++this.toastId;
    this.toasts.unshift({ id, msg, type });
    // ensure UI updates immediately (defensive change-detection in case this runs outside the normal cycle)
    try { this.cdr.detectChanges(); } catch { }
    // debug log to help trace when toasts are added/removed
    console.log('MedicineList.showToast: added toast', { id, msg, type });

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      try { this.cdr.detectChanges(); } catch { }
      console.log('MedicineList.showToast: removed toast', id);
    }, timeout);
  }

  // Test helper to set a token in localStorage for dev/testing
  // (removed) setTestToken - test helper removed per request

  // Save a new row or existing edit, then reload table
  saveNew() {
    if (!this.newModel) return;
    this.newSaving = true;
    const payload: Medicine = { ...this.newModel };
    if (payload.expiryDate) {
      const d = new Date(payload.expiryDate);
      if (!isNaN(d.getTime())) payload.expiryDate = d.toISOString();
    }

    this.svc.create(payload).pipe(
      switchMap(() => this.load()),
      finalize(() => { this.newSaving = false; })
    ).subscribe({
      next: (data) => {
        // clear newModel and refresh list with server data
        this.newModel = null;
        this.handleLoadedData(data);
        this.showToast('Created medicine', 'success');
      },
      error: (e) => { console.error(e); this.showToast('Create failed', 'danger'); }
    });
  }

  saveEdit() {
    if (this.editingId == null) return;
    this.editSaving = true;
    const payload: Medicine = { ...this.editModel };
    if (payload.expiryDate) {
      const d = new Date(payload.expiryDate);
      if (!isNaN(d.getTime())) payload.expiryDate = d.toISOString();
    }

    this.svc.update(this.editingId, payload).pipe(
      switchMap(() => this.load()),
      finalize(() => { this.editSaving = false; })
    ).subscribe({
      next: (data) => {
        this.cancelEdit();
        this.handleLoadedData(data);
        this.showToast('Updated medicine', 'success');
      },
      error: (e) => { console.error(e); this.showToast('Update failed', 'danger'); }
    });
  }

  edit(id?: number) {
    if (id == null) return;
    this.router.navigate([`/medicines/edit/${id}`]);
  }

  remove(id?: number) {
    if (!confirm('Delete this medicine?')) return;
    if (id == null) return;
    this.deleting = true;
    this.svc.delete(id).pipe(
      switchMap(() => this.load()),
      finalize(() => { this.deleting = false; })
    ).subscribe({
      next: (data) => {
        this.handleLoadedData(data);
        this.showToast('Deleted medicine', 'success');
      },
      error: (e) => { console.error(e); this.showToast('Delete failed', 'danger'); }
    });
  }
}
