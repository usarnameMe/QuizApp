import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QuizProvider } from "../QuizApp/src/context/QuizContext";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator"; 
import ResultScreen from "./src/screens/ResultScreen";
import QuizScreen from "./src/screens/QuizScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <QuizProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="HomeTabs" 
            component={BottomTabNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ headerShown: false }}  />
        </Stack.Navigator>
      </NavigationContainer>
    </QuizProvider>
  );
};

export default App;
