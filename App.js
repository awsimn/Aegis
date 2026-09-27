import { StyleSheet, LogBox } from "react-native";

LogBox.ignoreAllLogs();
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import MainNavStack from "./src/navigation/mainNavStack";
import { AuthProvider } from "./src/context/AuthContext";
import { AppProvider } from "./src/context/AppContext";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer>
            <MainNavStack />
          </NavigationContainer>
        </SafeAreaView>
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
