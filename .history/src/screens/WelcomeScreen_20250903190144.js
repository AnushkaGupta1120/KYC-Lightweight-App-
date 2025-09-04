import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import LargeButton from '../components/LargeButton';
import VoiceHelper from '../components/VoiceHelper';
import HelpButton from '../components/HelpButton';
import {commonStyles} from '../styles/commonStyles';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {VoiceManager} from '../services/VoiceManager';

const WelcomeScreen = ({navigation}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const welcomeText = 'नमस्ते! मैं आपकी KYC प्रक्रिया में मदद करूंगा। यह बहुत आसान है।';

  useEffect(() => {
    startAnimations();
    // Auto-navigate after voice completes (for demo)
    const timer = setTimeout(() => {
      // navigation.navigate('Language');
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStart = () => {
    VoiceManager.speak('भाषा चुनने के लिए आगे बढ़ रहे हैं', 'hi');
    navigation.navigate('Language');
  };

  const handleHelp = () => {
    VoiceManager.speak(
      'यह KYC ऐप है। आपको अपने दस्तावेजों की फोटो लेनी होगी और चेहरे की पहचान करानी होगी। यह सभी ऑफलाइन भी काम करता है।',
      'hi'
    );
  };

  return (
    <SafeAreaView style={commonStyles.centerContainer}>
      <HelpButton onPress={handleHelp} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        
        {/* App Icon/Logo */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Text style={styles.iconText}>KYC</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>
          KYC डेमो में आपका स्वागत है
        </Text>
        
        <Text style={styles.subtitle}>
          Welcome to KYC Demo
        </Text>

        <Text style={styles.description}>
          सिर्फ 5 मिनट में अपनी KYC पूरी करें{'\n'}
          Complete your KYC in just 5 minutes
        </Text>

        {/* Voice Helper */}
        <VoiceHelper
          text={welcomeText}
          language="hi-IN"
          autoPlay={true}
          showVisualIndicator={true}
        />

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎤</Text>
            <Text style={styles.featureText}>आवाज़ गाइड / Voice Guide</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>ऑफलाइन काम / Works Offline</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>सुरक्षित / Secure</Text>
          </View>
        </View>

        {/* Start Button */}
        <LargeButton
          title="शुरू करें / Start"
          icon="play-arrow"
          onPress={handleStart}
          style={styles.startButton}
        />

        <Text style={styles.footerText}>
          📞 मदद के लिए हेल्प बटन दबाएं{'\n'}
          Tap help button for assistance
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    width: '100%',
  },
  
  iconContainer: {
    marginBottom: 30,
  },
  
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  iconText: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.textLight,
  },
  
  title: {
    fontSize: typography.fontSize.title,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: typography.lineHeight.title,
  },
  
  subtitle: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  description: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: typography.lineHeight.medium,
  },
  
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 30,
  },
  
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  
  featureIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  
  featureText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
    textAlign: 'center',
  },
  
  startButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  
  footerText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WelcomeScreen;
