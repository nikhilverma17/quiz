"use client";

import React, { useState, useEffect } from "react";
import Team from "./Team";
import Question from "./Question";
import Timer from "./Timer";
import Lifeline from "./Lifeline";
import ScoreBoard from "./ScoreBoard";
import CategorySelector from "./CategorySelector";
import FactPopup from "./FactPopup";
import questionsData from "../data/questions.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGamepad, faSpinner } from '@fortawesome/free-solid-svg-icons';
import audioManager from "../utils/audioManager";
import { motion, AnimatePresence } from "framer-motion";

const sections = questionsData.sections;
const questionsPerSection = 6;
const questionsPerTeam = 3;
const totalRounds = 4;

function QuizGame() {
  const [currentTeam, setCurrentTeam] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    0: { 1: {}, 2: {}, 3: {}, 4: {} },
    1: { 1: {}, 2: {}, 3: {}, 4: {} }
  });
  const [doublePoints, setDoublePoints] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sectionComplete, setSectionComplete] = useState(false);
  const [doubleDipActive, setDoubleDipActive] = useState(false);
  const [powerPapluActive, setPowerPapluActive] = useState(false);
  const [round, setRound] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFact, setShowFact] = useState(false);
  const [teamNames, setTeamNames] = useState(["", ""]);
  const [shouldResetTimer, setShouldResetTimer] = useState(true);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    audioManager.play('background');
    return () => {
      audioManager.stop('background');
    };
  }, []);

  const getAvailableLifelines = () => {
    const allLifelines = [
      "50-50",
      "hint",
      "change",
      "double",
      "doubleDip",
    ];
    if (round === 1) {
      return ["50-50", "hint"];
    }
    return allLifelines;
  };

  const selectCategory = (category) => {
    const sectionQuestions = questionsData.questions.filter(
      (q) => q.section === category
    );
    const shuffledQuestions = shuffleArray(sectionQuestions).slice(
      0,
      questionsPerSection
    );
    setQuestions(shuffledQuestions);
    setCurrentSection(category);
    setSelectedCategories([...selectedCategories, category]);
    setCurrentQuestion(0);
    setSectionComplete(false);
    setShouldResetTimer(true);
  };

  const handleAnswer = (selectedAnswerIndex) => {
    if (
      doubleDipActive &&
      selectedAnswerIndex !== questions[currentQuestion].correctAnswer
    ) {
      setDoubleDipActive(false);
      return;
    }

    setShowAnswer(true);
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestion] = {
        ...newQuestions[currentQuestion],
        selectedAnswer: selectedAnswerIndex,
      };
      return newQuestions;
    });

    const correct =
      selectedAnswerIndex === questions[currentQuestion].correctAnswer;
    if (correct) {
      audioManager.play('correct');
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentTeam] += doublePoints ? 2 : 1;
        return newScores;
      });
    } else {
      audioManager.play('wrong');
    }
    setDoublePoints(false);
    setDoubleDipActive(false);
    setTimeout(() => {
      setShowAnswer(false);
      setShowHint(false);
      setShowFact(true);
    }, 2000);
  };

  const nextQuestion = () => {
    setShowFact(false);
    setShowCorrectAnswer(false);
    setShowNextQuestionButton(false);
    setShouldResetTimer(true);
    audioManager.play('questionAppear');
    if (currentQuestion + 1 < questionsPerSection) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentTeam(currentTeam === 0 ? 1 : 0);
    } else {
      setSectionComplete(true);
      if (round < totalRounds) {
        setTimeout(() => {
          setRound((prevRound) => prevRound + 1);
          setCurrentSection(null);
          setSectionComplete(false);
        }, 5000);
      } else {
        setGameOver(true);
      }
    }
  };

  const handleTimeUp = () => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestion] = {
        ...newQuestions[currentQuestion],
        selectedAnswer: null,
      };
      return newQuestions;
    });
    setShowTimeUpPopup(true);
    setIsTimerPaused(true);
  };

  const handleNextQuestion = () => {
    setShowTimeUpPopup(false);
    setIsTimerPaused(false);
    nextQuestion();
  };

  const useLifeline = (lifeline) => {
    const availableLifelines = getAvailableLifelines();
    if (!availableLifelines.includes(lifeline)) {
      console.log("Lifeline not available in this round");
      return;
    }

    if (lifelinesUsed[currentTeam][round][lifeline]) {
      console.log("Lifeline already used by this team in this game");
      return;
    }

    setLifelinesUsed((prev) => ({
      ...prev,
      [currentTeam]: {
        ...prev[currentTeam],
        [round]: {
          ...prev[currentTeam][round],
          [lifeline]: true,
        },
      },
    }));

    setShouldResetTimer(false);
    audioManager.play('lifeline');

    switch (lifeline) {
      case "50-50":
        setQuestions((prevQuestions) => {
          const newQuestions = [...prevQuestions];
          const currentQ = newQuestions[currentQuestion];
          const correctAnswer = currentQ.correctAnswer;
          let optionsToRemove = [0, 1, 2, 3].filter((i) => i !== correctAnswer);
          optionsToRemove = shuffleArray(optionsToRemove).slice(0, 2);

          newQuestions[currentQuestion] = {
            ...currentQ,
            options: currentQ.options.map((option, index) =>
              optionsToRemove.includes(index) ? "" : option
            ),
          };
          return newQuestions;
        });
        break;
      case "change":
        const unusedQuestions = questionsData.questions.filter(
          (q) => q.section === currentSection && !questions.includes(q)
        );
        if (unusedQuestions.length > 0) {
          const newQuestion =
            unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
          setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[currentQuestion] = newQuestion;
            return newQuestions;
          });
        }
        break;
      case "hint":
        setShowHint(true);
        break;
      case "double":
        setDoublePoints(true);
        break;
      case "doubleDip":
        setDoubleDipActive(true);
        break;
      default:
        console.log("Unknown lifeline");
    }
  };

  const handlePowerPaplu = (lifeline) => {
    if (powerPapluActive) {
      setPowerPapluActive(false);
      setLifelinesUsed((prev) => ({
        ...prev,
        [currentTeam]: {
          ...prev[currentTeam],
          [round]: {
            ...prev[currentTeam][round],
            [lifeline]: false,
          },
        },
      }));
      useLifeline(lifeline);
    }
  };

  const handleTeamNameChange = (index, name) => {
    setTeamNames((prev) => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };

  const isLifelineUsed = (lifeline) => {
    return Object.values(lifelinesUsed[currentTeam]).some(roundLifelines => roundLifelines[lifeline]);
  };

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FontAwesomeIcon icon={faSpinner} spin size="5x" className="text-blue-500" />
      </motion.div>
    );
  }

  if (gameOver) {
    return <ScoreBoard scores={scores} teamNames={teamNames} />;
  }

  if (!currentSection) {
    return (
      <motion.div 
        className="flex h-screen bg-gradient-to-br from-blue-100 to-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-1/3 bg-gradient-to-b from-blue-200 to-purple-200 flex flex-col justify-center items-start p-8 shadow-lg">
          <h2 className="text-3xl font-extrabold mb-8 text-blue-600">
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Enter Team Names
          </h2>
          <div className="space-y-6 w-full">
            {[0, 1].map((index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={teamNames[index]}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Team ${index + 1} Name`}
                  className="w-full bg-white bg-opacity-50 rounded-lg py-3 px-4 text-blue-600 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105 animate-fadeIn"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FontAwesomeIcon icon={faGamepad} className="text-blue-400 text-3xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 p-8 flex items-center justify-center">
          <CategorySelector
            categories={sections.filter(
              (section) => !selectedCategories.includes(section)
            )}
            onSelect={selectCategory}
            currentTeam={currentTeam}
            round={round}
            teamName={teamNames[currentTeam]}
          />
        </div>
      </motion.div>
    );
  }

  if (sectionComplete) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-screen bg-white p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <h2 className="text-2xl font-bold mb-4">Round {round} Complete!</h2>
        <p className="text-xl mb-4">Current Scores:</p>
        <div className="flex justify-around mb-8">
          <div>
            <h3 className="text-xl font-bold">{teamNames[0] || "Team 1"}</h3>
            <p className="text-2xl">{scores[0]}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{teamNames[1] || "Team 2"}</h3>
            <p className="text-2xl">{scores[1]}</p>
          </div>
        </div>
        <p className="text-lg">
          {round < totalRounds ? "Get ready for the next round!" : "Game Over!"}
        </p>
      </motion.div>
    );
  }

  const availableLifelines = getAvailableLifelines();

  return (
    <motion.div 
      className="flex flex-col sm:flex-row h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full sm:w-1/3 lg:w-1/4 flex flex-row sm:flex-col p-2 sm:p-4 bg-white shadow-lg">
        <Team
          name={teamNames[0] || "Team 1"}
          score={scores[0]}
          active={currentTeam === 0}
        />
        <div className="flex-1 flex items-center justify-center my-2 sm:my-4">
          <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] sm:max-w-[240px]">
            {availableLifelines.map((lifeline) => (
              <Lifeline
                key={lifeline}
                name={lifeline}
                onUse={() =>
                  powerPapluActive
                    ? handlePowerPaplu(lifeline)
                    : useLifeline(lifeline)
                }
                disabled={isLifelineUsed(lifeline)}
              />
            ))}
          </div>
        </div>
        <Team
          name={teamNames[1] || "Team 2"}
          score={scores[1]}
          active={currentTeam === 1}
        />
      </div>
      <div className="w-full sm:w-2/3 lg:w-3/4 h-full overflow-y-auto p-2 sm:p-4 lg:p-8">
        <motion.h2 
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2 sm:mb-4 lg:mb-8 text-indigo-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Round {round}
        </motion.h2>
        <div className="flex justify-center items-center mb-4 lg:mb-8">
          <Timer 
            duration={10} 
            onTimeUp={handleTimeUp} 
            shouldReset={shouldResetTimer}
            isPaused={isTimerPaused}
          />
        </div>
        <Question
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
          showAnswer={showAnswer}
          disableOptions={showTimeUpPopup}
          showTimeUpPopup={showTimeUpPopup}
          onNextQuestion={handleNextQuestion}
        />
        {showHint && (
          <div className="mt-2 lg:mt-2 p-2 bg-yellow-100 rounded-lg">
            <p className="text-sm lg:text-lg font-semibold text-yellow-800">
              Hint: {questions[currentQuestion].hint}
            </p>
          </div>
        )}
        {doubleDipActive && (
          <div className="mt-4 lg:mt-8 p-4 bg-blue-100 rounded-lg">
            <p className="text-sm lg:text-lg font-semibold text-blue-800">
              Double Dip active: You can give another answer if your first answer is incorrect.
            </p>
          </div>
        )}
        {powerPapluActive && (
          <div className="mt-4 lg:mt-8 p-4 bg-purple-100 rounded-lg">
            <p className="text-sm lg:text-lg font-semibold text-purple-800">
              Power Paplu active: Select a previously used lifeline to reuse it.
            </p>
          </div>
        )}
        {showCorrectAnswer && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <p className="text-sm lg:text-lg font-semibold">
              Correct Answer: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
            </p>
          </div>
        )}
        {showNextQuestionButton && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
        {showFact && (
          <FactPopup
            fact={questions[currentQuestion].fact}
            onClose={nextQuestion}
          />
        )}
      </div>
    </motion.div>
  );
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default QuizGame;

