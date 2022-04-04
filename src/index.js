const dotenv = require('dotenv')
dotenv.config();
const intercept = require("intercept-stdout");
const twitch = require('./twitch');
const tiltify = require('./tiltify')
require('colors');

intercept(function (txt) {
    if (txt.includes('error: No response from Twitch.')) return '';
    return (new Date()).toISOString().gray + ' ' + txt;
});

(async () => {
    const campaign = await tiltify.getCampaign();
    console.log(`Tiltify Campaign ${process.env.TILTIFY_CAMPAIGN_ID}: '${campaign.data.name}'`.yellow);
    const rewards = await tiltify.getRewards();
    if (!rewards.length) {
        console.log('No campaign rewards found. Logging only.');
    } else {
        tiltify.storeRewards(rewards);
    }

    twitch.connect();
    tiltify.connect();
})();

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
});
