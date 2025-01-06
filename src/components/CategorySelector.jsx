import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLightbulb, faFilm, faLaptopCode } from '@fortawesome/free-solid-svg-icons';

const categoryIcons = {
  "Cricket": faTrophy,
  "Movies": faFilm,
  "General Knowledge and Facts": faLightbulb,
  "Technology": faLaptopCode,
};

function CategorySelector({ categories, onSelect, teamName }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-6 text-blue-600 text-center animate-fadeInDown">
        Choose Your Category
      </h2>
      <h3 className="text-2xl font-semibold mb-8 text-blue-500 text-center animate-fadeInUp">
        <span className="text-purple-500">{teamName}</span> turn to select category:
      </h3>
      <div className="grid grid-cols-2 gap-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className="bg-gradient-to-r from-blue-300 to-purple-300 text-blue-700 font-bold py-8 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-400 hover:to-purple-400 text-xl flex flex-col items-center justify-center space-y-4 animate-fadeIn"
          >
            <FontAwesomeIcon icon={categoryIcons[category] || faLightbulb} size="3x" />
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;

