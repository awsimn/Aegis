

const Notifications = require("expo-notifications");
const Device = require("expo-device");

const {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
  scheduleLocalNotification,
} = require("../src/services/notifications");

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  describe("setupNotificationListeners", () => {
    test("should set up received and response listeners", () => {
      const onReceived = jest.fn();
      const onResponse = jest.fn();

      setupNotificationListeners(onReceived, onResponse);

      expect(
        Notifications.addNotificationReceivedListener,
      ).toHaveBeenCalledWith(onReceived);
      expect(
        Notifications.addNotificationResponseReceivedListener,
      ).toHaveBeenCalledWith(onResponse);
    });

    test("should return a cleanup function", () => {
      const cleanup = setupNotificationListeners(jest.fn(), jest.fn());
      expect(typeof cleanup).toBe("function");
    });

    test("cleanup function should not throw", () => {
      const cleanup = setupNotificationListeners(jest.fn(), jest.fn());
      expect(() => cleanup()).not.toThrow();
    });
  });

  
  describe("scheduleLocalNotification", () => {
    test("should schedule a notification with correct content", async () => {
      await scheduleLocalNotification("Test Title", "Test Body", {
        type: "EARTHQUAKE",
      });

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: "Test Title",
          body: "Test Body",
          data: { type: "EARTHQUAKE" },
          sound: "default",
        },
        trigger: null,
      });
    });

    test("should use empty object as default data", async () => {
      await scheduleLocalNotification("Alert", "Danger");

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: "Alert",
          body: "Danger",
          data: {},
          sound: "default",
        },
        trigger: null,
      });
    });

    test("should trigger immediately (trigger: null)", async () => {
      await scheduleLocalNotification("Now", "Immediately");

      const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
      expect(call.trigger).toBeNull();
    });
  });
});
