const React = require('react');

const mockComponent = (name) => {
  const Component = ({ children, ...props }) => React.createElement(name, props, children);
  Component.displayName = name;
  return Component;
};

const MapView = mockComponent('MapView');
MapView.Marker = mockComponent('Marker');
MapView.Circle = mockComponent('MapCircle');
MapView.Polyline = mockComponent('Polyline');
MapView.Polygon = mockComponent('Polygon');
MapView.Callout = mockComponent('Callout');

module.exports = MapView;
module.exports.default = MapView;
module.exports.Marker = MapView.Marker;
module.exports.Circle = MapView.Circle;
module.exports.PROVIDER_GOOGLE = 'google';
