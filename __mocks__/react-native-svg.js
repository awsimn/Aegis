const React = require('react');

const mockComponent = (name) => {
  const Component = ({ children, ...props }) => React.createElement(name, props, children);
  Component.displayName = name;
  return Component;
};

const Svg = mockComponent('Svg');
Svg.default = Svg;

module.exports = Svg;
module.exports.default = Svg;
module.exports.Circle = mockComponent('Circle');
module.exports.Rect = mockComponent('Rect');
module.exports.Path = mockComponent('Path');
module.exports.Line = mockComponent('Line');
module.exports.G = mockComponent('G');
module.exports.Text = mockComponent('SvgText');
module.exports.Defs = mockComponent('Defs');
module.exports.LinearGradient = mockComponent('SvgLinearGradient');
module.exports.Stop = mockComponent('Stop');
module.exports.ClipPath = mockComponent('ClipPath');
