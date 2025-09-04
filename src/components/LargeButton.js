import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';

const LargeButton = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];
  
  const textStyleCombined = [
    styles.buttonText,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      <View style={styles.buttonContent}>
        {icon && (
          <Icon
            name={icon}
            size={28}
            color={variant === 'primary' ? colors.textLight : colors.primary}
            style={styles.icon}
          />
        )}
        <Text style={textStyleCombined}>
          {loading ? 'Loading...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 8,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  
  icon: {
    marginRight: 12,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  // Primary variant
  primary: {
    backgroundColor: colors.primary,
  },
  
  primaryText: {
    color: colors.textLight,
  },
  
  // Secondary variant
  secondary: {
    backgroundColor: colors.secondary,
  },
  
  secondaryText: {
    color: colors.textLight,
  },
  
  // Outline variant
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  outlineText: {
    color: colors.primary,
  },
  
  // Disabled state
  disabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  
  disabledText: {
    color: colors.textSecondary,
  },
});

export default LargeButton;
