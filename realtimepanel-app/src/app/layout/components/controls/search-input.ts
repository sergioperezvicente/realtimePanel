import { Component } from '@angular/core';

@Component({
  selector: 'search-input',
  imports: [],
  template: `<input
      type="text"
      id="generalSearchInput"
      name="generalSearchInput"
      class="form-control bs-warning-border-subtle"
      placeholder="Buscar..."
      aria-label="Buscar..."
      aria-describedby="icon"
    />
    <span class="input-group-text" id="icon">
      <span class="material-symbols-outlined">search</span>
    </span>`,
  host: {
    class: 'input-group',
  },
})
export class SearchInput {}
