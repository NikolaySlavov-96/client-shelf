/* eslint-disable no-console */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

const envLevel = (import.meta.env?.VITE_LOG_LEVEL ?? '').toString().toLowerCase() as LogLevel;
const isProd = import.meta.env?.PROD === true;
const ACTIVE_LEVEL: LogLevel = envLevel in LEVEL_ORDER ? envLevel : isProd ? 'warn' : 'debug';

const shouldLog = (level: LogLevel) => LEVEL_ORDER[level] >= LEVEL_ORDER[ACTIVE_LEVEL];

const format = (level: LogLevel, scope: string | undefined, message: string) => {
    const ts = new Date().toISOString();
    const scopeTag = scope ? ` [${scope}]` : '';
    return `${ts} [${level.toUpperCase()}]${scopeTag} ${message}`;
};

const write = (level: LogLevel, scope: string | undefined, message: string, args: unknown[]) => {
    if (!shouldLog(level)) return;
    const line = format(level, scope, message);
    switch (level) {
        case 'debug':
            console.debug(line, ...args);
            break;
        case 'info':
            console.info(line, ...args);
            break;
        case 'warn':
            console.warn(line, ...args);
            break;
        case 'error':
            console.error(line, ...args);
            break;
    }
};

export interface ILogger {
    debug: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
    child: (childScope: string) => ILogger;
}

const build = (scope?: string): ILogger => ({
    debug: (message, ...args) => write('debug', scope, message, args),
    info: (message, ...args) => write('info', scope, message, args),
    warn: (message, ...args) => write('warn', scope, message, args),
    error: (message, ...args) => write('error', scope, message, args),
    child: (childScope) => build(scope ? `${scope}:${childScope}` : childScope),
});

export const logger: ILogger = build();

export const createLogger = (scope: string): ILogger => build(scope);
