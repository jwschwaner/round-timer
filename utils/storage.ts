import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@round_timer_settings';

export interface TimerSettings {
  roundDuration: number; // in seconds
  breakDuration: number; // in seconds
  totalRounds: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  roundDuration: 180, // 3 minutes
  breakDuration: 60, // 1 minute
  totalRounds: 5,
};

export const loadSettings = async (): Promise<TimerSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: TimerSettings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};
