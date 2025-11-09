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

    // Using the 'sv-SE' locale gives a YYYY-MM-DD HH:MM:SS format
    const formatter = new Intl.DateTimeFormat('sv-SE', options);
    const denverTime = formatter.format(new Date());

    // Replace the space with 'T' to match the ISO 8601 format
    return denverTime.replace(' ', 'T');
};

module.exports = { getCurrentTimestamp };
