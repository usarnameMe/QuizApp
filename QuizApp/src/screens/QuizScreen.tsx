import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useQuiz } from "../context/QuizContext";  
import { fetchQuestions } from "../utils/api"; 
import { StackNavigationProp } from '@react-navigation/stack';

function decodeHTMLEntities(text: string) {
    return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

type QuizNavigatorParamList = {
    Home: undefined;
    Quiz: undefined;
    Result: undefined;
};

type QuizScreenNavigationProp = StackNavigationProp<QuizNavigatorParamList, 'Quiz'>;

type Props = {
    navigation: QuizScreenNavigationProp;
};

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
              const fetchedQuestions = await fetchQuestions(state.settings.category, state.settings.difficulty);
              if (fetchedQuestions && fetchedQuestions.length > 0) {
                  const decodedQuestions = fetchedQuestions.map((question: { question: any; correct_answer: any; incorrect_answers: any[]; }) => ({
                      ...question,
                      question: decodeHTMLEntities(question.question),
                      correct_answer: decodeHTMLEntities(question.correct_answer),
                      incorrect_answers: question.incorrect_answers.map(decodeHTMLEntities),
                  }));
                  setQuestions(decodedQuestions);
              } else {
                  console.log("Questions have reached rate limit. Have no idea why is this happening, if you know let me know please. ");
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
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setShowAnswer(false);
                    setSelectedAnswer(null);
                } else {
                    dispatch({
                        type: "ADD_COMPLETED_QUIZ",
                        payload: {
                            category: state.settings.category,
                            difficulty: state.settings.difficulty,
                            score: state.score,
                        },
                    });
                    navigation.navigate("Result");
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showAnswer, currentQuestionIndex, questions.length, navigation, dispatch, state.score, state.settings.category, state.settings.difficulty]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading questions...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
                        {questions[currentQuestionIndex].incorrect_answers.concat(questions[currentQuestionIndex].correct_answer)
                            .sort(() => Math.random() - 0.5)
                            .map((answer: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal, index: React.Key) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.answerButton,
                                        selectedAnswer === answer && { backgroundColor: "#dedede" },
                                    ]}
                                    onPress={() => {
                                        setSelectedAnswer(answer);
                                        setShowAnswer(true);
                                        if (answer === questions[currentQuestionIndex].correct_answer) {
                                            dispatch({ type: 'INCREMENT_SCORE' });
                                        }
                                    }}
                                >
                                    <Text style={styles.answerText}>{answer}</Text>
                                </TouchableOpacity>
                            ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        width: "100%",
    },
    questionHeader: {
        marginBottom: 20,
    },
    questionCount: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
    },
    question: {
        fontSize: 22,
        textAlign: "center",
    },
    answerButton: {
        backgroundColor: "#f8f8f8",
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
    },
    answerText: {
        textAlign: "center",
        fontSize: 16,
    },
});

export default QuizScreen;
