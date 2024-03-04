import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuiz } from '../context/QuizContext';

const ScoreHistoryScreen = () => {
    const { state } = useQuiz();

    return (
        <ScrollView style={styles.container}>
            {state.completedQuizzes.map((quiz, index) => (
                <View key={index} style={styles.quizRecord}>
                    <Text style={styles.text}>Category: {quiz.category}</Text>
                    <Text style={styles.text}>Difficulty: {quiz.difficulty}</Text>
                    <Text style={styles.text}>Score: {quiz.score}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    quizRecord: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    text: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default ScoreHistoryScreen;
