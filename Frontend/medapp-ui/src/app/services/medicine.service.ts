import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { shareReplay } from 'rxjs/operators';

export interface Medicine {
    medicineId?: number;
    name: string;
    company?: string;
    price?: number;
    expiryDate?: string; // ISO string
    stock?: number;
    createdOn?: string; // ISO string
}

@Injectable({ providedIn: 'root' })
export class MedicineService {
    private baseUrl = 'https://localhost:7293/api/Medicine';
    // cached observable to dedupe concurrent requests and cache list
    private cache$: Observable<Medicine[]> | null = null;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Medicine[]> {
        if (!this.cache$) {
            this.cache$ = this.http.get<Medicine[]>(this.baseUrl).pipe(
                // clear cache if the stream terminates with error (so next request can retry)
                tap({ error: () => { this.cache$ = null; } }),
                shareReplay({ bufferSize: 1, refCount: true })
            );
        }
        return this.cache$;
    }

    get(id: number): Observable<Medicine> {
        return this.http.get<Medicine>(`${this.baseUrl}/${id}`);
    }

    create(m: Medicine): Observable<Medicine> {
        return this.http.post<Medicine>(this.baseUrl, m).pipe(
            tap(() => { this.cache$ = null; })
        );
    }

    update(id: number, m: Medicine): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}`, m).pipe(
            tap(() => { this.cache$ = null; })
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            tap(() => { this.cache$ = null; })
        );
    }

    // explicit cache invalidation if needed
    clearCache() {
        this.cache$ = null;
    }
}
