import React from 'react';
import { View, StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { TimerPicker } from 'react-native-timer-picker';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

interface TimePickerProps {
  title: string;
  initialMinutes: number;
  initialSeconds: number;
  onCancel: () => void;
  onSave: (minutes: number, seconds: number) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  title,
  initialMinutes,
  initialSeconds,
  onCancel,
  onSave,
}) => {
  const [minutes, setMinutes] = React.useState(initialMinutes);
  const [seconds, setSeconds] = React.useState(initialSeconds);

  const handleSave = () => {
    onSave(minutes, seconds);
  };

  return (
    <View style={styles.pickerContainer}>
      <RNText style={styles.pickerTitle}>{title}</RNText>
      
      <View style={styles.pickerWrapper}>
        <TimerPicker
          padWithNItems={2}
          hideHours
          hideDays
          initialValue={{
            minutes: initialMinutes,
            seconds: initialSeconds,
          }}
          onDurationChange={(duration) => {
            setMinutes(duration.minutes);
            setSeconds(duration.seconds);
          }}
          styles={{
            theme: 'light',
            backgroundColor: COLORS.white,
            pickerItem: {
              fontSize: 34,
              color: COLORS.text,
            },
            pickerLabel: {
              fontSize: 18,
              color: COLORS.textSecondary,
              marginLeft: 8,
            },
            pickerContainer: {
              backgroundColor: COLORS.white,
            },
          }}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <RNText style={styles.cancelButtonText}>{STRINGS.cancel}</RNText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <RNText style={styles.saveButtonText}>{STRINGS.save}</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.text,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
