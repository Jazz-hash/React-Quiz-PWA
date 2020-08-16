import React, { useState, useEffect } from "react";
import { QuestionCard } from "./components/QuestionCard";
import {
  fetchQuizQuestions,
  fetchQuizCategories,
  Difficulty,
  Type,
} from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";
import { sendPushNotification } from "./PushNotifications";

const App = () => {
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [category, setCategory] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>(Difficulty.EASY);
  const [type, setType] = useState<string>(Type.MULTIPLE);
  const [name, setName] = useState<string>("");

  const [loading, setLoading] = useState<Boolean>(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<Boolean>(true);
  const [endGame, setEndGame] = useState<Boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await fetchQuizCategories();
      setCategories(fetchedCategories);
    };
    setTimeout(() => {
      sendPushNotification("Welcome User !!");
    }, 2000);
    fetchCategories();
  }, []);

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      numberOfQuestions,
      difficulty,
      type,
      category
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
    setEndGame(false);
  };

  const tryAgain = () => {
    setEndGame(true);
    setGameOver(true);
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);

      if (userAnswers.length === numberOfQuestions - 1) {
        setEndGame(true);
      }
    }
  };
  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion === numberOfQuestions) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {!navigator.onLine && (
          <h4>
            You are offline so currently you can only attempt quiz with " 10 "
            questions and with category " all ".
          </h4>
        )}
        {gameOver && endGame ? (
          <>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              {navigator.onLine && (
                <>
                  <div className="form-group">
                    <label>Number of questions:</label>
                    <input
                      type="number"
                      onChange={(e) =>
                        setNumberOfQuestions(parseInt(e.target.value))
                      }
                      min="1"
                      value={numberOfQuestions}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Category:</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(parseInt(e.target.value));
                      }}
                    >
                      <option value={0}>Any type</option>
                      {categories.map((category: Categories) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Select Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                  }}
                >
                  <option value={Difficulty.EASY}>Easy</option>
                  <option value={Difficulty.MEDIUM}>Medium</option>
                  <option value={Difficulty.HARD}>Hard</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select Type:</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                >
                  <option value={Type.BOOLEAN}>True / False</option>
                  <option value={Type.MULTIPLE}>Multiple Choice</option>
                </select>
              </div>
              <div className="form-group">
                <button className="start" onClick={startQuiz}>
                  Start
                </button>
              </div>
            </form>
          </>
        ) : null}
        {!gameOver ? <p className="score">Correct: {score}</p> : null}
        <br />
        {loading && <p> Loading Questions ....</p>}
        {!loading && !gameOver && (
          <QuestionCard
            name={name}
            endGame={endGame}
            score={score}
            questionNumber={number + 1}
            totalQuestions={numberOfQuestions}
            question={questions[number].question}
            answers={questions[number].answers}
            selectedAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
            tryAgain={tryAgain}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== numberOfQuestions - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
