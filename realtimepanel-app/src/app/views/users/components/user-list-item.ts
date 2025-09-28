import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { AuthService } from '@app/auth/services/auth';
import { User } from '@app/data/models/user';
import { UserService } from '@core/services/user';
import { UsersActions } from './users-actions';
import { CheckControl } from '@app/shared/controls/check';
import { ChatService } from '@core/services/chat';
import { TimeAgoPipe } from '@shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-list-item-user',
  imports: [UsersActions, CheckControl, TimeAgoPipe],
  template: `
    <div
      class="d-flex align-items-center justify-content-start shadow"
      [class.bg-warning]="user.isAdmin"
      [class.bg-secondary]="!user.isAdmin"
    >
      <app-check
        class="mx-3 mt-0"
        display="display-6"
        [class.d-none]="!this.us.multipleCheck()"
        [isDisabled]="this.as.currentUser()?.id === user.id"
        [style.animation-delay.ms]="index * 50"
        (changed)="onTouched($event)"
      />
      <div
        class="fw-semibold pe-3 d-none d-xl-block"
        [class.ms-3]="!this.us.multipleCheck()"
        style="width: 125px;"
      >
        @if ((this.as.currentUser()?.id === user.id) ) {
        <strong class="fs-5">Usted</strong>
        } @else { @if (user.isAdmin) { Administrador } @else { Usuario } }
      </div>
    </div>
    <img
      class="d-flex "
      src="{{ user.imageUrl || '/assets/controls/user-photo.svg' }}"
      style="width: 70px;"
    />
    <div class="col-4 col-sm-5 col-md-6 col-lg-6 col-xl-5 bg-body-secondary ps-2">
      <div class="col-12 pt-2 fs-5 text-truncate">
        {{ user.name + ' ' + user.lastName }}
      </div>
      <small class="text-truncate fst-italic text-muted ">{{ user.job }}</small>
    </div>
    <div class="col bg-body-secondary d-xl-block d-xxl-none"></div>
    <div class="col bg-body-tertiary d-none d-xxl-block ps-2 pt-2">
      <h6>
        @if (this.cs.checkStatus(user) === 'online'){
        <span class="badge text-bg-success" animate.enter="fade-in-up">online</span>
        } @else {
        <span class="badge text-bg-danger" animate.enter="fade-in-up">offline</span>
        }
      </h6>
      <small class="fst-italic"> {{ timeConnected() | timeAgo }} </small>
    </div>
    <div class="d-inline text-end align-content-center bg-body-tertiary px-2">
      <app-users-actions [user]="user" [display]="'7'" />
    </div>
  `,
  host: {
    class: 'list-group-item list-group-item-action m-0 p-0 d-flex border-0 shadow',
    'animate.enter': 'fade-in-up',
  },
})
export class UserListItem implements OnInit, OnDestroy {
  @Input() user!: User;
  @Input() index!: number;

  protected readonly as = inject(AuthService);
  protected readonly us = inject(UserService);
  protected readonly cs = inject(ChatService);

  private interval?: number;

  timeConnected = signal<Date | string | undefined>('');

  ngOnInit(): void {
    this.updateTime();

    this.interval = window.setInterval(() => this.updateTime(), 1000);
  }

  onTouched(value: boolean) {
    this.us.selectMultiple(this.user.id!, value);
  }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  private updateTime(): void {
    const time = this.cs.timeByUser(this.user);

    this.timeConnected.set(time);
  }
}
