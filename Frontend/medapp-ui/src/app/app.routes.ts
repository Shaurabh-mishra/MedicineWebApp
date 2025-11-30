import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { About } from './pages/about/about';
import { MedicineList } from './pages/medicines/medicine-list/medicine-list';
import { MedicineForm } from './pages/medicines/medicine-form/medicine-form';
import { MedicinesResolver } from './pages/medicines/medicines.resolver';

import { authGuard } from './auth-guard';


export const routes: Routes = [
    // Login page (public)
    { path: 'login', component: Login },

    // Default route -> Dashboard (protected)
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },


    // Medicines Module (protected)
    { path: 'medicines', component: MedicineList, canActivate: [authGuard], resolve: { medicines: MedicinesResolver } },
    { path: 'medicines/add', component: MedicineForm, canActivate: [authGuard] },
    { path: 'medicines/edit/:id', component: MedicineForm, canActivate: [authGuard] },

    // About page (protected)
    { path: 'about', component: About, canActivate: [authGuard] },

    // Wildcard
    { path: '**', redirectTo: '' }
];
