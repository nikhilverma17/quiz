import React, { useState, useEffect, useRef } from 'react';

function Timer({ duration, onTimeUp, shouldReset, isPaused }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showPopup, setShowPopup] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (shouldReset) {
      setTimeLeft(duration);
    }

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setShowPopup(true);
            setTimeout(() => {
              setShowPopup(false);
              onTimeUp();
            }, 2000);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, onTimeUp, shouldReset, isPaused]);

  return (
    <div className="relative">
      <div className="text-3xl font-bold bg-yellow-400 text-blue-900 p-4 rounded-full w-20 h-20 flex items-center justify-center">
        {timeLeft}
      </div>
      {showPopup && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-red-500 text-white p-2 rounded">
          Time's up!
        </div>
      )}
    </div>
  );
}

export default Timer;

