import React, { useState, useEffect, useCallback } from "react";
import { Timer, Play, Pause, Coffee, CheckCircle2 } from "lucide-react";

export default function TaskTimer({ taskName }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback((breakMode = false) => {
    setIsActive(false);
    setIsBreak(breakMode);
    setSeconds(breakMode ? 5 * 60 : 25 * 60);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
      if (!isBreak) setSessionsCompleted((prev) => prev + 1);
      alert(isBreak ? "Break over! Time to focus." : "Session complete! Take a break.");
      resetTimer(!isBreak); // Auto-switch mode
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, isBreak, resetTimer]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="bg-(--surface) border border-soft rounded-2xl p-5 shadow-sm animate-in space-y-4">
      {/* Header & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-main">
          <Timer size={18} />
          <h4 className="text-sm font-semibold truncate max-w-[150px]">{taskName}</h4>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-soft text-muted">
          {isBreak ? "Break Time" : "Focus Session"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-soft rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${isBreak ? 'bg-green-500' : 'bg-(--primary)'}`} 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Timer Display */}
      <div className="text-center text-5xl font-bold text-main font-mono">
        {formatTime(seconds)}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted">
        <CheckCircle2 size={14} />
        <span>{sessionsCompleted} sessions completed today</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={toggleTimer}
          className="p-3 rounded-xl bg-(--primary) text-white hover:opacity-90 transition-all shadow-md"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={() => resetTimer(false)} className="p-3 rounded-xl bg-soft text-main hover:bg-gray-100">
          <Timer size={20} />
        </button>
        <button onClick={() => resetTimer(true)} className="p-3 rounded-xl bg-soft text-main hover:bg-gray-100">
          <Coffee size={20} />
        </button>
      </div>
    </div>
  );
}



