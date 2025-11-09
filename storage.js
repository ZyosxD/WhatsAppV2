const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const logFilePath = path.join(__dirname, 'sent_log.json');

const initializeLogFile = () => {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, JSON.stringify([], null, 2));
    }
};

const recordSentMessage = (logEntry) => {
    try {
        initializeLogFile();
        const logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
        logs.push(logEntry);
        fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
        logger.info(`Registro de envío guardado para ${logEntry.phone}`);
    } catch (error) {
        logger.error(`Error al guardar el registro de envío: ${error.message}`);
    }
};

module.exports = { recordSentMessage };
