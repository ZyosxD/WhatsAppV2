const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('./logger');
const { handleIncomingMessage } = require('./handler');

// --- Welcome Message ---
logger.info("=======================================");
logger.info("        ZBot - WhatsApp Sales Bot        ");
logger.info("         Creado por Zyos                 ");
logger.info("=======================================");
logger.info("Initializing bot...");

// --- WhatsApp Client Initialization ---
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for running in some environments
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

// --- Event Listener: QR Code Generation ---
client.on('qr', (qr) => {
    logger.info('QR Code received, please scan with your phone.');
    qrcode.generate(qr, { small: true });
});

// --- Event Listener: Authentication Success ---
client.on('ready', () => {
    logger.success('ZBot is connected and ready to sell!');
    logger.info(`Operating 24/7 from Utah (America/Denver).`);
    logger.info("Send 'Menú' to any chat to see the main menu.");
});

// --- Event Listener: Authentication Failure ---
client.on('auth_failure', (msg) => {
    logger.error(`Authentication failed: ${msg}`);
});

// --- Event Listener: Client Disconnected ---
client.on('disconnected', (reason) => {
    logger.warn(`Client was logged out: ${reason}`);
    // Optional: Add logic to attempt reconnection or notify admin
});

// --- Event Listener: Incoming Message ---
client.on('message', (message) => {
    // Pass the message to the central handler
    handleIncomingMessage(client, message);
});

// --- Start the Client ---
client.initialize().catch(err => {
    logger.error(`Failed to initialize client: ${err}`);
});

// --- Graceful Shutdown ---
process.on('SIGINT', async () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    await client.destroy();
    process.exit(0);
});
