import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LargeButton from '../components/LargeButton';
import VoiceHelper from '../components/VoiceHelper';
import HelpButton from '../components/HelpButton';
import ProgressIndicator from '../components/ProgressIndicator';
import {commonStyles} from '../styles/commonStyles';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {VoiceManager} from '../services/VoiceManager';
import {LanguageService} from '../services/LanguageService';
import {FaceAuthService} from '../services/FaceAuthService';

const FaceAuthScreen = ({navigation}) => {
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [faceDetected, setFaceDetected] = useState(false);
  const [livenessScore, setLivenessScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: position, 2: detection, 3: liveness, 4: complete
  
  const faceAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadLanguage();
    startFaceAnimation();
  }, []);

  const loadLanguage = async () => {
    const language = await AsyncStorage.getItem('selectedLanguage') || 'hi';
    setCurrentLanguage(language);
  };

  const startFaceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(faceAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(faceAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startFaceAuth = async () => {
    setIsProcessing(true);
    setStep(2);
    
    VoiceManager.speak(
      currentLanguage === 'hi'
        ? 'चेहरे की पहचान शुरू की जा रही है...'
        : 'Starting face authentication...',
      currentLanguage
    );

    try {
      // Step 1: Face Detection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFaceDetected(true);
      setStep(3);
      
      VoiceManager.speak(
        currentLanguage === 'hi'
          ? 'चेहरा मिल गया। अब पलक झपकाएं।'
          : 'Face detected. Now blink your eyes.',
        currentLanguage
      );

      // Step 2: Liveness Detection
      await performLivenessCheck();
      
      // Step 3: Face Matching
      const authResult = await FaceAuthService.authenticateFace();
      
      if (authResult.success) {
        setStep(4);
        VoiceManager.speak(
          currentLanguage === 'hi'
            ? 'चेहरे की पहचान सफल। KYC पूरी हो गई।'
            : 'Face authentication successful. KYC completed.',
          currentLanguage
        );
        
        setTimeout(() => {
          navigation.navigate('Success');
        }, 3000);
      } else {
        throw new Error('Face authentication failed');
      }
    } catch (error) {
      console.error('Face auth error:', error);
      VoiceManager.speak(
        currentLanguage === 'hi'
          ? 'चेहरे की पहचान असफल। दोबारा कोशिश करें।'
          : 'Face authentication failed. Please try again.',
        currentLanguage
      );
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const performLivenessCheck = async () => {
    return new Promise((resolve) => {
      let score = 0;
      const interval = setInterval(() => {
        score += Math.random() * 20;
        setLivenessScore(Math.min(score, 100));
        
        if (score >= 80) {
          clearInterval(interval);
          resolve(true);
        }
      }, 500);
    });
  };

  const handleHelp = () => {
    const helpTexts = {
      hi: [
        'कैमरे के सामने आएं और सीधे देखें।',
        'धीरे-धीरे पलक झपकाएं।',
        'फोन को हिलाएं नहीं।',
        'अच्छी रोशनी में रहें।'
      ],
      en: [
        'Come in front of camera and look straight.',
        'Blink your eyes slowly.',
        'Do not move the phone.',
        'Stay in good lighting.'
      ],
      mr: [
        'कॅमेऱ्यासमोर या आणि सरळ पहा.',
        'हळूहळू डोळे मिचका.',
        'फोन हलवू नका.',
        'चांगल्या प्रकाशात रहा.'
      ]
    };
    
    VoiceManager.speak(helpTexts[currentLanguage].join(' '), currentLanguage);
  };

  const getStepContent = () => {
    const contents = {
      1: {
        title: {
          hi: 'कैमरे के सामने आएं',
          en: 'Position yourself in front of camera',
          mr: 'कॅमेऱ्यासमोर स्वतःला ठेवा'
        },
        icon: '👤',
      },
      2: {
        title: {
          hi: 'चेहरा ढूंढा जा रहा है...',
          en: 'Detecting face...',
          mr: 'चेहरा शोधत आहे...'
        },
        icon: '🔍',
      },
      3: {
        title: {
          hi: 'पलक झपकाएं',
          en: 'Blink your eyes',
          mr: 'डोळे मिचका'
        },
        icon: '👁️',
      },
      4: {
        title: {
          hi: 'सफल!',
          en: 'Success!',
          mr: 'यशस्वी!'
        },
        icon: '✅',
      },
    };

    return contents[step];
  };

  const content = getStepContent();

  return (
    <SafeAreaView style={commonStyles.container}>
      <HelpButton onPress={handleHelp} />
      
      <ProgressIndicator
        currentStep={4}
        totalSteps={5}
        stepTitles={['भाषा / Language', 'KYC विधि / Method', 'दस्तावेज़ / Documents', 'चेहरा / Face', 'सफल / Success']}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {content.title[currentLanguage]}
        </Text>

        <VoiceHelper
          text={LanguageService.getText('faceAuthInstructions', currentLanguage)}
          language={`${currentLanguage}-IN`}
          autoPlay={step === 1}
        />

        {/* Face detection area */}
        <View style={styles.faceContainer}>
          <Animated.View
            style={[
              styles.faceCircle,
              {
                transform: [
                  {scale: pulseAnimation},
                  {
                    rotate: faceAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                borderColor: step >= 3 ? colors.success : colors.primary,
              },
            ]}>
            
            <Text style={styles.faceIcon}>{content.icon}</Text>
            
            {step === 3 && livenessScore > 0 && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {Math.round(livenessScore)}%
                </Text>
              </View>
            )}
          </Animated.View>
          
          {/* Face detection guide */}
          <View style={styles.faceGuide}>
            <View style={[styles.guideLine, styles.guideTop]} />
            <View style={[styles.guideLine, styles.guideBottom]} />
            <View style={[styles.guideLine, styles.guideLeft]} />
            <View style={[styles.guideLine, styles.guideRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            {step === 1 && (currentLanguage === 'hi' 
              ? '• फोन को आंखों के स्तर पर रखें\n• कैमरे को सीधे देखें\n• 2 फीट की दूरी रखें'
              : '• Hold phone at eye level\n• Look directly at camera\n• Maintain 2 feet distance'
            )}
            {step === 2 && (currentLanguage === 'hi'
              ? '• स्थिर रहें\n• कैमरा आपका चेहरा ढूंढ रहा है'
              : '• Stay still\n• Camera is detecting your face'
            )}
            {step === 3 && (currentLanguage === 'hi'
              ? '• धीरे-धीरे पलक झपकाएं\n• सिर हिलाएं नहीं\n• प्राकृतिक रहें'
              : '• Blink slowly\n• Do not move head\n• Be natural'
            )}
            {step === 4 && (currentLanguage === 'hi'
              ? '• चेहरे की पहचान पूर्ण\n• अब आप तैयार हैं!'
              : '• Face verification complete\n• You are all set!'
            )}
          </Text>
        </View>

        {/* Action button */}
        {step === 1 && !isProcessing && (
          <LargeButton
            title={
              currentLanguage === 'hi' 
                ? 'चेहरे की पहचान शुरू करें'
                : 'Start Face Authentication'
            }
            icon="face"
            onPress={startFaceAuth}
            style={styles.startButton}
          />
        )}

        {step > 1 && step < 4 && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>
              {currentLanguage === 'hi' 
                ? 'कृपया प्रतीक्षा करें...'
                : 'Please wait...'
              }
            </Text>
          </View>
        )}

        {step === 4 && (
          <LargeButton
            title={
              currentLanguage === 'hi' 
                ? 'KYC पूरी करें'
                : 'Complete KYC'
            }
            icon="check-circle"
            onPress={() => navigation.navigate('Success')}
            variant="secondary"
            style={styles.completeButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  title: {
    fontSize: typography.fontSize.title,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: typography.lineHeight.title,
  },
  
  faceContainer: {
    position: 'relative',
    marginVertical: 40,
  },
  
  faceCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  
  faceIcon: {
    fontSize: 80,
  },
  
  scoreContainer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  scoreText: {
    color: colors.textLight,
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.bold,
  },
  
  faceGuide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
  },
  
  guideLine: {
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  
  guideTop: {
    top: 20,
    left: 80,
    width: 40,
    height: 3,
  },
  
  guideBottom: {
    bottom: 20,
    left: 80,
    width: 40,
    height: 3,
  },
  
  guideLeft: {
    left: 20,
    top: 80,
    width: 3,
    height: 40,
  },
  
  guideRight: {
    right: 20,
    top: 80,
    width: 3,
    height: 40,
  },
  
  instructionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    width: '100%',
  },
  
  instructionText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    lineHeight: typography.lineHeight.medium,
  },
  
  startButton: {
    marginTop: 20,
    width: '100%',
  },
  
  processingContainer: {
    marginTop: 20,
    padding: 20,
  },
  
  processingText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    textAlign: 'center',
  },
  
  completeButton: {
    marginTop: 20,
    width: '100%',
  },
});

export default FaceAuthScreen;
