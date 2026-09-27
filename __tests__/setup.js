


const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.error = (...args) => {
  
  if (typeof args[0] === 'string' && (
    args[0].includes('act()') ||
    args[0].includes('Warning:') ||
    args[0].includes('Failed to save data') ||
    args[0].includes('Failed to load data')
  )) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('componentWillMount') ||
    args[0].includes('componentWillReceiveProps') ||
    args[0].includes('Animated')
  )) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

console.log = jest.fn();


jest.setTimeout(10000);
