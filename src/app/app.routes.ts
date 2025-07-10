import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LaunchDetailComponent } from './pages/launch-detail/launch-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'launch/:id', component: LaunchDetailComponent },
  { path: '**', redirectTo: '' },
];
