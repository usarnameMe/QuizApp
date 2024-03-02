import React, { useEffect, useState } from "react";
import { Text, StyleSheet, } from "react-native";
import {Picker} from '@react-native-picker/picker';

import { useQuiz } from "../context/QuizContext";
import { fetchCategories } from "../utils/api";

import { View } from "react-native";

const HomeScreen: React.FC = ({ }) => {
  const [categories, setCategories] = useState([]);
  const { state, dispatch } = useQuiz();

  useEffect(() => {
    const loadCategories = async () => {
      const fetchCatefories = await fetchCategories();
      setCategories(fetchCatefories);
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
            payload: { ...state.settings, category: itemValue },
          })
        }
      >
        {categories.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id.toString()}
          />
        ))}
      </Picker>
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
