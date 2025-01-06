import React from 'react'

function Team({ name, score, active }) {
  return (
    <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
      active ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white scale-105' : 'bg-gray-200'
    }`}>
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-4xl font-extrabold">{score}</p>
    </div>
  )
}

export default Team

