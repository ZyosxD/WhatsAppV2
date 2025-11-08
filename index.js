const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const logger = require('./logger');
const { handleMessage } = require('./handler');
const sender = require('./sender');

logger.info('Iniciando ZyosMass...');

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('qr', (qr) => {
    logger.info('Escanea este código QR con tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    logger.success('¡Cliente de WhatsApp listo!');
    logger.info('El bot está operativo y esperando para enviar mensajes.');
    logger.info('Para iniciar el envío masivo, los números deben estar en `numbers.txt`.');
    sender.start(client);
});

client.on('message', async (message) => {
    await handleMessage(message, client);
});

client.on('auth_failure', (msg) => {
    logger.error(`Error de autenticación: ${msg}`);
});

client.on('disconnected', (reason) => {
    logger.warn(`Cliente desconectado: ${reason}`);
    client.initialize();
});

client.initialize().catch(err => {
    logger.error(`Error al inicializar el cliente: ${err}`);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
});
