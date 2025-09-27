import { Component, inject, Input } from '@angular/core';
import { ModalMode } from '@app/data/enums/modal-mode';
import { User } from '@app/data/models/user';
import { MaterialButton } from '@app/shared/controls/material-button';
import { ModalsService } from '@core/services/modals';
import { UserService } from '@core/services/user';
import { UserForm } from '../partials/user-form';
import { ModalSize } from '@app/data/enums/modal-size';
import { ModalColor } from '@app/data/enums/modal-color';

@Component({
  selector: 'app-users-actions',
  imports: [MaterialButton],
  template: `
    @if(user.phone) {
    <app-material-button
      class="me-2"
      [display]="display"
      icon="phone_in_talk"
      color="text-success"
      title="Llamar a contacto"
      (click)="callUser(user.phone)"
    />
    }
    <app-material-button
      class="me-2"
      [display]="display"
      icon="mail"
      color="text-light"
      title="Enviar correo a contacto"
      (click)="mailToUser(user.email)"
    />
    <app-material-button
      class="me-2"
      [display]="display"
      icon="contact_phone"
      color="text-primary"
      title="Exportar vCard"
      (click)="generateVCard()"
    />
    <app-material-button
      class="me-2"
      [display]="display"
      icon="edit"
      color="text-warning"
      title="Editar"
      (click)="selectedUserToEdit(user)"
    />
    <app-material-button
      icon="delete"
      [display]="display"
      color="text-danger"
      title="Eliminar"
      (click)="selectedUserToDelete(user)"
    />
  `,
  styles: ``,
})
export class UsersActions {
  @Input() user!: User;
  @Input() display?: string;

  private readonly ms = inject(ModalsService);
  private readonly us = inject(UserService);

  protected selectedUserToEdit(user: User): void {
    const title: string = 'Editar ' + user.name;
    this.us.select(user);
    this.us.setModeModal(ModalMode.edit);
    this.ms.open(title, UserForm, ModalSize.xl, ModalColor.warning);
  }

  protected selectedUserToDelete(user: User): void {
    this.us.select(user);
    this.us.setModeModal(ModalMode.delete);
    const title: string = '¿Está seguro de eliminar a ' + user.name + '?';
    this.ms.open(title, UserForm, ModalSize.lg, ModalColor.danger);
  }

  protected callUser(phone: string): void {
    if (phone) {
      window.open('tel:' + phone);
    }
  }

  protected mailToUser(email: string): void {
    window.open('mailto:' + email);
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

