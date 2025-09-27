import { Component, Input } from '@angular/core';
import { MaterialButton } from '@app/shared/controls/material-button';

@Component({
  selector: 'search-input',
  imports: [MaterialButton],
  template: `<input
      type="text"
      id="generalSearchInput"
      name="generalSearchInput"
      class="form-control bs-warning-border-subtle"
      placeholder="Buscar..."
      aria-label="Buscar..."
    />
    <span class="input-group-text" role="button" id="icon">
      <app-material-button class="mt-1" icon="search" color="text-secondary" title="Buscar" />
    </span>`,
  host: {
    class: 'input-group',
  },
})
export class SearchInput {}
