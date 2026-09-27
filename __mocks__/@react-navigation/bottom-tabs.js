const React = require('react');

const createBottomTabNavigator = jest.fn(() => ({
  Navigator: ({ children }) => React.createElement('TabNavigator', null, children),
  Screen: ({ children }) => React.createElement('TabScreen', null, children),
}));

module.exports = { createBottomTabNavigator };
