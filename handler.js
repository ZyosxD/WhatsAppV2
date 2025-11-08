const logger = require('./logger');
const { simulateHumanTyping } = require('./antiBan');
const { handleMessageWithAssistant } = require('./assistant');

// --- Static Content Definitions ---

const GREETING_MESSAGE = `
Hola! Soy *ZBot*, tu asistente virtual creado por Zyos.
Estoy aquí para ayudarte a diseñar y cotizar una solución de bot de WhatsApp a la medida de tu empresa.

*¿Qué tipo de bot se ajusta mejor a tus necesidades?*

*1. Básico* 🤖
   - Ideal para PYMES y startups.
   - Incluye menú de opciones y respuestas automáticas 24/7.

*2. Intermedio* 🚀
   - Perfecto para negocios en crecimiento.
   - Captura de datos de clientes (leads), reportes diarios y sistema anti-ban.

*3. Avanzado* 🧠
   - La solución definitiva para empresas consolidadas.
   - Flujo de conversación inteligente con IA, integraciones con CRM/Email y máxima escalabilidad.

Por favor, responde con el número (1, 2, o 3) que más te interese. Si deseas volver a ver este menú en cualquier momento, solo escribe la palabra: *Menú*.
`.trim();

const LEVEL_BASIC_INFO = `
*Nivel Básico: El Punto de Partida Ideal* 🌟

Este bot es perfecto para automatizar las preguntas más frecuentes y ofrecer atención inmediata a tus clientes.

*Incluye:*
- *Menú de Opciones:* Guía a tus usuarios a través de un menú interactivo.
- *Respuestas 24/7:* Tu negocio responde al instante, incluso fuera de horario.
- *QR de Fácil Acceso:* Generamos un código QR para que tus clientes inicien la conversación fácilmente.

Es la solución más rápida y económica para tener presencia profesional en WhatsApp.

Ahora, si estás listo, cuéntame un poco sobre tu empresa y lo que necesitas automatizar. El asistente inteligente tomará nota.
`.trim();

const LEVEL_INTERMEDIATE_INFO = `
*Nivel Intermedio: Crecimiento y Datos* 📈

Este nivel va un paso más allá, no solo responde, sino que también captura información valiosa para tu negocio.

*Incluye todo lo del Nivel Básico, más:*
- *Captura de Leads:* Recopila datos de contacto como nombre, email y teléfono.
- *Reportes Diarios:* Recibe un resumen de las interacciones y leads generados.
- *Sistema Anti-Ban:* Tecnología que simula el comportamiento humano para proteger tu línea.

Ideal para equipos de ventas que quieren convertir WhatsApp en una máquina de generar prospectos.

Para continuar, por favor, descríbeme tu negocio y tus objetivos. El asistente de IA está listo para escucharte.
`.trim();

const LEVEL_ADVANCED_INFO = `
*Nivel Avanzado: Inteligencia y Automatización Total* 🧠

La solución más potente, diseñada para empresas que buscan una automatización completa y personalizada.

*Incluye todo lo del Nivel Intermedio, más:*
- *Flujo Dinámico con IA:* Conversaciones naturales que se adaptan al cliente, sin menús rígidos.
- *Integraciones:* Conecta el bot con tu CRM, sistema de agendamiento, email marketing y más.
- *Escalabilidad Garantizada:* Preparado para manejar grandes volúmenes de conversaciones sin problemas.

Es la herramienta definitiva para optimizar ventas, soporte y marketing.

Para dar el siguiente paso, explícame los procesos que te gustaría automatizar. Nuestro asistente inteligente analizará tus necesidades.
`.trim();

// In-memory set to track which users have started a conversation with the assistant
const assistantConversations = new Set();

/**
 * Main handler for all incoming WhatsApp messages.
 * @param {object} client - The whatsapp-web.js client instance.
 * @param {object} message - The message object from whatsapp-web.js.
 */
const handleIncomingMessage = async (client, message) => {
    // Ignore messages sent by the bot itself or from status updates
    if (message.fromMe || message.isStatus) return;

    const chat = await message.getChat();
    const userPhone = message.from.replace('@c.us', '');
    const messageBody = message.body.trim();

    logger.info(`Message received from ${userPhone}: "${messageBody}"`);

    // Command to reset and show the main menu
    if (messageBody.toLowerCase() === 'menú') {
        assistantConversations.delete(userPhone); // End AI conversation context
        await simulateHumanTyping(chat, GREETING_MESSAGE);
        await chat.sendMessage(GREETING_MESSAGE);
        return;
    }

    // Handle initial menu selection if not in an AI conversation
    if (!assistantConversations.has(userPhone)) {
        let response;
        switch (messageBody) {
            case '1':
                response = LEVEL_BASIC_INFO;
                assistantConversations.add(userPhone); // Start AI conversation
                break;
            case '2':
                response = LEVEL_INTERMEDIATE_INFO;
                assistantConversations.add(userPhone); // Start AI conversation
                break;
            case '3':
                response = LEVEL_ADVANCED_INFO;
                assistantConversations.add(userPhone); // Start AI conversation
                break;
            default:
                // If it's the first message and not a menu option, show the greeting
                response = GREETING_MESSAGE;
                break;
        }

        await simulateHumanTyping(chat, response);
        await chat.sendMessage(response);
        return;
    }

    // If the user is in an active AI conversation, delegate to the assistant
    try {
        await chat.sendStateTyping(); // Let user know we're processing
        const assistantResponse = await handleMessageWithAssistant(userPhone, messageBody, client);
        await chat.clearState();

        if (assistantResponse) {
            await simulateHumanTyping(chat, assistantResponse);
            await chat.sendMessage(assistantResponse);
        } else {
            logger.warn(`No response generated by assistant for ${userPhone}.`);
        }
    } catch (error) {
        logger.error(`Error handling message with assistant: ${error.message}`);
        await chat.clearState();
        // Send a generic error message to the user
        const errorMessage = "Lo siento, estoy teniendo problemas técnicos. Por favor, intenta de nuevo en unos momentos.";
        await simulateHumanTyping(chat, errorMessage);
        await chat.sendMessage(errorMessage);
    }
};

module.exports = {
    handleIncomingMessage
};
