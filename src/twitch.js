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

function connect() {
  twitch.connect().then(() => {
    console.log(
      `Connected to Twitch channel: '${process.env.TWITCH_COMMANDS_CHANNEL_NAME.yellow}' as user: '${process.env.TWITCH_CHAT_USERNAME.yellow}'`,
    );
    say('tiltify-bitbot-connector ready');
  });
}

module.exports = {
  connect,
  say,
};
