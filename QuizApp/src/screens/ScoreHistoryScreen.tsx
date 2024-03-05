import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuiz } from "../context/QuizContext";
import Screen from "./Screen";

const ScoreHistoryScreen = () => {
  const { state, dispatch } = useQuiz();

  const handleDelete = (index: number) => {
    dispatch({ type: "DELETE_COMPLETED_QUIZ", payload: index });
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to clear all history?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => dispatch({ type: "CLEAR_ALL_HISTORY" }) },
      ],
      { cancelable: false }
    );
  };

  return (
    <Screen background="#52796f">
      <ScrollView style={styles.scrollView}>
        {state.completedQuizzes.map((quiz, index) => (
          <View key={index} style={styles.quizRecord}>
            <View style={styles.quizInfo}>
              <Text style={styles.text}>User: {quiz.userName}</Text>
              <Text style={styles.text}>Score: {quiz.score}</Text>
            </View>
            <TouchableOpacity 
              style={styles.delButton} 
              onPress={() => handleDelete(index)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {state.completedQuizzes.length > 0 && (
        <TouchableOpacity 
          style={styles.clearAllButton} 
          onPress={handleClearAll}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  quizRecord: {
    flex:1,
    flexDirection: "row",
    justifyContent: "flex-start", 
    alignItems: "center",
    marginTop: 25,
    marginHorizontal: 5,
    padding: 15, 
    backgroundColor: "#3a506b", 
    borderRadius: 10, 
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  quizInfo: {
    minWidth: '70%',
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: "#fff",
  },
  delButton: {
    backgroundColor: "#b83227",
    padding: 10,
    borderRadius: 5,
  },
  clearAllButton: {
    backgroundColor: "#b83227",
    margin: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ScoreHistoryScreen;
