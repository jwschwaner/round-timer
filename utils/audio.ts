import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Pre-load sound objects for better performance
let shortBeepSound: Audio.Sound | null = null;
let longBeepSound: Audio.Sound | null = null;

export const initAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    // Pre-load the beep sounds
    const { sound: shortSound } = await Audio.Sound.createAsync(
      require('../assets/sounds/short-beep.mp3'),
      { shouldPlay: false, volume: 1.0 }
    );
    shortBeepSound = shortSound;

    const { sound: longSound } = await Audio.Sound.createAsync(
      require('../assets/sounds/long-beep.mp3'),
      { shouldPlay: false, volume: 1.0 }
    );
    longBeepSound = longSound;
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

export const playShortBeep = async () => {
  try {
    if (shortBeepSound) {
      await shortBeepSound.replayAsync();
    }
    // Also provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.error('Error playing short beep:', error);
    // Fallback to haptics only
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

export const playLongBeep = async () => {
  try {
    if (longBeepSound) {
      await longBeepSound.replayAsync();
    }
    // Also provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.error('Error playing long beep:', error);
    // Fallback to haptics only
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
};

export const playBeepSequence = async () => {
  // 3 short beeps + 1 long beep
  await playShortBeep();
  await new Promise(resolve => setTimeout(resolve, 250));
  await playShortBeep();
  await new Promise(resolve => setTimeout(resolve, 250));
  await playShortBeep();
  await new Promise(resolve => setTimeout(resolve, 350));
  await playLongBeep();
};
