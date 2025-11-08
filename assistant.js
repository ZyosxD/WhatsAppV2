const OpenAI = require('openai');
const { openaiApiKey, assistantId } = require('./config');
const logger = require('./logger');
const { saveLead } = require('./storage');
const { sendInstantReport } = require('./report');
const { getISOTimestamp } = require('./time');

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: openaiApiKey });

// In-memory storage for user threads and names to maintain conversation context
const userThreads = new Map();
const userNames = new Map();

/**
 * Handles the tool call to save a lead, send a report, and generate a closing message.
 * This is the "Function Calling" part of the Assistants API.
 * @param {object} args - The arguments provided by the AI model.
 * @param {string} userPhone - The user's phone number.
 * @param {object} client - The whatsapp-web.js client instance to send reports.
 * @returns {string} The closing message to be sent back to the user.
 */
async function saveLeadAndGetClosingMessage(args, userPhone, client) {
    try {
        logger.info(`Function call received: save_lead_and_get_closing_message for ${userPhone}`);

        // Construct the lead object from the arguments provided by the model
        const leadData = {
            timestamp: getISOTimestamp(),
            user_phone: userPhone,
            level: args.level || 'No especificado',
            company: args.company || 'No especificado',
            name: args.name || 'No especificado',
            role: args.role || 'No especificado',
            industry: args.industry || 'No especificado',
            contact_preference: args.contact_preference || 'No especificado',
            needs: args.needs || 'No especificadas',
        };

        // 1. Save the lead to storage.json
        saveLead(leadData);

        // 2. Send an instant report to the admin
        await sendInstantReport(client, leadData);

        // 3. Store the user's name for future interactions to provide a personalized experience
        if (leadData.name && leadData.name !== 'No especificado') {
            userNames.set(userPhone, leadData.name);
            logger.debug(`Memorized name for ${userPhone}: ${leadData.name}`);
        }

        // 4. Return the closing message to be submitted back to the OpenAI run
        const closingMessage = `¡Perfecto, ${leadData.name}! He registrado tu interés en un bot de nivel ${leadData.level}. Un experto de nuestro equipo te contactará en las próximas 24 horas para agendar la entrevista de necesidades, una demo personalizada y entregarte la cotización exacta.`;

        return closingMessage;

    } catch (error) {
        logger.error(`Error in saveLeadAndGetClosingMessage: ${error.message}`);
        return "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.";
    }
}


/**
 * Processes an incoming message using the OpenAI Assistant.
 * @param {string} userPhone - The user's phone number.
 * @param {string} messageContent - The content of the user's message.
 * @param {object} client - The whatsapp-web.js client.
 * @returns {string} The assistant's response.
 */
const handleMessageWithAssistant = async (userPhone, messageContent, client) => {
    logger.info(`Processing message from ${userPhone} with Assistant.`);

    // 1. Get or create a thread for the user
    let threadId = userThreads.get(userPhone);
    if (!threadId) {
        try {
            const thread = await openai.beta.threads.create();
            threadId = thread.id;
            userThreads.set(userPhone, threadId);
            logger.success(`Created new thread ${threadId} for user ${userPhone}`);
        } catch (error) {
            logger.error(`Failed to create thread: ${error.message}`);
            return "Error: No pude iniciar una conversación. Intenta de nuevo más tarde.";
        }
    }

    // 2. Add user's message to the thread, injecting known name for context
    const userName = userNames.get(userPhone);
    const contextualizedMessage = userName
        ? `[El usuario ya me dijo que se llama: ${userName}] ${messageContent}`
        : messageContent;

    try {
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: contextualizedMessage,
        });
    } catch (error) {
        logger.error(`Failed to add message to thread: ${error.message}`);
        return "Error: No pude procesar tu mensaje. Intenta de nuevo.";
    }


    // 3. Create a run to process the thread
    let run;
    try {
        run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        });
    } catch (error) {
        logger.error(`Failed to create run: ${error.message}`);
        return "Error: No pude generar una respuesta. Intenta de nuevo.";
    }


    // 4. Poll for the run's result and handle tool calls
    try {
        while (true) {
            run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);

            // Handle function calling when the run requires action
            if (run.status === 'requires_action') {
                const toolCall = run.required_action.submit_tool_outputs.tool_calls[0];
                const functionName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);

                let output;
                if (functionName === 'save_lead_and_get_closing_message') {
                    output = await saveLeadAndGetClosingMessage(args, userPhone, client);
                } else {
                    throw new Error(`Unknown function call: ${functionName}`);
                }

                // Submit the tool's output back to the run
                await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
                    tool_outputs: [{
                        tool_call_id: toolCall.id,
                        output: JSON.stringify({ message: output }),
                    }],
                });
            }

            // Exit the loop if the run has reached a terminal state
            if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
                break;
            }

            // Wait before the next poll
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // 5. Retrieve and return the final message
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(run.thread_id);
            // The latest message is at the top of the list
            const response = messages.data[0].content[0].text.value;
            logger.success(`Assistant response for ${userPhone}: ${response}`);
            return response;
        } else {
            // Handle runs that ended in a non-completed state
            throw new Error(`Run ended with status: ${run.status}`);
        }
    } catch (error) {
        logger.error(`Error during run processing for thread ${threadId}: ${error.message}`);
        return "Lo siento, ocurrió un error inesperado al procesar tu solicitud.";
    }
};

module.exports = {
    handleMessageWithAssistant
};
