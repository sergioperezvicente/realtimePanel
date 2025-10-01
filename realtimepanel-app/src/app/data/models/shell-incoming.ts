export interface ShellIncoming {
  level: 'log' | 'warn' | 'debug' | 'error';
  message: string;
  context: string;
  timestamp: Date;
}
