import React from "react";

function FactPopup({ fact, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl p-8 max-w-lg w-full shadow-lg transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          🌟 Did you know?
        </h2>
        <p className="text-lg text-white mb-6 italic">
          "{fact}"
        </p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-200 text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default FactPopup;
