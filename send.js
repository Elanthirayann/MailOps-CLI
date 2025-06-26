const nodemailer = require("nodemailer");
const notifier = require("node-notifier");
const path = require("path");
const fs = require("fs");
const recorder = require("node-record-lpcm16");
const speech = require("@google-cloud/speech");
require("dotenv").config();

const client = new speech.SpeechClient();

// 🎤 Convert speech to text
async function voiceToText(languageCode = "en-US") {
  return new Promise((resolve, reject) => {
    const request = {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode,
      },
    };

    console.log(
      `🎤 Speak your email in ${languageCode} (Press Ctrl+C to stop)...`
    );
    const recognizeStream = client
      .streamingRecognize(request)
      .on("data", (data) => {
        console.log(
          "📝 Transcribed:",
          data.results[0].alternatives[0].transcript
        );
        resolve(data.results[0].alternatives[0].transcript);
      })
      .on("error", (err) => reject(err));

    recorder.record({ sampleRate: 16000 }).stream().pipe(recognizeStream);
  });
}

// 💬 Text formatting helper
function formatTextToHtml(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\n/g, "<br>");
}

// ✉️ Core function to send email
async function sendEmail(to, subject, body, attachments = null) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let formattedBody = formatTextToHtml(body);

  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: to.split(","),
    subject,
    html: `${formattedBody}<br><img src="https://yourserver.com/track?email=${to}" width="1" height="1">`,
  };

  if (attachments && attachments !== "no-attachment") {
    let files = attachments.split(",");
    let attachmentList = [];

    files.forEach((file) => {
      const normalizedPath = path.resolve(file.trim().replace(/^"|"$/g, ""));
      if (fs.existsSync(normalizedPath)) {
        attachmentList.push({ path: normalizedPath });
      } else {
        console.error(`❌ Attachment not found: ${normalizedPath}`);
        notifier.notify({
          title: "Email CLI",
          message: "❌ Attachment not found!",
          sound: true,
        });
      }
    });

    if (attachmentList.length > 0) {
      mailOptions.attachments = attachmentList;
    }
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    notifier.notify({
      title: "Email CLI",
      message: "✅ Email sent successfully!",
      sound: true,
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    notifier.notify({
      title: "Email CLI",
      message: "❌ Failed to send email!",
      sound: true,
    });
  }
}

// 🎤 Voice email function
async function sendEmailWithVoice(to, subject, language = "en-US") {
  try {
    const emailBody = await voiceToText(language);
    await sendEmail(to, subject, emailBody);
  } catch (error) {
    console.error("❌ Error in voice-to-text:", error);
  }
}

// 🔁 Reply to an email
async function replyToEmail(to, originalSubject, replyBody) {
  const replySubject = originalSubject.startsWith("Re:")
    ? originalSubject
    : `Re: ${originalSubject}`;
  await sendEmail(to, replySubject, replyBody);
}

// 📤 Forward an email
async function forwardEmail(to, originalSubject, forwardBody) {
  const forwardSubject = originalSubject.startsWith("Fwd:")
    ? originalSubject
    : `Fwd: ${originalSubject}`;
  await sendEmail(to, forwardSubject, forwardBody);
}

module.exports = {
  sendEmail,
  sendEmailWithVoice,
  replyToEmail,
  forwardEmail,
};
