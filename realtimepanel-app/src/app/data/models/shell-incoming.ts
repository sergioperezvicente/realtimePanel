export interface ShellIncoming {
    level: 'log' | 'warn';
    message: string;
    context: string;
    timestamp: Date;
}