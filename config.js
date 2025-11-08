require('dotenv').config();

module.exports = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  assistantId: process.env.ASSISTANT_ID,
  adminPhone: process.env.ADMIN_PHONE
};
