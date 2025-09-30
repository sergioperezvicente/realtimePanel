import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { WsService } from 'src/modules/ws/ws.service';

@Injectable()
export class LogsService extends ConsoleLogger implements LoggerService {
  constructor(private readonly wsService: WsService) {
    super();
  }

  log(message: any, context?: string) {
    const payload = `${message}`;

    super.log(payload, context);

    this.wsService.publishConsole({
      level: 'log',
      message: payload,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  error(message: any, stack?: string, context?: string) {
    super.error(`[ERROR] ${message}`, stack, context);
  }

  warn(message: any, context?: string) {
    const payload = `${message}`;
    
    super.warn(payload, context);

    this.wsService.publishConsole({
      level: 'warn',
      message: payload,
      context,
      timestamp: new Date().toISOString(),
    });

  }

  debug(message: any, context?: string) {
    const payload = `${message}`
    super.debug(payload, context);

    this.wsService.publishConsole({
      level: 'debug',
      message: payload,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  verbose(message: any, context?: string) {
    super.verbose(`[VERBOSE] ${message}`, context);
  }
}
