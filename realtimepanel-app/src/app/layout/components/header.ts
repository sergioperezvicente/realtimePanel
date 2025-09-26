import { Component } from '@angular/core';
import { MenuButton } from './controls/menu-button';
import { SearchInput } from './controls/search-input';
import { FullScreenButton } from './controls/full-screen-button';
import { LogoutButton } from './controls/logout-button';
import { DarkModeButton } from './controls/dark-mode-button';
import { ChatButton } from './controls/chat-button';

@Component({
  selector: 'app-header',
  imports: [MenuButton, SearchInput, FullScreenButton, LogoutButton, DarkModeButton, ChatButton],
  template: `
    <div class="d-grip d-block d-md-none align-items-center">
      <menu-button />
    </div>
    <div class="d-grid col-6 ms-3">
      <search-input />
    </div>
    <div class="d-grip col-5 text-end align-items-center">
      <!-- <user-dropdown /> -->
      <chat-button class="me-1" />
      <dark-mode-button class="me-1" />
      <full-screen-button class="me-1" />
      <logout-button />
    </div>
  `,
  host: {
    class: 'navbar shadow z-1 p-3 ',
    'animate.enter': 'fade-in-down'
  },
})
export class Header {

}