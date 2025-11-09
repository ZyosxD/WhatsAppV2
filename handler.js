const config = require('./config');
const logger = require('./logger');
const sender = require('./sender');

const handleMessage = async (message, client) => {
    const command = message.body.toLowerCase();
    const chat = await message.getChat();

    // Comando para obtener el ID del grupo (disponible para todos en el grupo)
    if (command === '!groupid' && chat.isGroup) {
        logger.info(`Comando !groupid recibido en el grupo: ${chat.name}`);
        await client.sendMessage(message.from, `El ID de este grupo es:\n${message.from}`);
        return;
    }

    // Comandos de administrador (solo para el número de admin)
    const author = chat.isGroup ? message.author : message.from;
    const senderNumber = author.split('@')[0];
    const adminNumber = config.adminPhone.replace('+', '');

    if (senderNumber !== adminNumber) {
        return;
    }

    logger.info(`Comando de administrador recibido: ${command}`);

    switch (command) {
        case '!status':
            const status = sender.getStatus();
            await client.sendMessage(message.from, `*Estado de ZyosMatt:*\n\n- Estado: ${status.isRunning ? 'Corriendo' : 'Detenido'}\n- Envíos restantes: ${status.remaining}\n- Envíos completados: ${status.completed}\n- Total: ${status.total}`);
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
