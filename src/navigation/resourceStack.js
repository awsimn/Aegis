import { createStackNavigator } from "@react-navigation/stack";
import ResourceScreen from "../screens/resources/ResourceScreen";
import ResourceDetailScreen from "../screens/resources/ResourceDetailScreen";
import NewsScreen from "../screens/resources/NewsScreen";
import VitalContactsScreen from "../screens/resources/VitalContactsScreen";
import GuideMenuScreen from "../screens/resources/GuideMenuScreen";
import GuideDetailScreen from "../screens/resources/GuideDetailScreen";

const Stack = createStackNavigator();

function ResourceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResourceMenu" component={ResourceScreen} />
      <Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="VitalContacts" component={VitalContactsScreen} />
      <Stack.Screen name="GuideMenu" component={GuideMenuScreen} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
    </Stack.Navigator>
  );
}

export default ResourceStack;
