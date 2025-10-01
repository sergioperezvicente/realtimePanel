import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WsService } from '@core/services/ws';
import { environment } from '@env/environment';

@Component({
  selector: 'app-server-stats',
  imports: [CommonModule],
  template: `
    <svg
      class="d-sm-none d-md-block col-12 col-sm-3 col-md-4 col-lg-4"
      xmlns="http://www.w3.org/2000/svg"
      height="400px"
      viewBox="0 -960 960 960"
      width="400px"
      fill="currentColor"
      style="margin-top: -40px; margin-bottom: -40px; filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7));"
    >
      <path
        d="M140-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h240q24 0 42 18t18 42v600q0 24-18 42t-42 18H140Zm440 0q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h240q24 0 42 18t18 42v600q0 24-18 42t-42 18H580Zm-440-60h240v-600H140v600Zm440 0h240v-600H580v600ZM200-367h120v-60H200v60Zm440 0h120v-60H640v60ZM200-491h120v-60H200v60Zm440 0h120v-60H640v60ZM200-615h120v-60H200v60Zm440 0h120v-60H640v60ZM140-180h240-240Zm440 0h240-240Z"
      />
    </svg>
    <div class="col align-content-center">
      <div class="display-6 mb-3 text-theme">{{ apiUrl }}</div>
      <div class="display-8 mb-4">
        Plataforma: {{ ws.serverStats()?.platform }} version: {{ ws.serverStats()?.release }}
      </div>
      <div class="display-8 mb-2">
        Conexiones activas: <span class="text-warning">{{ ws.serverStats()?.connections }}</span>
      </div>
      <div class="d-flex align-items-center mb-2 display-8">
        <div class="d-inline material-symbols-outlined">memory</div>
        <div class="d-inline ms-1">
          <span class="text-theme">{{ ws.serverStats()?.cpus }}</span> CORES:
          {{ loadPercent | number : '1.0-0' }}%
        </div>
        <div class="col ms-3">
          <div
            class="progress"
            role="progressbar"
            [attr.aria-valuenow]="loadPercent"
            aria-valuemin="0"
            aria-valuemax="100"
            style="height: 25px;"
          >
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              [class.bg-success]="loadPercent < 50"
              [class.bg-warning]="loadPercent >= 50 && loadPercent < 80"
              [class.bg-danger]="loadPercent >= 80"
              [style.width.%]="loadPercent"
            ></div>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center mb-2 display-8">
        <div class="d-inline material-symbols-outlined">memory_alt</div>
        <div class="d-inline ms-1">
          <span class="text-theme">{{ memoryTotalGB | number : '1.0-2' }}</span> GB:
          {{ memoryPercent | number : '1.0-0' }}%
        </div>
        <div class="col ms-3">
          <div
            class="progress"
            role="progressbar"
            [attr.aria-valuenow]="memoryPercent"
            aria-valuemin="0"
            aria-valuemax="100"
            style="height: 25px;"
          >
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              [class.bg-success]="memoryPercent < 50"
              [class.bg-warning]="memoryPercent >= 50 && memoryPercent < 80"
              [class.bg-danger]="memoryPercent >= 80"
              [style.width.%]="memoryPercent"
            ></div>
          </div>
        </div>
      </div>

      
      <div class="d-flex align-items-center mb-2 display-8">
        <div class="d-inline material-symbols-outlined">hard_disk</div>
        <div class="d-inline">DISCO:</div>
        <div class="col ms-3">
          <div
            class="progress"
            role="progressbar"
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
            style="height: 25px;"
          >
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              style="width: 75%"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'row mb-3',
  },
})
export class ServerStats {
  protected readonly apiUrl = environment.apiUrl;
  protected readonly ws = inject(WsService);

  get memoryTotalGB(): number {
    return (this.ws.serverStats()?.memory?.total ?? 0) / 1e9;
  }

  get memoryPercent(): number {
    return this.ws.serverStats()?.memory?.percent ?? 0;
  }

  get loadPercent(): number {
    return this.ws.serverStats()?.cpuPercent ?? 0;
  }
}
