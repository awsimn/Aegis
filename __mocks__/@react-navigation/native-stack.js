const React = require('react');

const createNativeStackNavigator = jest.fn(() => ({
  Navigator: ({ children }) => React.createElement('Navigator', null, children),
  Screen: ({ children }) => React.createElement('Screen', null, children),
}));

module.exports = { createNativeStackNavigator };
