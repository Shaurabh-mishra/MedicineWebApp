import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MedicineService, Medicine } from '../../services/medicine.service';

@Injectable({ providedIn: 'root' })
export class MedicinesResolver implements Resolve<Medicine[] | null> {
    constructor(private svc: MedicineService) { }

    resolve(): Observable<Medicine[] | null> {
        return this.svc.getAll().pipe(
            // swallow errors and return null so navigation still proceeds
            catchError(err => {
                console.error('MedicinesResolver: failed to load medicines', err);
                return of(null);
            })
        );
    }
}
