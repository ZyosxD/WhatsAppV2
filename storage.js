const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const STORAGE_FILE = path.join(__dirname, 'storage.json');

/**
 * Reads all leads from the storage file.
 * @returns {Array} An array of lead objects.
 */
const readLeads = () => {
    try {
        if (!fs.existsSync(STORAGE_FILE)) {
            // If the file doesn't exist, create it with an empty array
            fs.writeFileSync(STORAGE_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(STORAGE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        logger.error(`Error reading from storage file: ${error.message}`);
        return [];
    }
};

/**
 * Saves a new lead to the storage file.
 * @param {Object} leadData The lead data to save.
 */
const saveLead = (leadData) => {
    try {
        const leads = readLeads();
        leads.push(leadData);
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(leads, null, 2));
        logger.success(`Successfully saved new lead for ${leadData.name} from ${leadData.company}.`);
    } catch (error) {
        logger.error(`Error saving lead to storage file: ${error.message}`);
    }
};

module.exports = {
    saveLead
};
