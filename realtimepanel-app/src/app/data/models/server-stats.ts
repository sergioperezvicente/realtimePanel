export interface ServerStats {
  connections: number;
  cpuLoad: [number, number, number];
  cpuPercent: number;
  cpus: number;
  memory: {
    total: number;
    free: number;
    used: number;
    percent: number;
  };
  disk?: {
    total: number;
    free: number;
    used: number;
    percent: number;
  };
  platform: string;
  release: string;
  uptime: number;
}