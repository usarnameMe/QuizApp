import React, {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";

interface Quiz {
  category: string;
  difficulty: string;
  score: number;
}

interface QuizState {
  score: number;
  settings: {
    category: string;
    difficulty: string;
  };
  completedQuizzes: Quiz[];
}

interface QuizAction {
  type: string;
  payload?: any;
}

const initialState: QuizState = {
  score: 0,
  settings: {
    category: "",
    difficulty: "",
  },
  completedQuizzes: [],
};

interface QuizContextType {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
}

export const QuizContext = createContext<QuizContextType | undefined>(
  undefined
);

const QuizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    case "ADD_COMPLETED_QUIZ":
      return {
        ...state,
        completedQuizzes: [...state.completedQuizzes, action.payload],
      };
    default:
      return state;
  }
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(QuizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext) as QuizContextType;
