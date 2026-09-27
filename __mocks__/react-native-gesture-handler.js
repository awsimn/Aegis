const React = require('react');

const mockComponent = (name) => {
  const Component = ({ children, ...props }) => React.createElement(name, props, children);
  Component.displayName = name;
  return Component;
};

module.exports = {
  GestureHandlerRootView: mockComponent('GestureHandlerRootView'),
  Swipeable: mockComponent('Swipeable'),
  DrawerLayout: mockComponent('DrawerLayout'),
  State: {},
  PanGestureHandler: mockComponent('PanGestureHandler'),
  TapGestureHandler: mockComponent('TapGestureHandler'),
  FlingGestureHandler: mockComponent('FlingGestureHandler'),
  ForceTouchGestureHandler: mockComponent('ForceTouchGestureHandler'),
  LongPressGestureHandler: mockComponent('LongPressGestureHandler'),
  ScrollView: mockComponent('ScrollView'),
  NativeViewGestureHandler: mockComponent('NativeViewGestureHandler'),
  TouchableHighlight: mockComponent('TouchableHighlight'),
  TouchableNativeFeedback: mockComponent('TouchableNativeFeedback'),
  TouchableOpacity: mockComponent('TouchableOpacity'),
  TouchableWithoutFeedback: mockComponent('TouchableWithoutFeedback'),
  Directions: {},
};
