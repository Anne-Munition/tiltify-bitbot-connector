- Download and extract the ZIP file from the [Releases](https://github.com/Anne-Munition/tiltify-bitbot-connector/releases) page.
- Enter all values into the `.env` file.
- Run the `tiltify-bitbot-connector.exe` application.

---

When you run the application, the list of rewards will be retrieved and saved into a file called `rewards.json` alongside the executable.

This is to make copying the reward IDs into bit-bot easier and to keep track of which reward is which by the reward name.
They will also be logged to the Console window.

If you add rewards in the middle of the campaign you will need to restart the application in order to see the new IDs in the Console and rewards file.

If you do not restart the application, new IDs WILL post to the twitch chat, but will appear in the Console as 'Unknown'
