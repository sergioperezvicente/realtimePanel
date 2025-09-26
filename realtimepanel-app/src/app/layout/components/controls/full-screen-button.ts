import { Component } from '@angular/core';

@Component({
  selector: 'full-screen-button',
  imports: [],
  template: `fullscreen`,
  host: {
    class: 'material-symbols-outlined display-7 span-btn',
    type: 'button',
    title: 'Ampliar a pantalla completa',
    'data-bs-toggle': 'tooltip',
    '(click)': 'toggleFullScreen()',
  },
})
export class FullScreenButton {
  protected toggleFullScreen(): void {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        /* Safari */
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        /* IE11 */
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        /* Safari */
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        /* IE11 */
        (document as any).msExitFullscreen();
      }
    }
  }
}
