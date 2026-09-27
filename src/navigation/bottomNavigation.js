import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "../styles/theme";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import HomeScreen from "../screens/home/HomeScreen";
import AlertScreen from "../screens/emergency/AlertScreen";
import PrepareScreen from "../screens/preparedness/PrepareScreen";
import ResourceStack from "./resourceStack";
import QuizScreen from "../screens/knowledge/QuizScreen";
import ForumStack from "./forumStack";
import RagChatScreen from "../screens/resources/RagChatScreen";

const BottomNav = createBottomTabNavigator();

const BASE_TAB_BAR_STYLE = {
  height: 64,
  borderTopWidth: 2,
  paddingBottom: 8,
  paddingTop: 8,
};

function BottomNavigation() {
  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";

    const hiddenRoutes = ["ForumPost", "CreatePost", "Auth"];

    if (hiddenRoutes.includes(routeName)) {
      return { display: "none" };
    }

    return {
      ...BASE_TAB_BAR_STYLE,
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.borderLight,
    };
  };

  return (
    <BottomNav.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: getTabBarStyle(route),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Alerts") {
            iconName = focused ? "warning" : "warning-outline";
          } else if (route.name === "Prepare") {
            iconName = focused
              ? "shield-checkmark"
              : "shield-checkmark-outline";
          } else if (route.name === "Resources") {
            iconName = focused ? "library" : "library-outline";
          } else if (route.name === "Quiz") {
            iconName = focused ? "school" : "school-outline";
          } else if (route.name === "Forum") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "AEGIS") {
            iconName = focused ? "planet" : "planet-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <BottomNav.Screen name="Home" component={HomeScreen} />
      <BottomNav.Screen name="Prepare" component={PrepareScreen} />
      <BottomNav.Screen name="Alerts" component={AlertScreen} />
      <BottomNav.Screen name="Forum" component={ForumStack} />
      <BottomNav.Screen name="Resources" component={ResourceStack} />
      <BottomNav.Screen name="Quiz" component={QuizScreen} />
      <BottomNav.Screen name="AEGIS" component={RagChatScreen} />
    </BottomNav.Navigator>
  );
}

export default BottomNavigation;
