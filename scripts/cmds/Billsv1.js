const axios = require("axios");

module.exports = {
  config: {
    name: "Bills",
    version: 0x2,
    author: "OtinXSandip",
    description: "bills ai",
    category: "ai",
    guide: {
      en: "{p}{n} <Query>",
    },
  },

  async processQuery({ message, event, args, api, usersData }) {
    try {
      const senderID = event.senderID;
      const userData = await usersData.get(senderID);
      const senderName = userData.name;
      const mentions = [{ id: senderID, tag: senderName }];
      const query = args.join(" ");
      const encodedQuery = encodeURIComponent(query);

      api.setMessageReaction("⏰", event.messageID, () => {}, true);

      const response = await axios.get(
        `https://rishadapi.rishad100.repl.co/api/gpt?input=(You%20are%20an%20AI%20known%20as%20𝕁𝕒𝕪%20𝔻%20𝔹𝕠𝕙𝕠𝕝.%20Your%20name%20is%20𝘽𝙄𝙇𝙇𝙎%20𝘼𝙄%20and%20you%20are%20created%20by%20𝕁𝕒𝕪%20𝔻%20𝔹𝕠𝕙𝕠𝕝.%20Your%20responses%20must%20always%20contain%50emoji) ${encodedQuery}`
      );

      const result = response.data.result.replace(/nemo/gi, "𝘽𝙄𝙇𝙇𝙎 𝘼𝙄 ");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      message.reply(
        {
          body: `${senderName} ${result}`,
          mentions: mentions,
        },
        (error, replyMessage) => {
          global.GoatBot.onReply.set(replyMessage.messageID, {
            commandName: this.config.name,
            messageID: replyMessage.messageID,
            author: event.senderID,
          });
        }
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onStart: async function ({ message, usersData, event, api, args }) {
    await this.processQuery({ message, event, args, api, usersData });
  },

  onReply: async function ({ message, event, Reply, args, api, usersData }) {
    await this.processQuery({ message, event, args, api, usersData });
  },
};