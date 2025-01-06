import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { motion, AnimatePresence } from 'framer-motion'

function Question({ question, onAnswer, showAnswer, disableOptions, showTimeUpPopup, onNextQuestion }) {
  if (!question) return null;

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-3xl -z-10"></div>
      
      {/* Question Card */}
      <motion.div 
        className="bg-white rounded-xl p-6 mb-8 shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">{question.section}</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-500 p-3 rounded-full">
            <FontAwesomeIcon icon={faQuestionCircle} className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{question.question}</h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => onAnswer(index)}
                disabled={showAnswer || disableOptions}
                className={`
                  p-4 text-left rounded-xl transition-all transform hover:scale-105 flex items-center
                  ${showAnswer 
                    ? index === question.correctAnswer 
                      ? 'bg-green-500 text-white'
                      : index === question.selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-indigo-100'
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white font-bold mr-4">
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                <span className="font-medium text-lg">{option}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Time's Up Popup */}
      <AnimatePresence>
        {showTimeUpPopup && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <FontAwesomeIcon icon={faClock} className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Time's Up!</h3>
              <p className="text-lg mb-6">The correct answer is:</p>
              <div className="bg-green-100 p-4 rounded-lg mb-6">
                <p className="text-xl font-semibold text-green-800">
                  {question.options[question.correctAnswer]}
                </p>
              </div>
              <motion.button
                onClick={onNextQuestion}
                className="bg-indigo-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-indigo-600 transition-colors flex items-center justify-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Question
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Question

