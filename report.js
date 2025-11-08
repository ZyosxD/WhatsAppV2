const { adminPhone } = require('./config');
const logger = require('./logger');

/**
 * Generates and sends an instant report to the admin's phone number.
 * This function is triggered immediately after a lead is successfully saved.
 *
 * @param {object} client - The whatsapp-web.js client instance.
 * @param {object} leadData - The data of the lead that was just captured.
 */
const sendInstantReport = async (client, leadData) => {
    if (!adminPhone) {
        logger.warn('ADMIN_PHONE not set. Skipping instant report.');
        return;
    }

    try {
        const reportMessage = `
🔔 *¡Nuevo Lead Capturado!* 🔔

Un nuevo cliente potencial ha completado el formulario a través de ZBot.

*Detalles del Lead:*
- *Nivel de Bot de Interés:* ${leadData.level}
- *Empresa:* ${leadData.company}
- *Nombre:* ${leadData.name}
- *Cargo:* ${leadData.role}
- *Industria:* ${leadData.industry}
- *Teléfono del Cliente:* ${leadData.user_phone}
- *Preferencia de Contacto:* ${leadData.contact_preference}
- *Necesidades Específicas:* ${leadData.needs}

*Acción Recomendada:*
Contactar al cliente en las próximas 24 horas para agendar la demo.

---
*Reporte generado automáticamente por ZBot.*
*Creado por Zyos*
`;

        // Format the admin phone number for the API (e.g., 13856012999@c.us)
        const adminChatId = `${adminPhone}@c.us`;

        await client.sendMessage(adminChatId, reportMessage.trim());
        logger.success(`Instant report sent successfully to ${adminPhone}.`);

    } catch (error) {
        logger.error(`Failed to send instant report: ${error.message}`);
        // Optionally, send a fallback message if sending fails
        try {
            await client.sendMessage(`${adminPhone}@c.us`, `Error al generar reporte para lead de ${leadData.user_phone}. Revisa los logs.`);
        } catch (fallbackError) {
            logger.error(`Failed to send fallback error report: ${fallbackError.message}`);
        }
    }
};

module.exports = {
    sendInstantReport
};
