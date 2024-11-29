/** import packages [start] */
import log4js from 'log4js';
import config from 'config';
/** import packages [end] */

/**
 * Create logger
 * @param loggerName logger name
 */
export default function Logger(loggerName?: string): log4js.Logger {
    const logger = log4js.getLogger(loggerName);
    logger.level = config.get('Logger.level');
    return logger;
}
