import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { InventarioPageComponent } from './pages/inventario/inventario-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { MovimientosPageComponent } from './pages/movimientos/movimientos-page.component';
import { ReportesPageComponent } from './pages/reportes/reportes-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'dashboard', component: DashboardPageComponent },
	{ path: 'inventario', component: InventarioPageComponent },
	{ path: 'movimientos', component: MovimientosPageComponent },
	{ path: 'reportes', component: ReportesPageComponent },
	{ path: '**', redirectTo: 'login' }
];
