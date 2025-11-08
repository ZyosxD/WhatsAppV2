const config = require('./config');
const logger = require('./logger');

const sendReport = async (client, logEntry) => {
    try {
        const adminNumber = `${config.adminPhone}@c.us`;
        const reportMessage = `✅ Envío exitoso a: ${logEntry.phone}\n⏰ Hora: ${logEntry.timestamp}\n📄 Tipo: ${logEntry.type}`;
        await client.sendMessage(adminNumber, reportMessage);
        logger.success(`Reporte de envío exitoso enviado al administrador.`);
    } catch (error) {
        logger.error(`Error al enviar el reporte al administrador: ${error.message}`);
    }
};

module.exports = { sendReport };
