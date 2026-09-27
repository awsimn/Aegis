
const React = require('react');

const mockComponent = (name) => {
  const Component = ({ children, ...props }) => React.createElement(name, props, children);
  Component.displayName = name;
  return Component;
};

const View = mockComponent('View');
const Text = mockComponent('Text');
const TouchableOpacity = mockComponent('TouchableOpacity');
const TextInput = mockComponent('TextInput');
const ScrollView = mockComponent('ScrollView');
const FlatList = mockComponent('FlatList');
const Image = mockComponent('Image');
const ActivityIndicator = mockComponent('ActivityIndicator');
const SafeAreaView = mockComponent('SafeAreaView');
const Modal = mockComponent('Modal');
const Pressable = mockComponent('Pressable');
const Switch = mockComponent('Switch');
const Alert = {
  alert: jest.fn(),
};

const Animated = {
  Value: jest.fn(() => ({
    interpolate: jest.fn(() => 0),
    setValue: jest.fn(),
  })),
  timing: jest.fn(() => ({
    start: jest.fn((cb) => cb && cb()),
  })),
  spring: jest.fn(() => ({
    start: jest.fn((cb) => cb && cb()),
  })),
  createAnimatedComponent: (component) => component,
  View: mockComponent('Animated.View'),
  Text: mockComponent('Animated.Text'),
  event: jest.fn(),
  add: jest.fn(),
  multiply: jest.fn(),
};

const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => {
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style || {};
  },
  hairlineWidth: 1,
};

const Platform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
  Version: 14,
};

const Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 812, scale: 2, fontScale: 1 })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

const Linking = {
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
};

const Keyboard = {
  dismiss: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
};

const AppState = {
  currentState: 'active',
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
};

const Vibration = {
  vibrate: jest.fn(),
  cancel: jest.fn(),
};

const Share = {
  share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
};

module.exports = {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Pressable,
  Switch,
  Alert,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
  Linking,
  Keyboard,
  AppState,
  Vibration,
  Share,
  PixelRatio: { get: jest.fn(() => 2), getFontScale: jest.fn(() => 1) },
  StatusBar: mockComponent('StatusBar'),
  useWindowDimensions: jest.fn(() => ({ width: 375, height: 812 })),
  useColorScheme: jest.fn(() => 'light'),
  LogBox: { ignoreLogs: jest.fn(), ignoreAllLogs: jest.fn() },
};
