import React, { useState, useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback, Platform, Animated, StyleSheet } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Heading,
  Button,
  ButtonText,
  Input,
  InputField,
  VStack,
  Text,
} from '@gluestack-ui/themed';
import { STRINGS } from '../constants/strings';
import { COLORS } from '../constants/colors';

interface SavePresetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [presetName, setPresetName] = useState('');
  const [keyboardOffset] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
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

  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName.trim());
      setPresetName('');
      onClose();
    }
  };

  const handleClose = () => {
    setPresetName('');
    onClose();
  };

  return (
    <Modal isOpen={visible} onClose={handleClose}>
      <ModalBackdrop />
      <Animated.View
        style={[
          styles.animatedView,
          { transform: [{ translateY: keyboardOffset }] },
        ]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ModalContent bg={COLORS.white} maxWidth="90%" width="90%">
            <ModalHeader>
              <Heading size="lg">{STRINGS.savePreset}</Heading>
            </ModalHeader>
            <ModalBody>
              <VStack space="md">
                <Text size="sm">{STRINGS.presetNamePrompt}</Text>
                <Input variant="outline" size="lg">
                  <InputField
                    value={presetName}
                    onChangeText={setPresetName}
                    placeholder={STRINGS.presetNamePlaceholder}
                    autoFocus
                    onSubmitEditing={handleSave}
                    returnKeyType="done"
                  />
                </Input>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={handleClose}
              >
                <ButtonText>{STRINGS.cancel}</ButtonText>
              </Button>
              <Button
                size="sm"
                bg={COLORS.primary}
                onPress={handleSave}
                isDisabled={!presetName.trim()}
              >
                <ButtonText color={COLORS.text}>{STRINGS.save}</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </TouchableWithoutFeedback>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    width: '100%',
    alignItems: 'center',
  },
});
