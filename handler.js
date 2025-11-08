const config = require('./config');
const logger = require('./logger');
const sender = require('./sender');

const handleMessage = async (message, client) => {
    const senderNumber = message.from.split('@')[0];
    const adminNumber = config.adminPhone.replace('+', '');

    if (senderNumber !== adminNumber) {
        return;
    }

    const command = message.body.toLowerCase();
    logger.info(`Comando recibido del administrador: ${command}`);

    switch (command) {
        case '!status':
            const status = sender.getStatus();
            await client.sendMessage(message.from, `*Estado de ZyosMass:*\n\n- Estado: ${status.isRunning ? 'Corriendo' : 'Detenido'}\n- Envíos restantes: ${status.remaining}\n- Envíos completados: ${status.completed}\n- Total: ${status.total}`);
            break;
        case '!pause':
            sender.pause();
            await client.sendMessage(message.from, '🤖 Campaña de envío masivo pausada.');
            break;
        case '!resume':
            sender.resume();
            await client.sendMessage(message.from, '▶️ Campaña de envío masivo reanudada.');
            break;
        case '!stop':
            sender.stop();
            await client.sendMessage(message.from, '🛑 Campaña de envío masivo detenida.');
            break;
    }
};

module.exports = { handleMessage };
