import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Platform, View, StyleSheet, Keyboard, Animated, TouchableWithoutFeedback } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { TimerSettings } from '../utils/storage';
import { TimePicker } from './TimePicker';

interface SettingsModalProps {
  visible: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
  onSavePreset?: () => void;
}

type PickerMode = 'round' | 'break' | null;

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onClose,
  onSave,
  onSavePreset,
}) => {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [keyboardOffset] = useState(new Animated.Value(0));

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // Move up just enough to clear the keyboard with some padding
        const offset = e.endCoordinates.height / 3;
        Animated.timing(keyboardOffset, {
          toValue: -offset,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardOffset]);

  if (!visible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleTimeSave = (minutes: number, seconds: number) => {
    const totalSeconds = minutes * 60 + seconds;
    if (pickerMode === 'round') {
      setLocalSettings({ ...localSettings, roundDuration: totalSeconds });
    } else if (pickerMode === 'break') {
      setLocalSettings({ ...localSettings, breakDuration: totalSeconds });
    }
    setPickerMode(null);
  };

  // Show time picker as a separate view that replaces the settings form
  if (pickerMode) {
    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        justifyContent="center"
        alignItems="center"
        padding={20}
      >
        <View style={styles.modalCard}>
          <TimePicker
            title={pickerMode === 'round' ? STRINGS.roundLength : STRINGS.breakLength}
            initialMinutes={Math.floor(
              (pickerMode === 'round'
                ? localSettings.roundDuration
                : localSettings.breakDuration) / 60
            )}
            initialSeconds={
              (pickerMode === 'round'
                ? localSettings.roundDuration
                : localSettings.breakDuration) % 60
            }
            onCancel={() => setPickerMode(null)}
            onSave={handleTimeSave}
          />
        </View>
      </Box>
    );
  }

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0, 0, 0, 0.5)"
      justifyContent="center"
      alignItems="center"
      padding={20}
    >
      <Animated.View
        style={[
          styles.keyboardAvoidingView,
          { transform: [{ translateY: keyboardOffset }] },
        ]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.settingsCard}>
          <VStack space="lg">
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize={24} fontWeight="600" color={COLORS.text}>
                {STRINGS.sessionSettings}
              </Text>
              <HStack space="md" alignItems="center">
                {onSavePreset && (
                  <TouchableOpacity onPress={onSavePreset}>
                    <Ionicons name="bookmark-outline" size={28} color={COLORS.text} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={28} color={COLORS.text} />
                </TouchableOpacity>
              </HStack>
            </HStack>

            <VStack space="md">
              <Text fontSize={14} color={COLORS.textSecondary}>
                {STRINGS.roundLength}
              </Text>
              <TouchableOpacity onPress={() => setPickerMode('round')}>
                <Box
                  backgroundColor={COLORS.background}
                  borderRadius={12}
                  padding={16}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text fontSize={16} color={COLORS.text}>
                    {formatTime(localSettings.roundDuration)}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </Box>
              </TouchableOpacity>
            </VStack>

            <VStack space="md">
              <Text fontSize={14} color={COLORS.textSecondary}>
                {STRINGS.breakLength}
              </Text>
              <TouchableOpacity onPress={() => setPickerMode('break')}>
                <Box
                  backgroundColor={COLORS.background}
                  borderRadius={12}
                  padding={16}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text fontSize={16} color={COLORS.text}>
                    {formatTime(localSettings.breakDuration)}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </Box>
              </TouchableOpacity>
            </VStack>

            <VStack space="md">
              <Text fontSize={14} color={COLORS.textSecondary}>
                {STRINGS.rounds}
              </Text>
              <Input
                backgroundColor={COLORS.background}
                borderRadius={12}
                borderWidth={0}
              >
                <InputField
                  fontSize={16}
                  color={COLORS.text}
                  keyboardType="numeric"
                  value={localSettings.totalRounds === 0 ? '' : String(localSettings.totalRounds)}
                  onChangeText={(text) => {
                    if (text === '') {
                      setLocalSettings({ ...localSettings, totalRounds: 0 });
                    } else {
                      const num = parseInt(text, 10);
                      if (!isNaN(num)) {
                        setLocalSettings({ ...localSettings, totalRounds: num });
                      }
                    }
                  }}
                  onBlur={() => {
                    // Ensure at least 1 round when leaving the field
                    if (localSettings.totalRounds < 1) {
                      setLocalSettings({ ...localSettings, totalRounds: 1 });
                    }
                  }}
                />
              </Input>
            </VStack>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{STRINGS.save}</Text>
            </TouchableOpacity>
          </VStack>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Box>
  );
};

const MODAL_HEIGHT = 420;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    height: MODAL_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});
