const mockSensor = {
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  setUpdateInterval: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
};

module.exports = {
  Accelerometer: { ...mockSensor },
  Gyroscope: { ...mockSensor },
  Magnetometer: { ...mockSensor },
  Barometer: { ...mockSensor },
};
