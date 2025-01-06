import React from "react";

function ScoreBoard({ scores, teamNames, onClose }) {
  const [score1, score2] = scores;
  const winningTeam =
    score1 > score2 ? teamNames[0] || "Team 1" : teamNames[1] || "Team 2";
  const winningScoreDifference = Math.abs(score1 - score2);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="text-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-6 animate__animated animate__fadeIn">
        🎉 Game Over!
      </h2>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-yellow-400 animate__animated animate__fadeIn">
          {winningTeam} Wins!
        </h3>
        <p className="text-3xl animate__animated animate__fadeIn">
          Victory by: {winningScoreDifference} points
        </p>
      </div>
      <div className="mb-8 animate__animated animate__fadeIn animate__delay-1s">
        <h3 className="text-2xl font-bold text-yellow-400">
          {teamNames[0] || "Team 1"}
        </h3>
        <p className="text-3xl">{score1}</p>
        <h3 className="text-2xl font-bold text-yellow-400 mt-4">
          {teamNames[1] || "Team 2"}
        </h3>
        <p className="text-3xl">{score2}</p>
      </div>
      <p className="text-3xl font-bold text-yellow-400 mb-6 animate__animated animate__fadeIn animate__delay-2s">
        Congratulations on your performance!
      </p>
      <div className="flex justify-center space-x-8 animate__animated animate__fadeIn animate__delay-3s">
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-xl transform transition duration-200 hover:scale-105"
        >
          Close
        </button>
        <button
          onClick={handlePlayAgain}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-xl transform transition duration-200 hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default ScoreBoard;
