import { AfterViewInit, Component, effect, inject, Injector, runInInjectionContext, ViewChild, viewChild, ViewContainerRef } from '@angular/core';
import { WsService } from '@core/services/ws';
import { ShellIncoming } from '../partials/shell-incoming';

@Component({
  selector: 'app-server-console',
  imports: [],
  template: `
    <div class="card-header display-8 d-flex align-items-center ps-0">
      <div class="display-6 material-symbols-outlined mx-3">terminal</div>
      <div class="d-block">Terminal</div>
    </div>
    <div class="card-body">
      <ng-container #shell></ng-container>
    </div>
    <!-- <div class="card-footer"></div> -->
  `,
  host: {
    class: 'card shadow',
  },
})
export class Console implements AfterViewInit {
  @ViewChild('shell', { read: ViewContainerRef }) shell!: ViewContainerRef;
  private readonly ws = inject(WsService);

  constructor(private injector: Injector) {}

  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const incoming = this.ws.shellIncoming();
        if (incoming) {
          const component = this.shell.createComponent(ShellIncoming);
          component.instance.message = incoming.message;
          component.instance.level = incoming.level;
          component.instance.context = incoming.context;
          component.instance.timestamp = incoming.timestamp;
          component.changeDetectorRef.detectChanges();
        }
      });
    });
  }
}
