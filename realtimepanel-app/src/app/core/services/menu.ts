import { inject, Injectable } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';
import { SettingsService } from './settings';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly auths = inject(AuthService);
  private readonly settings = inject(SettingsService)

  private menuItems = [
    { name: 'General', icon: 'dashboard', route: '/' },
    { name: 'Usuarios', icon: 'Group', route: '/users' },
    { name: 'Servidor', icon: 'dns', route: '/server' },
    { name: 'Configuración', icon: 'settings', route: '/settings' },
  ];

  getMenuItems() {
    const currentUser = this.auths.currentUser();
    if (currentUser && currentUser.isAdmin && this.settings.getShowServer()) {
      return this.menuItems;
    } 
    
    if (currentUser && currentUser.isAdmin) {
      return this.menuItems.filter((item) => item.route !== '/server')
    }

    return this.menuItems.filter((item) => currentUser && currentUser.access.includes(item.route));
  }

  // getMenuInitial() {
  //   return [{ name: 'Finca', icon: 'landscape', route: '/farm' }];
  // }
}
