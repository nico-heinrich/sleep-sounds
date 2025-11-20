import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ImageMorphProvider } from "./components/ImageMorphProvider";
import Home from "./screens/Home";
import Options from "./screens/Options";

type RootStackParamList = {
  Home: undefined;
  Options: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ImageMorphProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Options" component={Options} />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageMorphProvider>
  );
}
