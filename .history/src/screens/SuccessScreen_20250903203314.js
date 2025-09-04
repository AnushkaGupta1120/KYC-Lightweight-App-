import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LargeButton from '../components/LargeButton';
import VoiceHelper from '../components/VoiceHelper';
import {commonStyles} from '../styles/commonStyles';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {VoiceManager} from '../services/VoiceManager';

const SuccessScreen = ({navigation}) => {
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [kycData, setKYCData] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
    startAnimations();
  }, []);

  const loadData = async () => {
    const language = await AsyncStorage.getItem('selectedLanguage') || 'hi';
    setCurrentLanguage(language);
    
    // Load KYC completion data
    const method = await AsyncStorage.getItem('kycMethod');
    const documents = await AsyncStorage.getItem('kycDocuments');
    const faceAuth = await AsyncStorage.getItem('faceAuthData');
    
    setKYCData({
      method,
      documents: documents ? JSON.parse(documents) : null,
      faceAuth: faceAuth ? JSON.parse(faceAuth) : null,
    });
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFinish = async () => {
    VoiceManager.speak(
      currentLanguage === 'hi'
        ? 'धन्यवाद! आप अब सभी सेवाओं का उपयोग कर सकते हैं।'
        : 'Thank you! You can now use all services.',
      currentLanguage
    );

    // In a real app, navigate to main app or close
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      });
    }, 3000);
  };

  const getCompletionSummary = () => {
    if (!kycData) return null;

    return {
      documentsVerified: kycData.documents ? 2 : 0,
      faceAuthCompleted: !!kycData.faceAuth,
      method: kycData.method === 'digilocker' ? 'DigiLocker' : 'Photo Upload',
      completionTime: '4 मिनट 32 सेकंड',
    };
  };

  const summary = getCompletionSummary();

  return (
    <SafeAreaView style={commonStyles.centerContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          
          {/* Success Icon */}
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✅</Text>
          </View>

          {/* Success Message */}
          <Text style={styles.title}>
            {currentLanguage === 'hi' 
              ? 'बधाई हो! KYC पूरी हुई'
              : currentLanguage === 'en'
              ? 'Congratulations! KYC Completed'
              : 'अभिनंदन! KYC पूर्ण झाली'
            }
          </Text>

          <Text style={styles.subtitle}>
            {currentLanguage === 'hi'
              ? 'आपकी पहचान सफलतापूर्वक सत्यापित हो गई है'
              : currentLanguage === 'en'
              ? 'Your identity has been successfully verified'
              : 'तुमची ओळख यशस्वीपणे सत्यापित झाली आहे'
            }
          </Text>

          <VoiceHelper
            text={
              currentLanguage === 'hi'
                ? 'बधाई हो! आपकी KYC सफलतापूर्वक पूरी हो गई है। आप अब सभी सेवाओं का उपयोग कर सकते हैं।'
                : currentLanguage === 'en'
                ? 'Congratulations! Your KYC has been completed successfully. You can now use all services.'
                : 'अभिनंदन! तुमची KYC यशस्वीपणे पूर्ण झाली आहे. तुम्ही आता सर्व सेवांचा वापर करू शकता.'
            }
            language={`${currentLanguage}-IN`}
            autoPlay={true}
          />

          {/* Summary Card */}
          {summary && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>
                {currentLanguage === 'hi' ? 'KYC सारांश:' : 'KYC Summary:'}
              </Text>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>📄</Text>
                <Text style={styles.summaryText}>
                  {currentLanguage === 'hi' 
                    ? `${summary.documentsVerified} दस्तावेज़ सत्यापित`
                    : `${summary.documentsVerified} documents verified`
                  }
                </Text>
                <Text style={styles.summaryCheck}>✅</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>👤</Text>
                <Text style={styles.summaryText}>
                  {currentLanguage === 'hi' 
                    ? 'चेहरे की पहचान पूर्ण'
                    : 'Face verification complete'
                  }
                </Text>
                <Text style={styles.summaryCheck}>✅</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>⚡</Text>
                <Text style={styles.summaryText}>
                  {currentLanguage === 'hi' 
                    ? `${summary.method} द्वारा`
                    : `Via ${summary.method}`
                  }
                </Text>
                <Text style={styles.summaryCheck}>✅</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>⏱️</Text>
                <Text style={styles.summaryText}>
                  {currentLanguage === 'hi' 
                    ? `समय: ${summary.completionTime}`
                    : `Time: ${summary.completionTime}`
                  }
                </Text>
                <Text style={styles.summaryCheck}>✅</Text>
              </View>
            </View>
          )}

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>
              {currentLanguage === 'hi' 
                ? 'अब आप कर सकते हैं:'
                : 'Now you can:'
              }
            </Text>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🏦</Text>
              <Text style={styles.benefitText}>
                {currentLanguage === 'hi' 
                  ? 'बैंक खाता खोलें'  
                  : 'Open bank account'
                }
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>💳</Text>
              <Text style={styles.benefitText}>
                {currentLanguage === 'hi'
                  ? 'डिजिटल पेमेंट करें'
                  : 'Make digital payments'
                }
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📱</Text>
              <Text style={styles.benefitText}>
                {currentLanguage === 'hi'
                  ? 'ऑनलाइन सेवाएं लें'
                  : 'Access online services'
                }
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🛡️</Text>
              <Text style={styles.benefitText}>
                {currentLanguage === 'hi'
                  ? 'सुरक्षित लेनदेन करें'
                  : 'Make secure transactions'
                }
              </Text>
            </View>
          </View>

          {/* Finish Button */}
          <LargeButton
            title={
              currentLanguage === 'hi' 
                ? 'पूर्ण करें'
                : 'Finish'
            }
            icon="check-circle"
            onPress={handleFinish}
            style={styles.finishButton}
          />

          {/* Footer */}
          <Text style={styles.footerText}>
            {currentLanguage === 'hi'
              ? '🎉 डिजिटल इंडिया में आपका स्वागत है\n🔒 आपका डेटा पूर्णतः सुरक्षित है'
              : '🎉 Welcome to Digital India\n🔒 Your data is completely secure'
            }
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  
  content: {
    alignItems: 'center',
    width: '100%',
  },
  
  successIcon: {
    marginBottom: 30,
  },
  
  checkmark: {
    fontSize: 80,
  },
  
  title: {
    fontSize: typography.fontSize.heading,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: typography.lineHeight.heading,
  },
  
  subtitle: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: typography.lineHeight.large,
  },
  
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  summaryTitle: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  summaryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  
  summaryText: {
    flex: 1,
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
  },
  
  summaryCheck: {
    fontSize: 16,
  },
  
  benefitsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  
  benefitsTitle: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  benefitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  
  benefitText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
  },
  
  finishButton: {
    marginTop: 30,
    marginBottom: 20,
    width: '100%',
  },
  
  footerText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.small,
  },
});

export default SuccessScreen;
