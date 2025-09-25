import { Injectable, signal, Type } from '@angular/core';
import { ModalColor } from '@enums/modal-color';
import { ModalSize } from '@enums/modal-size';

declare const bootstrap: any;

@Injectable({ providedIn: 'root' })
export class ModalsService {
  private modalInstance: any;
  public readonly component = signal<Type<any> | null>(null);
  public readonly title = signal<string>('');
  public readonly size = signal<ModalSize | undefined>(undefined);
  public readonly colour = signal<ModalColor | undefined>(undefined);

  public readonly state = signal<boolean>(false)

  public open(title: string, component?: Type<any>, size?: ModalSize, colour?: ModalColor) {
    const modal = document.getElementById('modalRoot');
    if (!modal) return;

    this.title.set(title);
    this.size.set(size);
    this.colour.set(colour);

    if (component) {
      this.component.set(component);
    }

    this.modalInstance = bootstrap.Modal.getOrCreateInstance(modal, {
      backdrop: 'static',
      focus: true,
    });
    this.state.set(true)
    this.modalInstance.show();
  }

  public close() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.modalInstance?.hide();
    this.state.set(false)
    this.component.set(null);
  }
}