import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Box, HStack, Text, VStack } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { TimerPreset } from '../utils/storage';

interface PresetSelectorProps {
  presets: TimerPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: TimerPreset) => void;
  onDeletePreset?: (presetId: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onDeletePreset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activePreset = presets.find((p) => p.id === activePresetId);
  const displayText = activePreset ? activePreset.name : STRINGS.selectPreset;

  return (
    <Box position="relative" width="100%">
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Box
          backgroundColor="transparent"
          borderWidth={1.5}
          borderColor={COLORS.border}
          borderRadius={20}
          height={56}
          paddingHorizontal={20}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize={16} color={activePreset ? COLORS.text : COLORS.textSecondary}>
            {displayText}
          </Text>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.textSecondary}
          />
        </Box>
      </TouchableOpacity>

      {isOpen && (
        <>
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <Box
              position="absolute"
              top={-1000}
              left={-1000}
              right={-1000}
              bottom={-1000}
              zIndex={999}
            />
          </TouchableWithoutFeedback>
          <Box
            position="absolute"
            top={60}
            left={0}
            right={0}
            backgroundColor={COLORS.white}
            borderRadius={12}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.15}
            shadowRadius={8}
            elevation={5}
            zIndex={1000}
            maxHeight={250}
          >
          {presets.length === 0 ? (
            <Box padding={20} alignItems="center">
              <Text fontSize={14} color={COLORS.textSecondary}>
                No saved presets
              </Text>
            </Box>
          ) : (
            <ScrollView style={styles.scrollView}>
              {presets.map((preset) => (
                <Box key={preset.id}>
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    padding={12}
                  >
                    <TouchableOpacity
                      style={styles.presetButton}
                      onPress={() => {
                        onSelectPreset(preset);
                        setIsOpen(false);
                      }}
                    >
                      <VStack space="xs" flex={1}>
                        <Text fontSize={16} fontWeight="600" color={COLORS.text}>
                          {preset.name}
                        </Text>
                        <Text fontSize={12} color={COLORS.textSecondary}>
                          {Math.floor(preset.settings.roundDuration / 60)}m {preset.settings.roundDuration % 60}s rounds • {Math.floor(preset.settings.breakDuration / 60)}m {preset.settings.breakDuration % 60}s breaks • {preset.settings.totalRounds} rounds
                        </Text>
                      </VStack>
                    </TouchableOpacity>
                    {onDeletePreset && (
                      <TouchableOpacity
                        onPress={() => {
                          onDeletePreset(preset.id);
                        }}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </HStack>
                  <Box height={1} backgroundColor="#E5E5E5" />
                </Box>
              ))}
            </ScrollView>
          )}
          </Box>
        </>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    borderRadius: 12,
  },
  presetButton: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
