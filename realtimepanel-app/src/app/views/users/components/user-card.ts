import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ModalsService } from '@core/services/modals';
import { User } from '@data/models/user';
import { ModalSize } from '@data/enums/modal-size';
import { UserService } from '@core/services/user';
import { MaterialButton } from '@shared/controls/material-button';
import { ModalMode } from '@data/enums/modal-mode';
import { UserForm } from '../partials/user-form';
import { ModalColor } from '@app/data/enums/modal-color';

@Component({
  selector: 'app-card-user',
  imports: [CommonModule, MaterialButton],
  template: `
    <div class="card-body p-0">
      <div class="row m-0">
        <div
          class="col-4"
          [ngStyle]="{
            'background-image': 'url(' + (user.imageUrl || '/assets/controls/user-photo.svg') + ')',
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'border-radius': '5px 0px 0px 0px',
            'min-height': '250px'
          }"
        ></div>
        <div class="col-8 p-0">
          <div class="card-header bg-theme-soft" style="border-radius: 0px 5px 0px 0px; min-height: 110px">
            <h2 class="card-title">{{ user.name }}</h2>
            <h4 class="card-subtitle text-muted text-truncate">{{ user.lastName }}</h4>
            <small class="mb-2 fst-italic">{{ user.job }}</small>
          </div>
          <div class="card-body">
            <p class="text-truncate">&#9993; {{ user.email }}</p>
            @if (user.phone) {
            <p>&#9742; {{ user.phone }}</p>
            } @else {
            <p><br /></p>
            } @if (user.isAdmin) {
            <span class="badge text-bg-warning me-2"> Administrador </span>
            } @else {
            <span class="badge text-bg-secondary me-2"> Usuario </span>
            }
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer d-flex py-3 justify-content-end">
      @if(user.phone) {
      <app-material-button
        class="me-2"
        display="7"
        icon="phone_in_talk"
        color="text-success"
        title="Llamar a contacto"
        (click)="callUser()"
      />
      }
      <app-material-button
        class="me-2"
        display="7"
        icon="mail"
        color="text-light"
        title="Enviar correo a contacto"
        (click)="mailToUser()"
      />
      <app-material-button
        class="me-2"
        display="7"
        icon="contact_phone"
        color="text-primary"
        title="Exportar vCard"
        (click)="generateVCard()"
      />
      <app-material-button
        class="me-2"
        display="7"
        icon="edit"
        color="text-warning"
        title="Editar"
        (click)="selectedUserToEdit(user)"
      />
      <app-material-button
        icon="delete"
        display="7"
        color="text-danger"
        title="Eliminar"
        (click)="selectedUserToDelete(user)"
      />
    </div>
  `,
  host: {
    class: 'card shadow',
    'animate.enter': 'pop-appear',
    
  },
})
export class UserCard {
  @Input() user!: User;

  private readonly modalsService = inject(ModalsService);
  private readonly userService = inject(UserService);

  protected selectedUserToEdit(user: User): void {
    const title: string = 'Editar ' + user.name;
    this.userService.select(user);
    this.userService.setModeModal(ModalMode.edit);
    this.modalsService.open(title, UserForm, ModalSize.xl, ModalColor.warning);
  }

  protected selectedUserToDelete(user: User): void {
    this.userService.select(user);
    this.userService.setModeModal(ModalMode.delete);
    const title: string = '¿Está seguro de eliminar a ' + user.name + '?';
    this.modalsService.open(title, UserForm, ModalSize.lg, ModalColor.danger);
  }

  protected callUser(): void {
    if (this.user?.phone) {
      window.open('tel:' + this.user.phone);
    }
  }

  protected mailToUser(): void {
    window.open('mailto:' + this.user.email);
  }

  protected generateVCard(): void {
    const contactData = {
      name: this.user.name + ' ' + this.user.lastName,
      phone: this.user.phone,
      email: this.user.email,
      job: this.user.job,
    };

    const vCardContent = `BEGIN:VCARD
        VERSION:3.0
        FN:${contactData.name}
        TEL;TYPE=CELL:${contactData.phone}
        EMAIL:${contactData.email}
        TITLE:${contactData.job}
        END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contactData.name}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
