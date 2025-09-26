import { Component, OnInit } from '@angular/core';

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
export class DarkModeButton implements OnInit {
  private mode: 'dark' | 'light' = 'light';
  protected iconButton: string = 'dark_mode';
  protected titleButton: string = 'Cambiar a modo oscuro';

  ngOnInit(): void {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      this.mode = stored as 'dark' | 'light';
    } else {
      this.mode = document.documentElement.getAttribute('data-bs-theme') as 'dark' | 'light' || 'light';
    }
    this.applyTheme();
  }

  protected changeMode(): void {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    localStorage.setItem('theme', this.mode);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-bs-theme', this.mode);
    if (this.mode === 'dark') {
      this.iconButton = 'light_mode';
      this.titleButton = 'Cambiar a modo claro';
    } else {
      this.iconButton = 'dark_mode';
      this.titleButton = 'Cambiar a modo oscuro';
    }
  }
}


