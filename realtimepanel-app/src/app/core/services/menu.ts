import { inject, Injectable } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly authService = inject(AuthService);

  private menuItems = [
    { name: 'General', icon: 'dashboard', route: '/' },
    // { name: 'Calendario', icon: 'calendar_month', route: '/calendar' },
    // { name: 'Diario', icon: 'menu_book', route: '/diary' },
    // { name: 'Riego', icon: 'water_drop', route: '/irrigation' },
    // { name: 'Finca', icon: 'landscape', route: '/farm' },
    // { name: 'Dotación', icon: 'water', route: '/watersupply' },
    // { name: 'Productos', icon: 'inventory_2', route: '/products' },
    // { name: 'Maquinaria', icon: 'agriculture', route: '/machinery' },
    // { name: 'Sanidad Vegetal', icon: 'medical_services', route: '/health' },
    // { name: 'Abonaje', icon: 'atr', route: '/fertilization' },
    { name: 'Usuarios', icon: 'Group', route: '/users' },
    // { name: 'Recolecta', icon: 'Nutrition', route: '/harvest' },
    // { name: 'Ajustes', icon: 'settings', route: '/settings' },
    // { name: 'Testing', icon: 'checklist', route: '/testing' },
  ];

  getMenuItems() {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.isAdmin) {
      return this.menuItems;
    }

    return this.menuItems.filter((item) => currentUser && currentUser.access.includes(item.route));
  }

  getMenuInitial() {
    return [{ name: 'Finca', icon: 'landscape', route: '/farm' }];
  }
}
