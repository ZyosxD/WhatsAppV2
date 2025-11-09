const chalk = require('chalk');
const { getCurrentTimestamp } = require('./time');

const log = (level, message) => {
    const timestamp = getCurrentTimestamp();
    let coloredLevel;

    switch (level) {
        case 'info':
            coloredLevel = chalk.blue(level.toUpperCase());
            break;
        case 'success':
            coloredLevel = chalk.green(level.toUpperCase());
            break;
        case 'warn':
            coloredLevel = chalk.yellow(level.toUpperCase());
            break;
        case 'error':
            coloredLevel = chalk.red(level.toUpperCase());
            break;
        default:
            coloredLevel = level.toUpperCase();
    }

    console.log(`[${timestamp}] [${coloredLevel}] ${message}`);
};

const logger = {
    info: (message) => log('info', message),
    success: (message) => log('success', message),
    warn: (message) => log('warn', message),
    error: (message) => log('error', message),
};

module.exports = logger;
