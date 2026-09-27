import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("disaster-alerts", {
      name: "Disaster Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId;

      if (!projectId) {
        return null;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        })
      ).data;
      console.log("Push Token:", token);
    } catch (e) {
      console.log(
        "Push notification registration failed (likely missing EAS config):",
        e.message,
      );
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

export function setupNotificationListeners(onReceived, onResponse) {
  const subscription =
    Notifications.addNotificationReceivedListener(onReceived);
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(onResponse);

  return () => {
    subscription.remove();
    responseSubscription.remove();
  };
}

export async function scheduleLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: "default",
    },
    trigger: null,
  });
}
