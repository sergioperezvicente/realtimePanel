import { Component, inject } from '@angular/core';
import { AlertColor } from '@app/data/enums/alert-color';
import { ModalColor } from '@app/data/enums/modal-color';
import { ModalSize } from '@app/data/enums/modal-size';
import { AlertsService } from '@core/services/alerts';
import { ModalsService } from '@core/services/modals';
import { TestModal1 } from './modals/test-modal-1';
import { SectionHeader } from "@app/shared/partials/section-header";

@Component({
  selector: 'settings-view',
  imports: [SectionHeader],
  template: `
    <app-section-header [title]="'Configuración'" />
    <p>settings works!</p>
    <button class="btn-theme btn" (click)="mostraralerta()">mostrar mensaje</button>
    <p>cambiar color de enfasis</p>
    <input type="color" value="#ffc107" (input)="applyColor($event)" />
    <h2>modals</h2>
    <button class="btn btn-primary me-2" type="button" (click)="openModal()">
      open modal con componente
    </button>
    <button class="btn btn-primary" type="button" (click)="openEmptyModal()">
      open modal vacio
    </button>
    <br />
    <h2>Texto relleno</h2>
    Veniam veniam eiusmod cupidatat cupidatat aute esse quis cillum id dolor minim ea. Do laboris
    aliquip ipsum voluptate velit ut. Sunt ea incididunt aliquip nulla dolor quis. Quis nulla sint
    sint minim nulla quis consequat nulla deserunt dolore ea enim incididunt. Dolor culpa in sint ut
    ullamco incididunt id occaecat mollit magna. In consectetur reprehenderit culpa culpa cupidatat
    sunt voluptate eu cupidatat incididunt duis qui. Aliquip non consequat irure nisi Lorem. Aliqua
    occaecat labore elit nulla proident velit amet. Fugiat dolor magna amet qui consectetur.
    Occaecat et mollit cillum sint aute aute officia exercitation veniam deserunt nostrud. Ad est ea
    minim adipisicing adipisicing Lorem. Elit eu qui fugiat cillum adipisicing fugiat ullamco anim
    ex sint laboris aliquip. Duis adipisicing amet minim commodo. Occaecat ex excepteur est ipsum ea
    esse veniam ea enim veniam exercitation. Enim Lorem do sit commodo voluptate laborum id dolor
    fugiat non tempor excepteur quis labore. Laborum laboris ex nostrud ad ex nisi pariatur sit
    pariatur sint cillum. Nostrud deserunt cupidatat ipsum proident sint consectetur tempor est
    labore. Incididunt laboris irure enim pariatur ut aute est. Ut duis occaecat in laborum
    incididunt excepteur sint consequat. Elit officia aliquip minim ut cupidatat. Magna labore
    consectetur quis qui deserunt. Quis do est amet ad nostrud incididunt ad incididunt aliquip aute
    duis ad consectetur nulla. Qui velit do consequat culpa cillum proident culpa. Dolore laboris
    nostrud eiusmod fugiat laboris et voluptate reprehenderit excepteur. Eu aute quis ad pariatur.
    Tempor officia proident veniam aliquip ut velit irure labore anim veniam deserunt ex laboris
    irure. Duis occaecat amet adipisicing sunt in excepteur commodo dolore. Laboris laborum do
    labore voluptate magna. Ea sint dolor ut deserunt sunt nostrud. Ipsum excepteur consectetur
    tempor cillum. Reprehenderit ex veniam sunt tempor sit non. Do amet sunt irure est exercitation
    exercitation aute. Dolor qui commodo qui commodo. Non ex in cupidatat non qui cupidatat ea sint
    ipsum nostrud quis proident. Veniam enim id elit adipisicing irure. Ullamco occaecat Lorem sint
    cillum minim ex irure aliquip dolore nostrud. Non et mollit reprehenderit aliquip adipisicing
    quis nostrud officia. Nostrud ex est eu laborum cupidatat irure eiusmod et occaecat. Ex labore
    ipsum sit ipsum laboris consectetur. Ipsum Lorem do pariatur adipisicing fugiat dolore ex amet
    id aute laboris minim anim. Officia cupidatat aliqua voluptate enim in voluptate enim cupidatat
    amet anim enim eu pariatur. Dolore dolore elit duis voluptate cupidatat id esse ullamco quis
    excepteur esse minim magna. Eiusmod sunt elit minim Lorem qui consequat reprehenderit qui est.
    Consectetur non sunt elit ex amet exercitation commodo nostrud incididunt pariatur deserunt
    consectetur. Excepteur laborum pariatur ex adipisicing anim est nisi laborum laborum
    exercitation aliquip quis proident. Amet mollit nisi veniam ipsum incididunt est nisi ut nostrud
    voluptate nostrud ad dolore aliqua. Eiusmod reprehenderit fugiat et ad aliquip minim
    exercitation eu dolor tempor. Culpa proident consequat irure enim deserunt eiusmod nisi amet eu
    non velit laborum non. Nisi aliquip aliquip laborum nulla incididunt Lorem aliquip amet dolor ea
    ut voluptate.
  `,
  styles: ``,
})
export class SettingsView {
  private readonly alertService = inject(AlertsService);
  private readonly modalsService = inject(ModalsService);

  mostraralerta() {
    this.alertService.showAlert('hola que tal', AlertColor.primary);
  }

  openModal() {
    this.modalsService.open('Modal Dinámico', TestModal1, ModalSize.lg, ModalColor.primary);
  }
  openEmptyModal() {
    this.modalsService.open(
      'Modal Vacío con enfasis temática',
      undefined,
      undefined,
      ModalColor.theme
    );
  }

  protected applyColor(event: Event) {
    const hex = (event.target as HTMLInputElement).value;
    const rgb = this.hexToRgbString(hex);

    document.documentElement.style.setProperty('--color-theme-rgb', rgb);
    document.documentElement.style.setProperty('--color-theme-rgba25', `rgba(${rgb}, 0.25)`);

    // Hover: 15% más claro
    const hexLight = this.lightenColor(hex, 15);
    document.documentElement.style.setProperty('--color-theme-light', hexLight);

    // Active: 15% más oscuro
    const hexDark = this.darkenColor(hex, 15);
    document.documentElement.style.setProperty('--color-theme-dark', hexDark);

    // Texto normal
    const textNormal = this.isColorLight(hex) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--color-theme-text', textNormal);

    // Texto hover
    const textHover = this.isColorLight(hexLight) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--color-theme-text-light', textHover);

    // Texto active
    const textActive = this.isColorLight(hexDark) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--color-theme-text-dark', textActive);
  }

  // añade esta función:
  private darkenColor(hex: string, percent: number): string {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const factor = (100 - percent) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
      .toString(16)
      .padStart(2, '0')}`;
  }

  hexToRgbString(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  private isColorLight(hex: string): boolean {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    // Fórmula de luminosidad percibida
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186; // umbral ajustable
  }

  private lightenColor(hex: string, percent: number): string {
    // percent: 0–100 (por ejemplo 15 = 15% más claro)
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const newR = Math.round(r + (255 - r) * (percent / 100));
    const newG = Math.round(g + (255 - g) * (percent / 100));
    const newB = Math.round(b + (255 - b) * (percent / 100));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
      .toString(16)
      .padStart(2, '0')}`;
  }
}
