const fs = require('fs');
const tiltify = require('../src/tiltify');
const twitch = require('../src/twitch');
require('colors');

const fakeSay = jest.spyOn(twitch, 'say');
const fakeConsoleLog = jest.spyOn(console, 'log');
jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

const heartbeatResponse = [null, '26', 'phoenix', 'phx_reply', { response: {}, status: 'ok' }];
const donationResponseNoReward = [null, null, '', 'donation', { amount: 10, name: 'DBKynd' }];
const donationResponseWithReward = [null, null, '', 'donation', { amount: 20, name: 'DBKynd', reward_id: 123456 }];

describe('processTiltifyMessage method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if not donation response', () => {
    tiltify.processTiltifyMessage(JSON.stringify(heartbeatResponse));
    expect(fakeSay).not.toHaveBeenCalled();
  });

  it('only logs to console if no reward id in donation payload', () => {
    tiltify.processTiltifyMessage(JSON.stringify(donationResponseNoReward));
    expect(fakeSay).not.toHaveBeenCalled();
    const string = '$10'.green + ' donation from ' + 'DBKynd'.yellow + '.';
    expect(fakeConsoleLog).toHaveBeenCalledWith(string);
  });

  it('sends a message to twitch chat if there is an unknown reward id in the donation payload', () => {
    tiltify.processTiltifyMessage(JSON.stringify(donationResponseWithReward));
    expect(fakeSay).toHaveBeenCalledTimes(1);
    const string = '$20'.green + ' donation from ' + 'DBKynd'.yellow + ' - Claimed: ' + 'Unknown'.yellow + '.';
    expect(fakeConsoleLog).toHaveBeenCalledWith(string);
  });

  it('sends a message to twitch chat if there is an known reward id in the donation payload', () => {
    tiltify.storeRewards([
      {
        id: 123456,
        name: 'Cool Thing',
      },
    ]);
    tiltify.processTiltifyMessage(JSON.stringify(donationResponseWithReward));
    expect(fakeSay).toHaveBeenCalledTimes(1);
    const string = '$20'.green + ' donation from ' + 'DBKynd'.yellow + ' - Claimed: ' + 'Cool Thing'.yellow + '.';
    expect(fakeConsoleLog).toHaveBeenCalledWith(string);
  });
});
