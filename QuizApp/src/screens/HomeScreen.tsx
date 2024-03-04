import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuiz } from '../context/QuizContext';
import { fetchCategories } from '../utils/api';

type HomeNavigatorParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const { state, dispatch } = useQuiz();

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories.map(cat => ({ label: cat.name, value: cat.id })));
    };
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category:</Text>
      <DropDownPicker
        open={openCategory}
        value={state.settings.category}
        items={categories}
        setOpen={setOpenCategory}
        setValue={(callback) =>
          dispatch({
            type: 'SET_SETTINGS',
            payload: { ...state.settings, category: callback(state.settings.category) },
          })
        }
        setItems={setCategories}
        zIndex={3000}
        zIndexInverse={1000}
      />
      <Text style={styles.title}>Select Difficulty:</Text>
      <DropDownPicker
        open={openDifficulty}
        value={state.settings.difficulty}
        items={[
          { label: 'Any Difficulty', value: '' },
          { label: 'Easy', value: 'easy' },
          { label: 'Medium', value: 'medium' },
          { label: 'Hard', value: 'hard' },
        ]}
        setOpen={setOpenDifficulty}
        setValue={(callback) =>
          dispatch({
            type: 'SET_SETTINGS',
            payload: { ...state.settings, difficulty: callback(state.settings.difficulty) },
          })
        }
        zIndex={2000}
        zIndexInverse={2000}
      />
      <Button title="Start Quiz" onPress={() => navigation.navigate('Quiz')} disabled={!state.settings.category} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
