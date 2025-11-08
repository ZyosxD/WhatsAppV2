const logger = require('./logger');

/**
 * Calculates a delay based on the message length to simulate human typing.
 * A more realistic delay is calculated based on characters per minute.
 * Average human typing speed is around 40 WPM (words per minute).
 * Average word length is ~5 characters. So, 40 WPM * 5 = 200 chars/min.
 * 60,000 ms / 200 chars = 300 ms/char. We'll use a slightly faster, more variable rate.
 *
 * @param {string} message The message text.
 * @returns {number} Delay in milliseconds.
 */
const getTypingDelay = (message) => {
    const charsPerMinute = 1000; // Simulating a fast typist at ~200 WPM
    const msPerChar = 60000 / charsPerMinute;
    const baseDelay = 500; // Minimum delay to seem natural
    const calculatedDelay = baseDelay + (message.length * msPerChar * (0.8 + Math.random() * 0.4)); // Add 20% randomness

    logger.debug(`Calculated anti-ban delay for ${message.length} chars: ${Math.round(calculatedDelay)}ms`);
    return Math.round(calculatedDelay);
};

/**
 * Pauses execution for a specified amount of time.
 * @param {number} ms Milliseconds to wait.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates human typing before sending a message.
 * Sets 'typing' state, waits, then clears it.
 * @param {object} chat The whatsapp-web.js chat object where the message will be sent.
 * @param {string} message The message content to be sent.
 */
const simulateHumanTyping = async (chat, message) => {
    try {
        await chat.sendStateTyping();
        const delay = getTypingDelay(message);
        await sleep(delay);
        await chat.clearState();
    } catch (error) {
        logger.error(`Failed to simulate typing: ${error.message}`);
    }
};

module.exports = { simulateHumanTyping };
