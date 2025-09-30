export interface ShellIncoming {
    level: 'log' | 'warn' | 'debug';
    message: string;
    context: string;
    timestamp: Date;
}