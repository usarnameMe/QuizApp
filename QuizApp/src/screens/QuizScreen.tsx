import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useQuiz } from "../context/QuizContext";
import { fetchQuestions } from "../utils/api";
import { StackNavigationProp } from '@react-navigation/stack';

function decodeHTMLEntities(text) {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
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
    const { state } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = async () => {
            setLoading(true);
            const fetchedQuestions = await fetchQuestions(state.settings.category, state.settings.difficulty);
            if (fetchedQuestions.length > 0) {
                const decodedQuestions = fetchedQuestions.map(question => ({
                    ...question,
                    question: decodeHTMLEntities(question.question),
                    correct_answer: decodeHTMLEntities(question.correct_answer),
                    incorrect_answers: question.incorrect_answers.map(decodeHTMLEntities),
                }));
                setQuestions(decodedQuestions);
            } else {
                Alert.alert("Notice", "Could not load questions or reached rate limit.");
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
                    navigation.navigate("Result");
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showAnswer, currentQuestionIndex, questions.length, navigation]);

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
                            .map((answer, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.answerButton,
                                        selectedAnswer === answer && { backgroundColor: "#dedede" },
                                    ]}
                                    onPress={() => {
                                        setSelectedAnswer(answer);
                                        setShowAnswer(true);
                                    }}
                                    disabled={showAnswer}
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
    question: {
        fontSize: 22,
        marginBottom: 20,
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
    questionHeader: {
      marginBottom: 20,
  },
  questionCount: {
      fontSize: 18,
      marginBottom: 10, 
      textAlign: "center",
  },
});

export default QuizScreen;
