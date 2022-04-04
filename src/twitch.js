const tmi = require('tmi.js');

const twitch = new tmi.client({
  channels: [process.env.TWITCH_COMMANDS_CHANNEL_NAME],
  identity: {
    username: process.env.TWITCH_CHAT_USERNAME,
    password: process.env.TWITCH_CHAT_PASSWORD,
  },
});

function say(message) {
  twitch.say(process.env.TWITCH_COMMANDS_CHANNEL_NAME, message).catch(() => {});
}

async function connect() {
  await twitch.connect().then(() => {
    const channelName = process.env.TWITCH_COMMANDS_CHANNEL_NAME.yellow;
    const username = process.env.TWITCH_CHAT_USERNAME.yellow;
    console.log(`Connected to Twitch channel: '${channelName}' as user: '${username}'`);
  });
}

module.exports = {
  connect,
  say,
};
