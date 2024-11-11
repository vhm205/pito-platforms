export interface LoggerOptions {
  level?: string; // Log level (default: 'info')
  logPath?: string; // Directory path for logs (default: 'logs')
  rotationFrequency?: string; // Log rotation frequency (default: 'YYYY-MM-DD')
  maxSize?: string; // Max size of log files (default: '20m')
  maxFiles?: string; // Max age of log files to keep (default: '14d')
  service: string; // Service name
}

export interface LogMetadata {
  context?: string;
  trace?: string;
  metadata?: any;
}
