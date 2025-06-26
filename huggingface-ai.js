require("dotenv").config();
const axios = require("axios");

const HUGGINGFACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const headers = {
  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
};

const HF_API_URL = "https://api-inference.huggingface.co/models";

// Smart Reply
async function smartReply(subject, body) {
  const input = `Reply to this email:\nSubject: ${subject}\n${body}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No reply generated.";
}

// Enhance Subject
async function enhanceSubject(subject) {
  const input = `Enhance this subject line to make it more engaging: "${subject}"`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No enhancement provided.";
}

// Change Tone
async function changeTone(text, tone = "formal") {
  const input = `Rewrite this email in a ${tone} tone:\n${text}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No tone-changed version.";
}

// Detect Sentiment
async function detectSentiment(text) {
  const input = `Detect the sentiment of this email:\n${text}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No sentiment detected.";
}

// Translate Text
async function translateText(text, langCode = "fr") {
  const input = `Translate the following email to ${langCode}:\n${text}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No translation provided.";
}

module.exports = {
  smartReply,
  enhanceSubject,
  changeTone,
  detectSentiment,
  translateText,
};
