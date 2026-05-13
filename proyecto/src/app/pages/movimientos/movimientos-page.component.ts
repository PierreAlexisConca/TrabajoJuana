import { Component } from '@angular/core';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [AdminLayoutComponent],
  templateUrl: './movimientos-page.component.html',
  styleUrl: './movimientos-page.component.scss'
})
export class MovimientosPageComponent {}
