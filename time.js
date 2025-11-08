const moment = require('moment-timezone');

const TIMEZONE = 'America/Denver';

/**
 * Returns the current timestamp in 'YYYY-MM-DD HH:mm:ss' format for the configured timezone.
 * @returns {string}
 */
const getCurrentTimestamp = () => {
    return moment().tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Returns the current timestamp in ISO 8601 format with timezone offset, compliant with JSON standards.
 * @returns {string}
 */
const getISOTimestamp = () => {
    return moment().tz(TIMEZONE).toISOString(true);
}

module.exports = {
    getCurrentTimestamp,
    getISOTimestamp,
    TIMEZONE
};
