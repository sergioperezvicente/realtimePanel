import { inject, Injectable } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly authService = inject(AuthService);

  private menuItems = [
    { name: 'General', icon: 'dashboard', route: '/' },
    { name: 'Usuarios', icon: 'Group', route: '/users' },
    { name: 'Configuración', icon: 'settings', route: '/settings' },
  ];

  getMenuItems() {
    // const currentUser = this.authService.currentUser();
    // if (currentUser && currentUser.isAdmin) {
      return this.menuItems;
    // }

    // return this.menuItems.filter((item) => currentUser && currentUser.access.includes(item.route));
  }

  // getMenuInitial() {
  //   return [{ name: 'Finca', icon: 'landscape', route: '/farm' }];
  // }
}
