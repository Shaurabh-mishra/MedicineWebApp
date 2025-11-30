import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService, Medicine } from '../../../services/medicine.service';

@Component({
  selector: 'app-medicine-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-form.html',
  styleUrls: ['./medicine-form.scss'],
})
export class MedicineForm implements OnInit {
  model: Medicine = { name: '', company: '', price: 0, stock: 0 };
  isEdit = false;
  loading = false;

  constructor(private svc: MedicineService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.svc.get(Number(id)).subscribe({
        next: (m) => { this.model = m; this.loading = false; },
        error: (e) => { console.error(e); this.loading = false; }
      });
    }
  }

  save() {
    const payload: Medicine = { ...this.model };
    // convert local date/time input to ISO if needed
    if (payload.expiryDate) {
      const d = new Date(payload.expiryDate);
      if (!isNaN(d.getTime())) payload.expiryDate = d.toISOString();
    }

    if (this.isEdit && this.model.medicineId) {
      this.svc.update(this.model.medicineId, payload).subscribe({
        next: () => this.router.navigate(['/medicines']),
        error: (e) => { console.error(e); alert('Update failed'); }
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => this.router.navigate(['/medicines']),
        error: (e) => { console.error(e); alert('Create failed'); }
      });
    }
  }

  cancel() {
    this.router.navigate(['/medicines']);
  }
}
