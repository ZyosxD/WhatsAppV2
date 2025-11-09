const logger = require('./logger');

const randomDelay = () => {
    const min = 10000; // 10 seconds
    const max = 30000; // 30 seconds
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    logger.info(`Esperando ${delay / 1000} segundos...`);
    return new Promise(resolve => setTimeout(resolve, delay));
};

const simulateTyping = async (chat) => {
    await chat.sendStateTyping();
    const typingDuration = Math.random() * 2000 + 1000; // Simulate typing for 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, typingDuration));
    await chat.clearState();
};

module.exports = { randomDelay, simulateTyping };
