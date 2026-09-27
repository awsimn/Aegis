module.exports = {
  getNetworkStateAsync: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
      type: 'WIFI',
    })
  ),
  NetworkStateType: {
    NONE: 'NONE',
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
  },
};
