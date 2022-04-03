module.exports = {
    // The twitch channel name in which this application will send reward ids and which bit-bot will listen to.
    twitchCommandsChannelName: '',

    // The Tiltify campaign ID you want to monitor.
    // To retrieve the ID:
        // Open a webpage to your campaign on Tiltify.
        // Open the Developer Tools with F12.
        // Navigate to the Network tab and refresh the page.
        // Look for, and click on the request with the 101 status code made to 'websockets.tiltify.com'.
        // Then in the Responses tab, you should see a bunch of messages with the format 'campaign.xxxxxx'.
        // This, typically, 6 digit number is the one you want to enter below.
    tiltifyCampaignId: '',

    // The Tiltify application access token used to retrieve a list of rewards.
    // Register a Tiltify Application here: (Enter your own tiltify username in the specified location).
    // https://dashboard.tiltify.com/<username>/my-account/connected-accounts/applications
    tiltifyAccessToken: '',

    twitchIdentity: {
        // The Twitch username of the account that will send the messages in the commands channel above.
        username: '',

        // The Twitch oauth token used to be able to send messages to twitch chat.
        // You can create one here: https://twitchapps.com/tmi/
        password: 'oauth:xxxxxxxxxxxxxxxxx'
    }
}
