import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  @Input() pageTitle = '';
  @Input() pagePath = '';
  @Input() active: 'dashboard' | 'inventario' | 'movimientos' | 'reportes' = 'dashboard';
}
