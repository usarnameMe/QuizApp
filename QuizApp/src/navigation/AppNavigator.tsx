import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import  HomeScreen from "../screens/HomeScreen"
import  QuizScreen from "../screens/QuizScreen";
import  Resultcreen from "../screens/QuizScreen";


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Result" component={Resultcreen} />
    </Stack.Navigator>
  );
};       

export default AppNavigator;
