import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuiz } from "../context/QuizContext";
import { fetchCategories } from "../utils/api";

type HomeNavigatorParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const { state, dispatch } = useQuiz();

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category:</Text>
      <Picker
        selectedValue={state.settings.category}
        onValueChange={(itemValue, itemIndex) =>
          dispatch({
            type: "SET_SETTINGS",
            payload: { ...state.settings, category: itemValue }
          })
        }
      >
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id.toString()} />
        ))}
      </Picker>
      <Text style={styles.title}>Select Difficulty:</Text>
      <Picker
        selectedValue={state.settings.difficulty}
        onValueChange={(itemValue, itemIndex) =>
          dispatch({
            type: "SET_SETTINGS",
            payload: { ...state.settings, difficulty: itemValue }
          })
        }
      >
        <Picker.Item label="Any Difficulty" value="" />
        <Picker.Item label="Easy" value="easy" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Hard" value="hard" />
      </Picker>
      <Button title="Start Quiz" onPress={() => navigation.navigate("Quiz")} disabled={!state.settings.category} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
