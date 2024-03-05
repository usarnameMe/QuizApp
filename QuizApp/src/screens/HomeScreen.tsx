import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Button, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuiz } from "../context/QuizContext";
import { fetchCategories } from "../utils/api";
import Screen from "./Screen";

type HomeNavigatorParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const { state, dispatch } = useQuiz();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories.map((cat) => ({ label: cat.name, value: cat.id })));
    };
    loadCategories();
  }, []);

  return (
    <Screen background="#52796f">
      <Text style={styles.title}>Enter Your Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserName}
        value={userName}
        placeholder="Your Name"
        placeholderTextColor="#A599B5"
      />
      <Text style={styles.title}>Select Category:</Text>
      <View style={styles.dropdown}>
        <DropDownPicker
          open={openCategory}
          value={state.settings.category}
          items={categories}
          setOpen={setOpenCategory}
          setValue={(callback) =>
            dispatch({
              type: "SET_SETTINGS",
              payload: {
                ...state.settings,
                category: callback(state.settings.category),
              },
            })
          }
          setItems={setCategories}
          zIndex={300}
          zIndexInverse={100}
          dropDownContainerStyle={{ backgroundColor: "#d0ccd3" }}
        />
      </View>
      <View style={styles.select}>
        <Text style={styles.title}>Select Difficulty:</Text>
      </View>
      <View style={styles.dropdown}>
        <DropDownPicker
          open={openDifficulty}
          value={state.settings.difficulty}
          items={[
            { label: "Any Difficulty", value: "" },
            { label: "Easy", value: "easy" },
            { label: "Medium", value: "medium" },
            { label: "Hard", value: "hard" },
          ]}
          setOpen={setOpenDifficulty}
          setValue={(callback) =>
            dispatch({
              type: "SET_SETTINGS",
              payload: {
                ...state.settings,
                difficulty: callback(state.settings.difficulty),
              },
            })
          }
          zIndex={2000}
          zIndexInverse={3000}
          dropDownContainerStyle={{ backgroundColor: "#d0ccd3" }}
        />
      </View>
      <View style={styles.start}>
        <Button
          title="START QUIZ"
          onPress={() => {
            dispatch({ type: "SET_USER", payload: userName });
            navigation.navigate("Quiz");
          }}
          disabled={!state.settings.category || !userName}
          color="#78290f"
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    margin: 20,
    color: "#FFF",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    minWidth: 90,
    borderColor: "#FFF",
    padding: 10,
    color: "#FFF",
    backgroundColor: "#2f3e46",
  },
  select: {
    marginTop: 20,
  },
  dropdown: {
    margin: 10,
  },
  start: {
    margin: 10,
  },
});

export default HomeScreen;
