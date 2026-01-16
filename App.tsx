import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GluestackUIProvider, Box, VStack, HStack, Text } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';

import { COLORS } from './constants/colors';
import { STRINGS } from './constants/strings';
import { useTimer } from './hooks/useTimer';
import { loadSettings, saveSettings, TimerSettings, DEFAULT_SETTINGS } from './utils/storage';
import { initAudio } from './utils/audio';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const timer = useTimer(settings);

  useEffect(() => {
    const initialize = async () => {
      await initAudio();
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
      timer.updateSettings(loadedSettings);
      setIsReady(true);
    };

    initialize();
  }, []);

  const handleSettingsSave = async (newSettings: TimerSettings) => {
    setSettings(newSettings);
    timer.updateSettings(newSettings);
    await saveSettings(newSettings);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (timer.timerState === 'not-started') {
      timer.start();
    } else if (timer.timerState === 'active') {
      timer.pause();
    } else if (timer.timerState === 'paused') {
      timer.resume();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Box flex={1} backgroundColor={COLORS.background} padding={20}>
          <VStack flex={1} justifyContent="space-around" space="md">
            {/* Header */}
            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="flex-start">
                <VStack space="xs" flex={1}>
                  <Text fontSize={11} fontWeight="500" letterSpacing={1.5} color={COLORS.textSecondary}>
                    {STRINGS.appTitle}
                  </Text>
                  <Text fontSize={32} fontWeight="700" color={COLORS.text} lineHeight={38}>
                    {STRINGS.heading}
                  </Text>
                </VStack>
                <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.settingsButton}>
                  <View style={styles.settingsIconCircle}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                  </View>
                </TouchableOpacity>
              </HStack>
              <Text fontSize={15} color={COLORS.textSecondary} lineHeight={22}>
                {STRINGS.subheading}
              </Text>
            </VStack>

            {/* Timer Card */}
            <Box flex={3}>
              <Box
                flex={1}
                backgroundColor={COLORS.white}
                borderRadius={24}
                padding={32}
                shadowColor={COLORS.shadow}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={12}
                elevation={5}
                position="relative"
                overflow="hidden"
                justifyContent="center"
              >
                {/* Decorative circle - top right */}
                <View style={styles.decorativeCircle}>
                  <Svg height="200" width="200" viewBox="0 0 200 200">
                    <Circle cx="100" cy="100" r="100" fill={COLORS.primary} />
                  </Svg>
                </View>
                
                {/* Decorative circle - bottom left */}
                <View style={styles.decorativeCircleBottomLeft}>
                  <Svg height="160" width="160" viewBox="0 0 160 160">
                    <Circle cx="80" cy="80" r="80" fill={COLORS.bottomCircle} />
                  </Svg>
                </View>

                <VStack space="2xl" alignItems="center">
                  {/* Status Row */}
                  <HStack width="100%" justifyContent="space-between" alignItems="center">
                    <Text fontSize={13} fontWeight="600" letterSpacing={1} color={COLORS.text}>
                      {STRINGS.ready}
                    </Text>
                    <Text fontSize={13} color={COLORS.textSecondary}>
                      {STRINGS.round} {timer.currentRound}/{timer.totalRounds}
                    </Text>
                  </HStack>

                  {/* Time Display */}
                  <Text fontSize={80} fontWeight="700" color={COLORS.text} lineHeight={80}>
                    {formatTime(timer.timeRemaining)}
                  </Text>

                  {/* Next Phase */}
                  <Text fontSize={15} color={COLORS.textSecondary}>
                    {STRINGS.next} {timer.currentPhase === 'round' ? STRINGS.break : STRINGS.round}{' '}
                    {formatTime(timer.nextPhaseDuration)}
                  </Text>
                </VStack>
              </Box>
            </Box>

            {/* Play/Pause Button */}
            <Box flex={1}>
              <TouchableOpacity onPress={handlePlayPause} style={{ flex: 1 }}>
                <Box
                  flex={1}
                  backgroundColor={COLORS.primary}
                  borderRadius={20}
                  justifyContent="center"
                  alignItems="center"
                  shadowColor={COLORS.shadow}
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={8}
                  elevation={3}
                >
                  {timer.timerState === 'active' ? (
                    <Ionicons name="pause" size={50} color={COLORS.black} />
                  ) : (
                    <Ionicons name="play" size={50} color={COLORS.black} />
                  )}
                </Box>
              </TouchableOpacity>
            </Box>

            {/* Reset Button */}
            <TouchableOpacity onPress={timer.reset}>
              <Box
                backgroundColor="transparent"
                borderWidth={1}
                borderColor={COLORS.border}
                borderRadius={20}
                height={56}
                paddingHorizontal={20}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap={8}
              >
                <Text fontSize={16} color={COLORS.text}>
                  {STRINGS.reset}
                </Text>
                <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
              </Box>
            </TouchableOpacity>
          </VStack>

          {/* Settings Modal */}
          <SettingsModal
            visible={settingsVisible}
            settings={settings}
            onClose={() => setSettingsVisible(false)}
            onSave={handleSettingsSave}
          />
        </Box>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  settingsButton: {
    padding: 0,
  },
  settingsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -100,
    right: -80,
    opacity: 0.9,
  },
  decorativeCircleBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    opacity: 0.6,
  },
});
