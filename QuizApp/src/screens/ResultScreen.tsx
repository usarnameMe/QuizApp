import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { QuizContext } from '../context/QuizContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type ResultNavigatorParamList = {
  Quiz: undefined;
  ScoreHistory: undefined;
  Result: undefined;
};

type ResultScreenNavigationProp = StackNavigationProp<ResultNavigatorParamList, 'Result'>;

const ResultScreen: React.FC = () => {
    const { state, dispatch } = useContext(QuizContext);
    const navigation = useNavigation<ResultScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.scoreText}>Your Score: {state.score}</Text>
            <Button
                title="Retake Quiz"
                onPress={() => {
                    dispatch({ type: 'RESET_QUIZ' });
                    navigation.navigate('Quiz');
                }}
                color="#6200EE"
            />
            <Button
                title="View Score History"
                onPress={() => navigation.navigate('ScoreHistory')}
                color="#6200EE"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2C003E',
    },
    scoreText: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
});

export default ResultScreen;
