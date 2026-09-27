

const AsyncStorage = require('@react-native-async-storage/async-storage');


const { saveData, loadData, clearData } = require('../src/services/storage');

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const store = AsyncStorage.__store;
    Object.keys(store).forEach((key) => delete store[key]);
  });

  
  describe('saveData', () => {
    test('should save a string value', async () => {
      await saveData('@test_key', 'hello');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@test_key',
        JSON.stringify('hello')
      );
    });

    test('should save a number value', async () => {
      await saveData('@xp', 250);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@xp',
        JSON.stringify(250)
      );
    });

    test('should save an object value', async () => {
      const prefs = { vibration: true, notifications: false };
      await saveData('@prefs', prefs);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@prefs',
        JSON.stringify(prefs)
      );
    });

    test('should save an array value', async () => {
      const tasks = ['task_1', 'task_2', 'task_3'];
      await saveData('@tasks', tasks);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@tasks',
        JSON.stringify(tasks)
      );
    });

    test('should handle saving null', async () => {
      await saveData('@empty', null);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@empty',
        JSON.stringify(null)
      );
    });

    test('should not throw when AsyncStorage fails', async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage full'));
      await expect(saveData('@key', 'value')).resolves.not.toThrow();
    });
  });

  
  describe('loadData', () => {
    test('should return parsed data for existing key', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(42));
      const result = await loadData('@xp');
      expect(result).toBe(42);
    });

    test('should return null for non-existent key', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const result = await loadData('@missing');
      expect(result).toBeNull();
    });

    test('should return parsed object', async () => {
      const obj = { vibration: true, notifications: true };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(obj));
      const result = await loadData('@prefs');
      expect(result).toEqual(obj);
    });

    test('should return parsed array', async () => {
      const arr = ['a', 'b', 'c'];
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(arr));
      const result = await loadData('@arr');
      expect(result).toEqual(arr);
    });

    test('should not throw when AsyncStorage fails', async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Corrupt'));
      await expect(loadData('@key')).resolves.not.toThrow();
    });
  });

  
  describe('clearData', () => {
    test('should call AsyncStorage.clear()', async () => {
      await clearData();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    test('should not throw when AsyncStorage fails', async () => {
      AsyncStorage.clear.mockRejectedValueOnce(new Error('Fail'));
      await expect(clearData()).resolves.not.toThrow();
    });
  });
});
