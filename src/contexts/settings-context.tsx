"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AUDIO_FREQUENCIES } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';

interface HearingProfile {
  [frequency: number]: number; // dB loss
}

interface TuningProfile {
  [frequency: number]: number; // Percentage
}

interface Settings {
  leftEar: HearingProfile;
  rightEar: HearingProfile;
  tuning: TuningProfile;
}

interface SettingsContextType {
  settings: Settings;
  updateHearingProfile: (ear: 'left' | 'right', frequency: number, value: number) => void;
  updateTuning: (frequency: number, value: number) => void;
  resetSettings: () => void;
  setProfileFromUserData: (left: string, right: string) => void;
}

const defaultHearingProfile: HearingProfile = AUDIO_FREQUENCIES.reduce((acc, freq) => {
  acc[freq] = 0;
  return acc;
}, {} as HearingProfile);

const defaultTuningProfile: TuningProfile = AUDIO_FREQUENCIES.reduce((acc, freq) => {
  acc[freq] = 50; // Default to 50%
  return acc;
}, {} as TuningProfile);


const DEFAULT_SETTINGS: Settings = {
  leftEar: defaultHearingProfile,
  rightEar: defaultHearingProfile,
  tuning: defaultTuningProfile,
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, updateUser, isInitialized: authIsInitialized } = useAuth();

  const parseEarData = useCallback((earData: string): HearingProfile => {
    const values = earData.split(',').map(Number);
    const profile: HearingProfile = {};
    AUDIO_FREQUENCIES.forEach((freq, index) => {
      profile[freq] = values[index] || 0;
    });
    return profile;
  }, []);
  
  const setProfileFromUserData = useCallback((left: string, right: string) => {
    setSettings(prev => ({
      ...prev,
      leftEar: parseEarData(left),
      rightEar: parseEarData(right)
    }));
  }, [parseEarData]);

  useEffect(() => {
    if (authIsInitialized) {
      if (user) {
        setProfileFromUserData(user.left_ear, user.right_ear);
      } else {
         try {
          const savedSettings = localStorage.getItem('dhvaniSettings_guest');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            // Basic validation
            if(parsed.leftEar && parsed.rightEar && parsed.tuning) {
               setSettings(parsed);
            }
          }
        } catch (error) {
          console.error("Failed to load guest settings from localStorage", error);
        }
      }
      setIsInitialized(true);
    }
  }, [user, authIsInitialized, setProfileFromUserData]);

  useEffect(() => {
    if (isInitialized && !user) {
      try {
        localStorage.setItem('dhvaniSettings_guest', JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save guest settings to localStorage", error);
      }
    }
  }, [settings, isInitialized, user]);
  
  useEffect(() => {
     if (isInitialized && user) {
       const leftEarString = AUDIO_FREQUENCIES.map(freq => settings.leftEar[freq] || 0).join(',');
       const rightEarString = AUDIO_FREQUENCIES.map(freq => settings.rightEar[freq] || 0).join(',');
       if (user.left_ear !== leftEarString || user.right_ear !== rightEarString) {
         updateUser({ left_ear: leftEarString, right_ear: rightEarString });
       }
     }
  }, [settings.leftEar, settings.rightEar, isInitialized, user, updateUser]);


  const updateHearingProfile = useCallback((ear: 'left' | 'right', frequency: number, value: number) => {
    setSettings(prev => ({
      ...prev,
      [ear === 'left' ? 'leftEar' : 'rightEar']: {
        ...prev[ear === 'left' ? 'leftEar' : 'rightEar'],
        [frequency]: value,
      },
    }));
  }, []);

  const updateTuning = useCallback((frequency: number, value: number) => {
    setSettings(prev => ({
      ...prev,
      tuning: {
        ...prev.tuning,
        [frequency]: value,
      }
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      leftEar: { ...defaultHearingProfile },
      rightEar: { ...defaultHearingProfile },
      tuning: { ...defaultTuningProfile },
    }));
  }, []);

  const value = {
    settings,
    updateHearingProfile,
    updateTuning,
    resetSettings,
    setProfileFromUserData
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
