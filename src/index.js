const dotenv = require('dotenv');
dotenv.config();
const intercept = require('intercept-stdout');
const twitch = require('./twitch');
const tiltify = require('./tiltify');
require('colors');

intercept(function (txt) {
  if (txt.includes('error: No response from Twitch.')) return '';
  return new Date().toISOString().gray + ' ' + txt;
});

(async () => {
  const campaign = await tiltify.getCampaign();
  const campaignName = campaign.data.name.yellow;
  console.log(`Tiltify Campaign ${process.env.TILTIFY_CAMPAIGN_ID}: '${campaignName}'`);
  const rewards = await tiltify.getRewards();
  if (!rewards.length) {
    console.log('No campaign rewards found. Logging only.');
  } else {
    tiltify.storeRewards(rewards);
  }

  await twitch.connect();
  twitch.say(`Tiltify Campaign ${process.env.TILTIFY_CAMPAIGN_ID}: '${campaign.data.name}'`);
  tiltify.connect();
})();

process.on('uncaughtException', (err) => {
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error(err);
});
