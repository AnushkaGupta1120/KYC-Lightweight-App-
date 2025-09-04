import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../styles/colors';

const HelpButton = ({onPress, style}) => {
  return (
    <TouchableOpacity
      style={[styles.helpButton, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Icon name="help" size={24} color={colors.textLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  helpButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
});

export default HelpButton;
