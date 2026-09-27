const React = require('react');

const SafeAreaView = ({ children, ...props }) =>
  React.createElement('SafeAreaView', props, children);
const SafeAreaProvider = ({ children }) => React.createElement('SafeAreaProvider', null, children);
const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });

module.exports = { SafeAreaView, SafeAreaProvider, useSafeAreaInsets };
