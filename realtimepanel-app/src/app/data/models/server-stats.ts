export interface ServerStats {
  connections: number;
  cpuLoad: [number, number, number];       // loadavg crudo (1,5,15 min)
  cpuPercent: number;    // porcentaje normalizado según núcleos
  cpus: number;                            // núcleos lógicos
  memory: {
    total: number;                         // bytes totales
    free: number;                          // bytes libres
    used: number;                          // bytes usados
    percent: number;                        // porcentaje de memoria usada
  };
  platform: string;                         // sistema operativo
  release: string;                          // versión del OS
  uptime: number;                            // segundos activo
}