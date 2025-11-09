const OpenAI = require('openai');
const config = require('./config');
const logger = require('./logger');

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

const getUniqueMessage = async (baseMessage) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un redactor de marketing. Reescribe este mensaje de forma natural y única. Mantén el link, la imagen y la firma: ZyosxD - t.me/zyosxd"
        },
        {
          role: "user",
          content: baseMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    logger.error(`Error al generar mensaje único con OpenAI: ${error.message}`);
    return baseMessage; // Fallback to base message
  }
};

module.exports = { getUniqueMessage };
