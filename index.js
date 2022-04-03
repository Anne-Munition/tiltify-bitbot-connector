const WebSocket = require('ws');
const tmi = require('tmi.js');
const config = require('./config');
const axios = require('axios');
const fs = require('fs');
const intercept = require("intercept-stdout");
require('colors');

const unhook_intercept = intercept(function (txt) {
    if (txt.includes('error: No response from Twitch.')) return '';
    return (new Date()).toISOString().gray + ' ' + txt;
});

const rewardObj = {};
let nonce = 0
const reconnectInterval = 1000 * 3;

async function getCampaign() {
    return axios.get(`https://tiltify.com/api/v3/campaigns/${config.tiltifyCampaignId}`, {
        headers: {Authorization: `Bearer ${config.tiltifyAccessToken}`}
    }).then(({data}) => data)
}

async function getRewards() {
    return axios.get(`https://tiltify.com/api/v3/campaigns/${config.tiltifyCampaignId}/rewards`, {
        headers: {Authorization: `Bearer ${config.tiltifyAccessToken}`}
    }).then(({data}) => data.data)
}

(async () => {
    const campaign = await getCampaign();
    console.log(`Tiltify Campaign ${config.tiltifyCampaignId}: '${campaign.data.name}'`.yellow);
    const rewards = await getRewards();
    if (!rewards.length) {
        console.log('No campaign rewards found. Logging only.');
    } else {
        rewards.forEach(x => {
            rewardObj[x.id.toString()] = x.name;
        })
        console.log("Reward IDS", rewardObj)
        console.log('Saving rewards to file');
        fs.writeFileSync('./rewards.json', JSON.stringify(rewardObj, null, 2), {encoding: 'utf8'})
    }

    const twitch = new tmi.client({
        channels: [config.twitchCommandsChannelName],
        identity: config.twitchIdentity
    })

    function say(message) {
        twitch.say(config.twitchCommandsChannelName, message).catch(() => {
        });
    }

    twitch.connect().then(() => {
        console.log(`Connected to Twitch channel: '${config.twitchCommandsChannelName.yellow}' as user: '${config.twitchIdentity.username.yellow}'`);
        say('tiltify-bitbot-connector ready');
    });

    function connectTiltify() {

        const ws = new WebSocket('wss://websockets.tiltify.com/socket/websocket?vsn=2.0.0')

        function send(args, isHeartbeat) {
            nonce++;
            const data = [isHeartbeat ? null : nonce.toString(), nonce.toString(), ...args];
            ws.send(JSON.stringify(data));
        }

        function heartbeat() {
            const data = ["phoenix", "heartbeat", {}];
            send(data, true)
        }

        ws.on('open', function open() {
            console.log('Connected to Tiltify websocket');
            send([`campaign.${config.tiltifyCampaignId}.donation`, "phx_join", {}]);
            setInterval(heartbeat, 1000 * 30)
        });

        ws.on('close', function close() {
            console.log('Tiltify disconnected'.red);
            setTimeout(connectTiltify, reconnectInterval);
        });

        ws.on('message', function message(data) {
            const [, nonce, , type, payload] = JSON.parse(data);
            if (nonce) return;
            if (type === 'donation' && payload) {
                const amount = `$${payload.amount.toString()}`.green;
                if (payload.reward_id) {
                    const reward = rewards[payload.reward_id.toString()].green;
                    console.log(`${amount} donation from '${payload.name}' - Claimed '${reward}'.`)
                    say(payload.reward_id.toString())
                } else {
                    console.log(`${amount} donation from '${payload.name}'`)
                }
            }
        });
    }

    connectTiltify();
})();

process.on('uncaughtException', (err) => {
    console.error(err);
});

process.on('unhandledRejection', (err) => {
    console.error(err);
});
