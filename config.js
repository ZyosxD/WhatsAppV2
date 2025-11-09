require('dotenv').config();

const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    adminPhone: process.env.ADMIN_PHONE,
};

module.exports = config;
