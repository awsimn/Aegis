const React = require('react');

const NavigationContainer = ({ children }) =>
  React.createElement('NavigationContainer', null, children);

const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  reset: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
}));

const useRoute = jest.fn(() => ({
  params: {},
  name: 'MockRoute',
}));

const useFocusEffect = jest.fn();
const useIsFocused = jest.fn(() => true);

module.exports = {
  NavigationContainer,
  useNavigation,
  useRoute,
  useFocusEffect,
  useIsFocused,
  CommonActions: {
    reset: jest.fn(),
    navigate: jest.fn(),
  },
};
