import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerSettings } from '../utils/storage';
import { playShortBeep, playLongBeep } from '../utils/audio';

export type TimerState = 'not-started' | 'active' | 'paused' | 'completed';
export type PhaseType = 'round' | 'break';

interface TimerHookReturn {
  timerState: TimerState;
  currentPhase: PhaseType;
  currentRound: number;
  timeRemaining: number;
  nextPhaseDuration: number;
  totalRounds: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  updateSettings: (settings: TimerSettings) => void;
}

const BEEP_WARNING_TIME = 4; // seconds before end to play beeps

export const useTimer = (initialSettings: TimerSettings): TimerHookReturn => {
  const [timerState, setTimerState] = useState<TimerState>('not-started');
  const [currentPhase, setCurrentPhase] = useState<PhaseType>('round');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(initialSettings.roundDuration);
  const [settings, setSettings] = useState(initialSettings);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStateRef = useRef(timerState);
  const settingsRef = useRef(settings);

  // Keep refs in sync
  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    // Immediately update time remaining if timer is not started
    if (timerStateRef.current === 'not-started') {
      setTimeRemaining(newSettings.roundDuration);
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setTimerState('active');
  }, []);

  const pause = useCallback(() => {
    setTimerState('paused');
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    setTimerState('active');
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentPhase('round');
    setCurrentRound(1);
    setTimeRemaining(settingsRef.current.roundDuration);
    setTimerState('not-started');
  }, [clearTimer]);

  useEffect(() => {
    if (timerState === 'active') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;

          // Play short beep at 3, 2, and 1 seconds
          if (newTime === 3 || newTime === 2 || newTime === 1) {
            playShortBeep();
          }

          // Phase completed - play long beep
          if (newTime <= 0) {
            playLongBeep();

            if (currentPhase === 'round') {
              // Move to break or next round
              if (currentRound < settings.totalRounds) {
                setCurrentPhase('break');
                return settings.breakDuration;
              } else {
                // All rounds completed - automatically reset
                clearTimer();
                setCurrentPhase('round');
                setCurrentRound(1);
                setTimerState('not-started');
                return settings.roundDuration;
              }
            } else {
              // Break ended, move to next round
              setCurrentPhase('round');
              setCurrentRound((prev) => prev + 1);
              return settings.roundDuration;
            }
          }

          return newTime;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [timerState, currentPhase, currentRound, settings, clearTimer]);

  const nextPhaseDuration =
    currentPhase === 'round' ? settings.breakDuration : settings.roundDuration;

  return {
    timerState,
    currentPhase,
    currentRound,
    timeRemaining,
    nextPhaseDuration,
    totalRounds: settings.totalRounds,
    start,
    pause,
    resume,
    reset,
    updateSettings,
  };
};
