import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '@data/models/user';
import { UsersActions } from './users-actions';

@Component({
  selector: 'app-card-user',
  imports: [CommonModule, UsersActions],
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
          <div class="card-header bg-body-secondary" style="border-radius: 0px 5px 0px 0px; min-height: 110px">
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
    <div class="card-footer bg-body-secondary d-flex py-3 justify-content-end">
      <app-users-actions [user]="user" [display]="'7'"/>
    </div>
  `,
  host: {
    class: 'card shadow',
    'animate.enter': 'pop-appear',
    'animate.leave': 'pop-disappear'
    
  },
})
export class UserCard {
  @Input() user!: User;

}
