import { createStackNavigator } from "@react-navigation/stack";
import OfflineNavScreen from "../screens/emergency/OfflineNavScreen";

import BottomNavigation from "./bottomNavigation";
import ChecklistScreen from "../screens/preparedness/ChecklistScreen";
import PrepCategoryScreen from "../screens/preparedness/PrepCategoryScreen";
import QuizDetailScreen from "../screens/knowledge/QuizDetailScreen";
import RpgScreen from "../screens/knowledge/RpgScreen";
import SOSBeaconScreen from "../screens/emergency/SOSBeaconScreen";
import SettingsScreen from "../screens/home/SettingsScreen";
import KnowledgeBaseScreen from "../screens/knowledge/KnowledgeBaseScreen";
import KnowledgeCategoryScreen from "../screens/knowledge/KnowledgeCategoryScreen";
import GuideDetailScreen from "../screens/knowledge/GuideDetailScreen";
import StatsScreen from "../screens/home/StatsScreen";
import DeleteAccountScreen from "../screens/home/DeleteAccountScreen";

const Stack = createStackNavigator();

function MainNavStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomNavigation} />
      <Stack.Screen name="Checklist" component={ChecklistScreen} />
      <Stack.Screen name="PrepCategory" component={PrepCategoryScreen} />
      <Stack.Screen name="QuizDetail" component={QuizDetailScreen} />
      <Stack.Screen name="Rpg" component={RpgScreen} />
      <Stack.Screen name="OfflineNav" component={OfflineNavScreen} />
      <Stack.Screen name="SOSBeacon" component={SOSBeaconScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
      <Stack.Screen name="KnowledgeCategory" component={KnowledgeCategoryScreen} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
      <Stack.Screen name="StatsScreen" component={StatsScreen} />
      <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />
    </Stack.Navigator>
  );
}

export default MainNavStack;
