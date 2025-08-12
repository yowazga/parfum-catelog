import React, { useState, useEffect } from 'react';

const SessionTimer = () => {
  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);

  useEffect(() => {
    const updateTimer = () => {
      const sessionStartTime = localStorage.getItem('sessionStartTime');
      if (sessionStartTime) {
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        const elapsed = Date.now() - parseInt(sessionStartTime);
        const remaining = SESSION_TIMEOUT - elapsed;
        
        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setSessionTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setSessionTimeLeft('0:00');
        }
      } else {
        setSessionTimeLeft(null);
      }
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!sessionTimeLeft) return null;

  const isLowTime = sessionTimeLeft && sessionTimeLeft.split(':')[0] < 5; // Less than 5 minutes

  return (
    <div className={`flex items-center text-sm ${isLowTime ? 'text-red-600' : 'text-gray-600'}`}>
      <svg className={`h-4 w-4 mr-1 ${isLowTime ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Session: {sessionTimeLeft}
    </div>
  );
};

export default SessionTimer;
