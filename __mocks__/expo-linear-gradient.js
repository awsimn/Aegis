const React = require('react');

const LinearGradient = ({ children, ...props }) =>
  React.createElement('LinearGradient', props, children);

module.exports = { LinearGradient };
