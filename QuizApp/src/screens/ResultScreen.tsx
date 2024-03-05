import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QuizContext } from '../context/QuizContext';
import { useNavigation } from '@react-navigation/native';
import Screen from './Screen';
import { StackNavigationProp } from '@react-navigation/stack';

type ResultScreenStackParamList = {
  Quiz: undefined;
  ScoreHistory: undefined;
  Result: undefined;
};

type ResultScreenNavigationProp = StackNavigationProp<ResultScreenStackParamList, 'Result'>;

const ResultScreen: React.FC = () => {
  const { state, dispatch } = useContext(QuizContext);
  const navigation = useNavigation<ResultScreenNavigationProp>();

  return (
    <Screen background="#52796f">
      <View style={styles.resultContainer}>
        <Text style={styles.scoreText}>Your Score: {state.score}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch({ type: 'RESET_QUIZ' });
            navigation.navigate('Quiz');
          }}
        >
          <Text style={styles.buttonText}>Retake Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ScoreHistory')}
        >
          <Text style={styles.buttonText}>View Score History</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreText: {
    fontSize: 28,
    color: 'white',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10002b',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginVertical: 10,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ResultScreen;
