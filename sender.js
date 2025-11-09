const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const logger = require('./logger');
const { getUniqueMessage } = require('./assistant');
const { recordSentMessage } = require('./storage');
const { getCurrentTimestamp } = require('./time');
const { sendReport } = require('./report');
const { randomDelay, simulateTyping } = require('./antiBan');

let isRunning = false;
let isPaused = false;
let isStopped = false;
let targets = [];
let currentIndex = 0;

const start = async (client, targetType) => {
    if (isRunning) {
        logger.warn('El proceso de envío masivo ya está en ejecución.');
        return;
    }

    try {
        const filePath = path.join(__dirname, targetType === 'individual' ? 'numbers.txt' : 'groups.txt');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        targets = fileContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));

        currentIndex = 0;
        isRunning = true;
        isPaused = false;
        isStopped = false;

        logger.info(`Iniciando envío masivo a ${targets.length} ${targetType === 'individual' ? 'números' : 'grupos'}.`);

        for (currentIndex = 0; currentIndex < targets.length; currentIndex++) {
            if (isStopped) {
                logger.info('Envío masivo detenido por el administrador.');
                break;
            }

            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const target = targets[currentIndex].trim();
            const chatId = targetType === 'individual' ? `${target}@c.us` : target;

            try {
                const messageBasePath = path.join(__dirname, 'messages', 'message_1.txt');
                const baseMessage = fs.readFileSync(messageBasePath, 'utf-8');
                const uniqueMessage = await getUniqueMessage(baseMessage);

                const imagePath = path.join(__dirname, 'messages', 'image_1.jpg');
                const captionPath = path.join(__dirname, 'messages', 'caption_1.txt');

                const chat = await client.getChatById(chatId);
                await simulateTyping(chat);

                if (fs.existsSync(imagePath)) {
                    const media = MessageMedia.fromFilePath(imagePath);
                    const caption = fs.existsSync(captionPath) ? fs.readFileSync(captionPath, 'utf-8') : '';
                    await client.sendMessage(chatId, media, { caption: `${uniqueMessage}\n${caption}` });
                } else {
                    await client.sendMessage(chatId, uniqueMessage);
                }

                const logEntry = {
                    phone: target,
                    timestamp: getCurrentTimestamp(),
                    message_id: `msg_${Date.now()}`,
                    status: 'sent',
                    type: fs.existsSync(imagePath) ? 'image+text' : 'text',
                };

                recordSentMessage(logEntry);
                await sendReport(client, logEntry);

            } catch (error) {
                logger.error(`Error al enviar mensaje a ${target}: ${error.message}`);
                const logEntry = {
                    phone: target,
                    timestamp: getCurrentTimestamp(),
                    message_id: `msg_${Date.now()}`,
                    status: 'failed',
                    type: 'unknown',
                    error: error.message,
                };
                recordSentMessage(logEntry);
            }

            if (currentIndex < targets.length - 1) {
                await randomDelay();
            }
        }
    } catch (error) {
        logger.error(`Error al iniciar el envío masivo: ${error.message}`);
    } finally {
        isRunning = false;
        logger.info('Proceso de envío masivo finalizado.');
    }
};

const pause = () => {
    if (isRunning && !isPaused) {
        isPaused = true;
        logger.info('Envío masivo pausado.');
    }
};

const resume = () => {
    if (isRunning && isPaused) {
        isPaused = false;
        logger.info('Envío masivo reanudado.');
    }
};

const stop = () => {
    if (isRunning) {
        isStopped = true;
        logger.info('Deteniendo el envío masivo...');
    }
};

const getStatus = () => {
    return {
        isRunning,
        isPaused,
        isStopped,
        total: targets.length,
        completed: currentIndex,
        remaining: targets.length - currentIndex,
    };
};

module.exports = { start, pause, resume, stop, getStatus };
