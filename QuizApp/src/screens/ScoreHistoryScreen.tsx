import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useQuiz } from '../context/QuizContext';

const ScoreHistoryScreen = () => {
    const { state, dispatch } = useQuiz();

    const handleDelete = (index: number) => {
        dispatch({ type: 'DELETE_COMPLETED_QUIZ', payload: index });
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All History',
            'Are you sure you want to clear all history?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => dispatch({ type: 'CLEAR_ALL_HISTORY' }) },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {state.completedQuizzes.map((quiz, index) => (
                    <View key={index} style={styles.quizRecord}>
                        <View style={styles.quizInfo}>
                            <Text style={styles.text}>User: {quiz.userName}</Text>
                            <Text style={styles.text}>Category: {quiz.category}</Text>
                            <Text style={styles.text}>Difficulty: {quiz.difficulty}</Text>
                            <Text style={styles.text}>Score: {quiz.score}</Text>
                        </View>
                        <Button title="Delete" onPress={() => handleDelete(index)} />
                    </View>
                ))}
            </ScrollView>
            {state.completedQuizzes.length > 0 && (
                <Button title="Clear All" onPress={handleClearAll} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    quizRecord: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    quizInfo: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default ScoreHistoryScreen;
