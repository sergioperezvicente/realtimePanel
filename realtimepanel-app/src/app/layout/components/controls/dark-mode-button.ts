import { Component, effect, inject, OnInit } from '@angular/core';
import { SettingsService } from '@core/services/settings';

@Component({
  selector: 'dark-mode-button',
  template: `{{ iconButton }}`,
  host: {
    class: 'material-symbols-outlined display-7 span-btn',
    type: 'button',
    '[title]': 'titleButton',
    '(click)': 'changeMode()',
  },
})
export class DarkModeButton {
  private readonly settings = inject(SettingsService)

  private mode?: 'dark' | 'light';
  protected iconButton: string = 'dark_mode';
  protected titleButton: string = 'Cambiar a modo oscuro';

  onChangesEffect = effect(()=> {
    const stored = this.settings.getTheme();
    if (stored === 'dark') {
      this.mode = 'dark'
      this.iconButton = 'light_mode';
      this.titleButton = 'Cambiar a modo claro';
    } else {
      this.mode = 'light'
      this.iconButton = 'dark_mode';
      this.titleButton = 'Cambiar a modo oscuro';
    }
  }) 

  protected changeMode(): void {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    this.settings.setTheme(this.mode);
    this.settings.saveSettingsOnDB()
  }

  
}


