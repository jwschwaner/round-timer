import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@round_timer_settings';
const PRESETS_KEY = '@round_timer_presets';
const ACTIVE_PRESET_KEY = '@round_timer_active_preset';

export interface TimerSettings {
  roundDuration: number; // in seconds
  breakDuration: number; // in seconds
  totalRounds: number;
}

export interface TimerPreset {
  id: string;
  name: string;
  settings: TimerSettings;
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

// Preset management functions
export const loadPresets = async (): Promise<TimerPreset[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PRESETS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading presets:', error);
    return [];
  }
};

export const savePreset = async (name: string, settings: TimerSettings): Promise<void> => {
  try {
    const presets = await loadPresets();
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name,
      settings,
    };
    presets.push(newPreset);
    const jsonValue = JSON.stringify(presets);
    await AsyncStorage.setItem(PRESETS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving preset:', error);
  }
};

export const deletePreset = async (presetId: string): Promise<void> => {
  try {
    const presets = await loadPresets();
    const filteredPresets = presets.filter((p) => p.id !== presetId);
    const jsonValue = JSON.stringify(filteredPresets);
    await AsyncStorage.setItem(PRESETS_KEY, jsonValue);
    
    // Clear active preset if it was deleted
    const activePresetId = await loadActivePresetId();
    if (activePresetId === presetId) {
      await saveActivePresetId(null);
    }
  } catch (error) {
    console.error('Error deleting preset:', error);
  }
};

// Active preset management
export const loadActivePresetId = async (): Promise<string | null> => {
  try {
    const presetId = await AsyncStorage.getItem(ACTIVE_PRESET_KEY);
    return presetId;
  } catch (error) {
    console.error('Error loading active preset ID:', error);
    return null;
  }
};

export const saveActivePresetId = async (presetId: string | null): Promise<void> => {
  try {
    if (presetId === null) {
      await AsyncStorage.removeItem(ACTIVE_PRESET_KEY);
    } else {
      await AsyncStorage.setItem(ACTIVE_PRESET_KEY, presetId);
    }
  } catch (error) {
    console.error('Error saving active preset ID:', error);
  }
};
