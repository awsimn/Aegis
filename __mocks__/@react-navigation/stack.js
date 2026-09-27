const React = require('react');

const createStackNavigator = jest.fn(() => ({
  Navigator: ({ children }) => React.createElement('StackNavigator', null, children),
  Screen: ({ children }) => React.createElement('StackScreen', null, children),
}));

module.exports = { createStackNavigator };
