const { sendEmail, replyToEmail, forwardEmail } = require("./send");
const { readEmails } = require("./read");
const { starEmail, fetchStarredEmails } = require("./star");
const { deleteEmail } = require("./delete");
const { unsendEmail } = require("./unsend");
const { trackMailOpen } = require("./track");
const searchEmails = require("./searchEmails");
const {
  smartReply,
  enhanceSubject,
  changeTone,
  detectSentiment,
  translateText,
} = require("./huggingface-ai");

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  switch (command) {
    case "send":
      sendEmail(args[1], args[2], args[3], args[4]);
      break;

    case "reply":
      if (args.length < 5) {
        console.log(
          "❌ Usage: node email-cli.js reply <to> <subject> <original_body> <reply_body>"
        );
      } else {
        replyToEmail(args[1], args[2], args[3], args[4]);
      }
      break;

    case "reply-smart":
      if (args.length < 4) {
        console.log(
          "❌ Usage: node email-cli.js reply-smart <to> <subject> <original_body>"
        );
      } else {
        try {
          const reply = await smartReply(args[2], args[3]);
          replyToEmail(args[1], args[2], args[3], reply);
        } catch (err) {
          console.error("AI Error:", err);
        }
      }
      break;

    case "subject-enhance":
      if (args.length < 2) {
        console.log("❌ Usage: node email-cli.js subject-enhance <subject>");
      } else {
        const enhanced = await enhanceSubject(args[1]);
        console.log("🧠 Enhanced Subject:", enhanced);
      }
      break;

    case "tone-change":
      if (args.length < 3) {
        console.log(
          "❌ Usage: node email-cli.js tone-change <draft_text> <tone>"
        );
      } else {
        const revised = await changeTone(args[1], args[2]);
        console.log(`🎯 Tone-Changed Draft:\n${revised}`);
      }
      break;

    case "sentiment":
      if (args.length < 2) {
        console.log("❌ Usage: node email-cli.js sentiment <email_body>");
      } else {
        const sentiment = await detectSentiment(args[1]);
        console.log("🧠 Sentiment:", sentiment);
      }
      break;

    case "translate":
      if (args.length < 3) {
        console.log(
          "❌ Usage: node email-cli.js translate <email_body> <language_code>"
        );
      } else {
        const translated = await translateText(args[1], args[2]);
        console.log(`🌐 Translated Text (${args[2]}):\n${translated}`);
      }
      break;

    case "forward":
      forwardEmail(args[1], args[2], args[3]);
      break;

    case "read":
      readEmails(args[1], args[2], args[3]);
      break;

    case "searchsender":
      searchEmails(args[1]);
      break;

    case "star":
      starEmail(args[1]);
      break;

    case "fetch":
      fetchStarredEmails();
      break;

    case "delete":
      deleteEmail(args.slice(1).join(" "));
      break;

    case "unsend":
      unsendEmail(args[1]);
      break;

    case "track":
      trackMailOpen(args[1]);
      break;

    case "help":
      console.log(`
Usage:
  node email-cli.js send <to> <subject> <body> [attachment]
  node email-cli.js reply <to> <subject> <original_body> <reply_body>
  node email-cli.js reply-smart <to> <subject> <original_body>
  node email-cli.js subject-enhance <subject>
  node email-cli.js tone-change <draft_text> <tone>
  node email-cli.js sentiment <email_body>
  node email-cli.js translate <email_body> <language_code>
  node email-cli.js forward <to> <subject> <body>
  node email-cli.js read latest 5
  node email-cli.js delete <email_id>
  node email-cli.js star <email_id>
  node email-cli.js fetch
  node email-cli.js unsend <email_id>
  node email-cli.js track <email_id>
`);
      break;

    default:
      console.log("❌ Unknown command. Use 'help' for usage instructions.");
  }
})();
