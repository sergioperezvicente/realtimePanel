import { Component, effect, inject, signal } from '@angular/core';
import { SectionHeader } from '@app/shared/partials/section-header';
import { SectionSettingHeader } from './partials/section-settings';
import { SectionCollapse } from './partials/section-collapse';
import { GeneralSection } from './partials/general-section';
import { AdminSection } from './partials/admin-section';
import { VisualSection } from './partials/visual-section';
import { AuthService } from '@app/auth/services/auth';
import { DeveloperSection } from './partials/developer-section';
import { SettingsService } from '@core/services/settings';
import { SettingsSection } from '@app/data/models/settings-sections';

@Component({
  selector: 'settings-view',
  imports: [SectionHeader, SectionSettingHeader, SectionCollapse,],
  template: `
    <app-section-header [title]="'Configuración'" />
    @for (item of sections(); track item.name) {
      @if (item.access) {
        <app-section-settings-header
          [title]="item.name"
          [icon]="item.icon"
          (section)="this.target.set($event)"
          (click)="this.show.set(!this.show())"
          [isShow]="this.show() && this.target() === item.name" />
      
      @if ((target() === item.name) && this.show()) {
        <app-section-collapse [component]="item.component" />
      }
      }
    }
    
    <!-- 
    <button class="btn-theme btn" (click)="mostraralerta()">mostrar alerta</button>
    <h2>modals</h2>
    <button class="btn btn-primary me-2" type="button" (click)="openModal()">
      open modal con componente
    </button>
    <button class="btn btn-primary" type="button" (click)="openEmptyModal()">
      open modal vacio
    </button>
  -->
  `,
  styles: ``,
})
export class SettingsView {
  private readonly auth = inject(AuthService);
  private readonly settings = inject(SettingsService);

  protected sections = signal<SettingsSection[]>([
    { name: 'General', icon: 'build', component: GeneralSection, access: true },
    { name: 'Aspecto y visual', icon: 'visibility', component: VisualSection, access: true },
    { name: 'Administradores', icon: 'manage_accounts', component: AdminSection, access: this.auth.currentUser()?.isAdmin },
    { name: 'Modo desarrollo', icon: 'code', component: DeveloperSection, access: this.settings.getDeveloperMode() },
  ])

  target = signal<string>('');
  show = signal<boolean>(false);

  effectModeDeveloper = effect(()=> {
    this.settings.getDeveloperMode()
  })



  // mostraralerta() {
  //   this.alertService.showAlert('hola que tal', AlertColor.theme);
  // }

  // openModal() {
  //   this.modalsService.open('Modal Dinámico', TestModal1, ModalSize.lg, ModalColor.primary);
  // }
  // openEmptyModal() {
  //   this.modalsService.open(
  //     'Modal Vacío con enfasis temática',
  //     undefined,
  //     undefined,
  //     ModalColor.theme
  //   );
  // }

  
}
