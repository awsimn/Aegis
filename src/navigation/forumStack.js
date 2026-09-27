import { createStackNavigator } from "@react-navigation/stack";
import ForumHomeScreen from "../screens/forum/ForumHomeScreen";
import ForumCategoryScreen from "../screens/forum/ForumCategoryScreen";
import ForumPostScreen from "../screens/forum/ForumPostScreen";
import CreatePostScreen from "../screens/forum/CreatePostScreen";
import LeaderboardScreen from "../screens/forum/LeaderboardScreen";
import AuthScreen from "../screens/auth/AuthScreen";

const Stack = createStackNavigator();

export default function ForumStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ForumHome" component={ForumHomeScreen} />
      <Stack.Screen name="ForumCategory" component={ForumCategoryScreen} />
      <Stack.Screen name="ForumPost" component={ForumPostScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
