import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {EnhancedVoiceManager} from '../services/EnhancedVoiceManager';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';

const EnhancedVoiceHelper = ({
  text,
  language = 'hi',
  autoPlay = true,
  showVisualIndicator = true,
  allowUserControl = true,
  onComplete,
  onSpeechResult,
  style
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));
  const waveAnimationRef = useRef();

  useEffect(() => {
    setupVoiceManager();
    if (autoPlay && text) {
      playVoice();
    }
    
    return () => {
      EnhancedVoiceManager.cleanup();
    };
  }, [text, autoPlay]);

  const setupVoiceManager = async () => {
    await EnhancedVoiceManager.initialize();
    await EnhancedVoiceManager.setLanguage(language);
  };

  const playVoice = async () => {
    if (!text) return;
    
    setIsPlaying(true);
    startWaveAnimation();
    
    await EnhancedVoiceManager.speakWithCallback(
      text,
      () => {
        setIsPlaying(false);
        stopWaveAnimation();
        onComplete && onComplete();
      },
      {
        language: `${language}-IN`,
        rate: 0.4,
        volume: 0.8,
        emphasis: true,
      }
    );
  };

  const pauseVoice = async () => {
    await EnhancedVoiceManager.pauseTTS();
    setIsPaused(true);
    setIsPlaying(false);
    stopWaveAnimation();
  };

  const resumeVoice = async () => {
    setIsPaused(false);
    await playVoice(); // Re-start from beginning
  };

  const startListening = async () => {
    setIsListening(true);
    setSpeechText('');
    
    const result = await EnhancedVoiceManager.startListening({
      language: `${language}-IN`,
      partialResults: true,
    });
    
    if (result) {
      // Monitor for speech results
      const checkResults = setInterval(() => {
        const latestResult = EnhancedVoiceManager.getLastSpeechResult();
        if (latestResult) {
          setSpeechText(latestResult);
          onSpeechResult && onSpeechResult(latestResult);
        }
        
        if (!EnhancedVoiceManager.isListening) {
          clearInterval(checkResults);
          setIsListening(false);
        }
      }, 500);
    }
  };

  const stopListening = async () => {
    await EnhancedVoiceManager.stopListening();
    setIsListening(false);
  };

  const startWaveAnimation = () => {
    waveAnimationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    waveAnimationRef.current.start();
  };

  const stopWaveAnimation = () => {
    if (waveAnimationRef.current) {
      waveAnimationRef.current.stop();
    }
    animatedValue.setValue(0);
  };

  if (!showVisualIndicator && !allowUserControl) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Voice Status Indicator */}
      {(isPlaying || isListening) && (
        <View style={[
          styles.indicator,
          isListening && styles.listeningIndicator
        ]}>
          <Animated.View
            style={[
              styles.wave,
              {
                opacity: animatedValue,
                transform: [
                  {
                    scaleY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1.8],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={styles.indicatorText}>
            {isPlaying && (language === 'hi' 
              ? 'आवाज़ गाइड...' 
              : language === 'en' 
              ? 'Voice guide...'
              : 'आवाज गाइड...'
            )}
            {isListening && (language === 'hi' 
              ? 'सुन रहा है...' 
              : language === 'en' 
              ? 'Listening...'
              : 'ऐकत आहे...'
            )}
          </Text>
        </View>
      )}

      {/* Control Buttons */}
      {allowUserControl && (
        <View style={styles.controlsContainer}>
          {/* Play/Pause Button */}
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={isPlaying ? pauseVoice : isPaused ? resumeVoice : playVoice}
            activeOpacity={0.7}>
            <Icon 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={24} 
              color={colors.textLight} 
            />
          </TouchableOpacity>

          {/* Listen Button */}
          <TouchableOpacity
            style={[
              styles.controlButton, 
              styles.listenButton,
              isListening && styles.activeListenButton
            ]}
            onPress={isListening ? stopListening : startListening}
            activeOpacity={0.7}>
            <Icon 
              name={isListening ? 'mic-off' : 'mic'} 
              size={24} 
              color={colors.textLight} 
            />
          </TouchableOpacity>

          {/* Repeat Button */}
          <TouchableOpacity
            style={[styles.controlButton, styles.repeatButton]}
            onPress={playVoice}
            activeOpacity={0.7}>
            <Icon name="repeat" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      )}

      {/* Speech Recognition Result */}
      {speechText && isListening && (
        <View style={styles.speechContainer}>
          <Text style={styles.speechLabel}>
            {language === 'hi' ? 'आपने कहा:' : 'You said:'}
          </Text>
          <Text style={styles.speechText}>{speechText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 15,
  },
  
  listeningIndicator: {
    backgroundColor: colors.secondary,
  },
  
  wave: {
    width: 25,
    height: 25,
    backgroundColor: colors.textLight,
    borderRadius: 12.5,
    marginRight: 12,
  },
  
  indicatorText: {
    color: colors.textLight,
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
  },
  
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  playButton: {
    backgroundColor: colors.primary,
  },
  
  listenButton: {
    backgroundColor: colors.secondary,
  },
  
  activeListenButton: {
    backgroundColor: colors.error,
  },
  
  repeatButton: {
    backgroundColor: colors.info,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  
  speechContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    maxWidth: '90%',
  },
  
  speechLabel: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  
  speechText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
  },
});

export default EnhancedVoiceHelper;
