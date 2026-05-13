import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';

type Category = 'Granos' | 'Insumos' | 'Fertilizantes' | 'Herramientas';
type StockStatus = 'Normal' | 'Bajo' | 'Por vencer' | 'Critico';

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: Category;
  stock: number;
  unidad: string;
  seccion: string;
  status?: StockStatus;
}

interface ProductFormModel {
  id: number | null;
  codigo: string;
  nombre: string;
  detalle: string;
  categoria: Category;
  stock: number;
  unidad: string;
  seccion: string;
}

interface CategoryCounts {
  Todos: number;
  Granos: number;
  Insumos: number;
  Fertilizantes: number;
  Herramientas: number;
}

@Component({
  selector: 'app-inventario-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  templateUrl: './inventario-page.component.html',
  styleUrl: './inventario-page.component.scss'
})
export class InventarioPageComponent {
  searchTerm = '';
  selectedCategory = 'Todos';
  selectedSection = 'Todas';
  selectedStatus = 'Todos';
  activeTab = 'Todos';
  showForm = false;
  editingProductId: number | null = null;

  readonly categories = ['Todos', 'Granos', 'Insumos', 'Fertilizantes', 'Herramientas'];
  readonly sections = ['Todas', 'A-02', 'A-04', 'B-01', 'B-03', 'C-01', 'D-02', 'D-05'];
  readonly statuses = ['Todos', 'Normal', 'Bajo', 'Por vencer', 'Critico'];

  products: Product[] = [
    { id: 1, codigo: 'GRN-001', nombre: 'Maiz Amarillo Duro', detalle: 'Zea mays · Var. PM-213', categoria: 'Granos', stock: 4800, unidad: 'kg', seccion: 'A-02' },
    { id: 2, codigo: 'GRN-002', nombre: 'Arroz Corriente', detalle: 'Oryza sativa · Var. IR-64', categoria: 'Granos', stock: 2100, unidad: 'kg', seccion: 'A-04' },
    { id: 3, codigo: 'FRT-001', nombre: 'Fertilizante NPK 20-20-20', detalle: 'Lote FRT-2024-08', categoria: 'Fertilizantes', stock: 320, unidad: 'kg', seccion: 'B-01' },
    { id: 4, codigo: 'INS-003', nombre: 'Pesticida Foliar Concentrado', detalle: 'Clorpirifos 48% EC', categoria: 'Insumos', stock: 180, unidad: 'L', seccion: 'B-03' },
    { id: 5, codigo: 'GRN-007', nombre: 'Semilla de Papa Canchan', detalle: 'Solanum tuberosum · Cert. A', categoria: 'Granos', stock: 45, unidad: 'kg', seccion: 'C-01' },
    { id: 6, codigo: 'HER-012', nombre: 'Rastrillo de Acero Galvanizado', detalle: '14 dientes · Mango 1.5m', categoria: 'Herramientas', stock: 24, unidad: 'unid.', seccion: 'D-02' },
    { id: 7, codigo: 'FRT-005', nombre: 'Humus de Lombriz', detalle: 'Organico certificado', categoria: 'Fertilizantes', stock: 95, unidad: 'kg', seccion: 'B-02' },
    { id: 8, codigo: 'INS-009', nombre: 'Manguera de Riego Tecnificado', detalle: '16mm · Cinta goteo 200m', categoria: 'Insumos', stock: 12, unidad: 'rollo', seccion: 'D-05' }
  ];

  formModel: ProductFormModel = this.emptyForm();

  get filteredProducts(): Product[] {
    return this.products
      .map((product) => ({ ...product, status: this.getStatus(product) }))
      .filter((product) => this.matchesSearch(product))
      .filter((product) => this.matchesCategory(product))
      .filter((product) => this.matchesSection(product))
      .filter((product) => this.matchesStatus(product))
      .filter((product) => this.matchesTab(product));
  }

  get categoryCounts(): CategoryCounts {
    return this.products.reduce(
      (counts, product) => {
        counts[product.categoria] += 1;
        counts.Todos += 1;
        return counts;
      },
      { Todos: 0, Granos: 0, Insumos: 0, Fertilizantes: 0, Herramientas: 0 }
    );
  }

  openNewProduct(): void {
    this.editingProductId = null;
    this.formModel = this.emptyForm();
    this.showForm = true;
  }

  openEditProduct(product: Product): void {
    this.editingProductId = product.id;
    this.formModel = {
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      detalle: product.detalle,
      categoria: product.categoria,
      stock: product.stock,
      unidad: product.unidad,
      seccion: product.seccion
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveProduct(): void {
    const payload: Product = {
      id: this.editingProductId ?? Date.now(),
      codigo: this.formModel.codigo.trim(),
      nombre: this.formModel.nombre.trim(),
      detalle: this.formModel.detalle.trim(),
      categoria: this.formModel.categoria,
      stock: Number(this.formModel.stock),
      unidad: this.formModel.unidad.trim(),
      seccion: this.formModel.seccion.trim()
    };

    if (this.editingProductId === null) {
      this.products = [payload, ...this.products];
    } else {
      this.products = this.products.map((product) => (product.id === this.editingProductId ? payload : product));
    }

    this.closeForm();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.selectedCategory = tab;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'Todos';
    this.selectedSection = 'Todas';
    this.selectedStatus = 'Todos';
    this.activeTab = 'Todos';
  }

  getStockClass(product: Product): string {
    const status = this.getStatus(product);

    if (status === 'Critico') return 'stock-danger';
    if (status === 'Por vencer') return 'stock-warn';
    if (status === 'Bajo') return 'stock-warn';
    return 'stock-ok';
  }

  getStatusDotClass(product: Product): string {
    const status = this.getStatus(product);

    if (status === 'Critico') return 'dot-danger';
    if (status === 'Por vencer') return 'dot-warn';
    if (status === 'Bajo') return 'dot-warn';
    return 'dot-ok';
  }

  getStatus(product: Product): StockStatus {
    if (product.stock <= 50) return 'Critico';
    if (product.stock <= 100) return 'Bajo';
    if (product.categoria === 'Fertilizantes' && product.stock <= 350) return 'Por vencer';
    return 'Normal';
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  private matchesSearch(product: Product): boolean {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return [product.codigo, product.nombre, product.detalle, product.categoria, product.seccion, product.unidad]
      .join(' ')
      .toLowerCase()
      .includes(term);
  }

  private matchesCategory(product: Product): boolean {
    return this.selectedCategory === 'Todos' || product.categoria === this.selectedCategory;
  }

  private matchesSection(product: Product): boolean {
    return this.selectedSection === 'Todas' || product.seccion === this.selectedSection;
  }

  private matchesStatus(product: Product): boolean {
    return this.selectedStatus === 'Todos' || this.getStatus(product) === this.selectedStatus;
  }

  private matchesTab(product: Product): boolean {
    return this.activeTab === 'Todos' || product.categoria === this.activeTab;
  }

  private emptyForm(): ProductFormModel {
    return {
      id: null,
      codigo: '',
      nombre: '',
      detalle: '',
      categoria: 'Granos',
      stock: 0,
      unidad: 'kg',
      seccion: 'A-02'
    };
  }
}
