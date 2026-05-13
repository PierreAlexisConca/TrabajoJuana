import { Component } from '@angular/core';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [AdminLayoutComponent],
  templateUrl: './inventario-page.component.html',
  styleUrl: './inventario-page.component.scss'
})
export class InventarioPageComponent {}
