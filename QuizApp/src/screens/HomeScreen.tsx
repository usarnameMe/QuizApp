import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Button, TextInput, View, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
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
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);
  const { state, dispatch } = useQuiz();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories.map((cat) => ({ label: cat.name, value: cat.id })));
    };
    loadCategories();
  }, []);

  const getCategoryLabel = () => {
    const category = categories.find(cat => cat.value === state.settings.category);
    return category ? category.label : 'Select Category';
  };

  const getDifficultyLabel = () => {
    const difficultyMap = { "": "Any Difficulty", "easy": "Easy", "medium": "Medium", "hard": "Hard" };
    return difficultyMap[state.settings.difficulty] || 'Select Difficulty';
  };

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

<Text style={styles.title}>Choose Category and Difficulty: </Text>
      <TouchableOpacity style={styles.button} onPress={() => setCategoryModalVisible(true)}>
        <Text style={styles.buttonText}>{getCategoryLabel()}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => {
          setCategoryModalVisible(!categoryModalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setCategoryModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <ScrollView style={styles.scrollView}>
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={styles.modalButton}
                      onPress={() => {
                        dispatch({
                          type: "SET_SETTINGS",
                          payload: { ...state.settings, category: item.value },
                        });
                        setCategoryModalVisible(!categoryModalVisible);
                      }}>
                      <Text style={styles.textStyle}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={() => setDifficultyModalVisible(true)}>
        <Text style={styles.buttonText}>{getDifficultyLabel()}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={difficultyModalVisible}
        onRequestClose={() => {
          setDifficultyModalVisible(!difficultyModalVisible);
        }}>
        <TouchableWithoutFeedback onPress={() => setDifficultyModalVisible(false)}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <ScrollView style={styles.scrollView}>
                  {["Easy", "Medium", "Hard"].map((difficulty, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalButton}
                      onPress={() => {
                        dispatch({
                          type: "SET_SETTINGS",
                          payload: { ...state.settings, difficulty: difficulty.toLowerCase() },
                        });
                        setDifficultyModalVisible(!difficultyModalVisible);
                      }}>
                      <Text style={styles.textStyle}>{difficulty}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.start}>
        <Button
          title="START QUIZ"
          onPress={() => {
            dispatch({ type: "SET_USER", payload: userName });
            navigation.navigate("Quiz");
          }}
          disabled={!state.settings.category || !userName || !state.settings.difficulty}
          color="#78290f"
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#2f3e46",
    padding: 10,
    borderRadius: 20,
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    width: '100%',
  },
  modalButton: {
    backgroundColor: "#2f3e46",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    width: 250, 
    alignItems: 'center', 
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  start: {
    margin: 10,
    padding: 15,
    minWidth: 150, 
    borderRadius: 10, 
  },
  buttonText: { 
    color: "#FFF",
    textAlign: "center",
    fontSize: 18, 
    fontWeight: 'bold'
  }
});

export default HomeScreen;
