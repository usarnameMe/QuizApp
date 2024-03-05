import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useQuiz } from "../context/QuizContext";
import { fetchQuestions } from "../utils/api";
import { StackNavigationProp } from "@react-navigation/stack";
import Screen from "./Screen";

function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

type QuizNavigatorParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: undefined;
};
type QuizScreenNavigationProp = StackNavigationProp<
  QuizNavigatorParamList,
  "Quiz"
>;
type Props = { navigation: QuizScreenNavigationProp };

const QuizScreen: React.FC<Props> = ({ navigation }) => {
  const { state, dispatch } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const fetchedQuestions = await fetchQuestions(
          state.settings.category,
          state.settings.difficulty
        );
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          const decodedQuestions = fetchedQuestions.map((question) => ({
            ...question,
            question: decodeHTMLEntities(question.question),
            correct_answer: decodeHTMLEntities(question.correct_answer),
            incorrect_answers:
              question.incorrect_answers.map(decodeHTMLEntities),
          }));
          setQuestions(decodedQuestions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
      setLoading(false);
    };
    loadQuestions();
  }, [state.settings]);

  useEffect(() => {
    if (showAnswer) {
      const timer = setTimeout(() => {
        setShowAnswer(false);
        setSelectedAnswer(null);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          dispatch({
            type: "ADD_COMPLETED_QUIZ",
            payload: {
              category: state.settings.category,
              difficulty: state.settings.difficulty,
              score: state.score,
              user: state.userName,
            },
          });
          navigation.navigate("Result");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    showAnswer,
    currentQuestionIndex,
    questions.length,
    navigation,
    dispatch,
    state.score,
    state.settings.category,
    state.settings.difficulty,
  ]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <Screen background="#52796f">
      <ScrollView style={styles.scrollView}>
        {questions.length > 0 && (
          <>
            <View style={styles.questionHeader}>
              <Text style={styles.questionCount}>
                Question {currentQuestionIndex + 1}/{questions.length}
              </Text>
              <Text style={styles.question}>
                {questions[currentQuestionIndex].question}
              </Text>
            </View>
            {questions[currentQuestionIndex].incorrect_answers
              .concat(questions[currentQuestionIndex].correct_answer)
              .sort(() => Math.random() - 0.5)
              .map((answer, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.answerButton,
                    selectedAnswer === answer &&
                      (answer === questions[currentQuestionIndex].correct_answer
                        ? styles.correctAnswerButton
                        : styles.wrongAnswerButton),
                  ]}
                  onPress={() => {
                    setSelectedAnswer(answer);
                    setShowAnswer(true);
                    if (
                      answer === questions[currentQuestionIndex].correct_answer
                    ) {
                      dispatch({ type: "INCREMENT_SCORE" });
                    }
                  }}
                >
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              ))}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0))
                }
                style={[
                  styles.navButton,
                  currentQuestionIndex === 0 && styles.disabledButton,
                ]}
                disabled={currentQuestionIndex === 0}
              >
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setCurrentQuestionIndex(
                    Math.min(currentQuestionIndex + 1, questions.length - 1)
                  )
                }
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>
                  {currentQuestionIndex === questions.length - 1
                    ? "Finish"
                    : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: { width: "100%", paddingHorizontal: 10, marginTop: 20 },
  questionHeader: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionCount: {
    fontSize: 18,
    marginBottom: 10,
    color: "#354f52",
    fontWeight: "bold",
  },
  question: { fontSize: 22, color: "#2F5233", fontWeight: "600" },
  answerButton: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  correctAnswerButton: { borderColor: "green", backgroundColor: "lightgreen" },
  wrongAnswerButton: { borderColor: "red", backgroundColor: "pink" },
  answerText: { textAlign: "center", fontSize: 16, color: "#354f52" },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: "#354f52",
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  navButtonText: { color: "white", fontSize: 16 },
  disabledButton: { backgroundColor: "#cccccc" },
});

export default QuizScreen;
