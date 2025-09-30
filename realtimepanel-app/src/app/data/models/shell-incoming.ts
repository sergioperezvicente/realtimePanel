export interface ShellIncoming {
    level: 'log';
    message: string;
    context: string;
    timestamp: Date;
}