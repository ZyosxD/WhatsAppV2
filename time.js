const getCurrentTimestamp = () => {
    const options = {
        timeZone: 'America/Denver',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    return new Date().toLocaleString('en-US', options);
};

module.exports = { getCurrentTimestamp };
