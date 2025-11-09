const readline = require('readline');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const logger = require('./logger');
const { handleMessage } = require('./handler');
const sender = require('./sender');

logger.info('Iniciando ZyosMatt...');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

    rl.question('¿A quién deseas enviar los mensajes? (1: Individuales, 2: Grupos): ', (answer) => {
        const targetType = answer.trim();
        if (targetType === '1') {
            logger.info('Iniciando envío masivo a individuales...');
            sender.start(client, 'individual');
        } else if (targetType === '2') {
            logger.info('Iniciando envío masivo a grupos...');
            sender.start(client, 'group');
        } else {
            logger.error('Opción no válida. Por favor, reinicia el bot y elige 1 o 2.');
            client.destroy();
            process.exit(0);
        }
        rl.close();
    });
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
