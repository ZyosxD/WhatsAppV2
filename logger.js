const chalk = require('chalk');
const { getCurrentTimestamp } = require('./time');

const log = (level, message, color) => {
    const timestamp = getCurrentTimestamp();
    console.log(`${chalk.gray(`[${timestamp}]`)} ${color(level.toUpperCase())}: ${message}`);
};

const logger = {
    info: (message) => log('info', message, chalk.blue),
    success: (message) => log('success', message, chalk.green),
    warn: (message) => log('warn', message, chalk.yellow),
    error: (message) => log('error', message, chalk.red),
    debug: (message) => log('debug', message, chalk.magenta),
};

module.exports = logger;
