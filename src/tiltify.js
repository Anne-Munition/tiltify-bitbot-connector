const axios = require("axios");
const WebSocket = require('ws');
const twitch = require('./twitch');
const fs = require("fs");
require('colors');

const rewardObj = {};
let nonce = 0
const reconnectInterval = 1000 * 3;

async function getCampaign() {
    return axios.get(`https://tiltify.com/api/v3/campaigns/${process.env.TILTIFY_CAMPAIGN_ID}`, {
        headers: {Authorization: `Bearer ${process.env.TILTIFY_ACCESS_TOKEN}`}
    }).then(({data}) => data)
}

async function getRewards() {
    return axios.get(`https://tiltify.com/api/v3/campaigns/${process.env.TILTIFY_CAMPAIGN_ID}/rewards`, {
        headers: {Authorization: `Bearer ${process.env.TILTIFY_ACCESS_TOKEN}`}
    }).then(({data}) => data.data)
}

function storeRewards(rewards) {
    rewards.forEach(x => {
        rewardObj[x.id.toString()] = x.name;
    })
    console.log("Reward IDS", rewardObj)
    console.log('Saving rewards to file');
    fs.writeFileSync('./rewards.json', JSON.stringify(rewardObj, null, 2), {encoding: 'utf8'})
}

function connect() {
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
        send([`campaign.${process.env.TILTIFY_CAMPAIGN_ID}.donation`, "phx_join", {}]);
        setInterval(heartbeat, 1000 * 30)
    });

    ws.on('close', function close() {
        console.log('Tiltify disconnected'.red);
        setTimeout(connect, reconnectInterval);
    });

    ws.on('message', processTiltifyMessage);
}

function processTiltifyMessage(data) {
    const [, nonce, , type, payload] = JSON.parse(data);
    if (nonce) return;
    if (type === 'donation' && payload) {
        const amount = `$${payload.amount.toString()}`.green;
        if (payload.reward_id) {
            const reward = (rewardObj[payload.reward_id.toString()] || 'Unknown').yellow;
            console.log(`${amount} donation from ${payload.name.yellow} - Claimed: ${reward}.`)
            twitch.say(payload.reward_id.toString())
        } else {
            console.log(`${amount} donation from ${payload.name.yellow}.`)
        }
    }
}

module.exports = {
    getCampaign,
    getRewards,
    storeRewards,
    connect,
    processTiltifyMessage,
}
