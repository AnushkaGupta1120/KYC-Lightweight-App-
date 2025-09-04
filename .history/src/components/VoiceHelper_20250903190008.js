import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Tts from 'react-native-tts';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';

const VoiceHelper = ({
  text,
  language = 'hi-IN',
  autoPlay = true,
  showVisualIndicator = true,
  onComplete,
  style
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    setupTTS();
    if (autoPlay && text) {
      playVoice();
    }
    
    return () => {
      Tts.stop();
    };
  }, [text, autoPlay]);

  const setupTTS = () => {
    Tts.setDefaultLanguage(language);
    Tts.setDefaultRate(0.5); // Slower for better comprehension
    Tts.setDefaultPitch(1.0);
    
    Tts.addEventListener('tts-start', () => {
      setIsPlaying(true);
      startAnimation();
    });
    
    Tts.addEventListener('tts-finish', () => {
      setIsPlaying(false);
      stopAnimation();
      onComplete && onComplete();
    });
    
    Tts.addEventListener('tts-cancel', () => {
      setIsPlaying(false);
      stopAnimation();
    });
  };

  const playVoice = () => {
    if (text) {
      Tts.speak(text, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.7,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopAnimation = () => {
    animatedValue.stopAnimation();
    animatedValue.setValue(0);
  };

  if (!showVisualIndicator) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {isPlaying && (
        <View style={styles.indicator}>
          <Animated.View
            style={[
              styles.wave,
              {
                opacity: animatedValue,
                transform: [
                  {
                    scaleY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={styles.indicatorText}>
            आवाज़ गाइड चल रहा है... / Voice guidance playing...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  wave: {
    width: 20,
    height: 20,
    backgroundColor: colors.textLight,
    borderRadius: 10,
    marginRight: 10,
  },
  
  indicatorText: {
    color: colors.textLight,
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
  },
});

export default VoiceHelper;
