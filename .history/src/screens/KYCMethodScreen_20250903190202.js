import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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

const KYCMethodScreen = ({navigation}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('hi');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const language = await AsyncStorage.getItem('selectedLanguage') || 'hi';
    setCurrentLanguage(language);
  };

  const methods = [
    {
      id: 'digilocker',
      title: {
        hi: 'DigiLocker से करें',
        en: 'Use DigiLocker',
        mr: 'DigiLocker वापरा',
      },
      description: {
        hi: 'सरकारी दस्तावेज़ ऑनलाइन से लें\n• तेज़ और आसान\n• कोई फोटो नहीं लेनी',
        en: 'Get government documents online\n• Fast and easy\n• No photos needed',
        mr: 'सरकारी कागदपत्रे ऑनलाइन घ्या\n• जलद आणि सोपे\n• फोटो घेण्याची गरज नाही',
      },
      icon: 'cloud-download',
      recommended: true,
    },
    {
      id: 'upload',
      title: {
        hi: 'फोटो खींचकर अपलोड करें',
        en: 'Take Photos & Upload',
        mr: 'फोटो काढा आणि अपलोड करा',
      },
      description: {
        hi: 'अपने दस्तावेज़ों की फोटो लें\n• ऑफलाइन भी काम करता है\n• सभी फोन में चलता है',
        en: 'Take photos of your documents\n• Works offline too\n• Works on all phones',
        mr: 'तुमच्या कागदपत्रांचे फोटो घ्या\n• ऑफलाइन देखील कार्य करते\n• सर्व फोनवर चालते',
      },
      icon: 'camera-alt',
      recommended: false,
    },
  ];

  const selectMethod = async (method) => {
    setSelectedMethod(method.id);
    
    // Save selected method
    await AsyncStorage.setItem('kycMethod', method.id);
    
    // Voice feedback
    const feedback = {
      hi: method.id === 'digilocker' 
        ? 'DigiLocker चुना गया। अब DigiLocker से जुड़ रहे हैं।'
        : 'फोटो अपलोड विधि चुनी गई। अब दस्तावेज़ की फोटो लेंगे।',
      en: method.id === 'digilocker'
        ? 'DigiLocker selected. Now connecting to DigiLocker.'
        : 'Photo upload method selected. Now we will take document photos.',
      mr: method.id === 'digilocker'
        ? 'DigiLocker निवडले. आता DigiLocker शी जोडत आहे.'
        : 'फोटो अपलोड पद्धत निवडली. आता कागदपत्रांचे फोटो घेऊ.',
    };
    
    VoiceManager.speak(feedback[currentLanguage], currentLanguage);
    
    // Navigate based on method
    setTimeout(() => {
      if (method.id === 'digilocker') {
        navigation.navigate('DigiLocker');
      } else {
        navigation.navigate('DocumentCapture');
      }
    }, 3000);
  };

  const handleHelp = () => {
    const helpText = {
      hi: 'DigiLocker तेज़ है लेकिन इंटरनेट चाहिए। फोटो अपलोड ऑफलाइन भी काम करता है।',
      en: 'DigiLocker is fast but needs internet. Photo upload works offline too.',
      mr: 'DigiLocker जलद आहे पण इंटरनेट हवे. फोटो अपलोड ऑफलाइन देखील कार्य करते.',
    };
    
    VoiceManager.speak(helpText[currentLanguage], currentLanguage);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <HelpButton onPress={handleHelp} />
      
      <ProgressIndicator
        currentStep={2}
        totalSteps={5}
        stepTitles={['भाषा / Language', 'KYC विधि / Method', 'दस्तावेज़ / Documents', 'चेहरा / Face', 'सफल / Success']}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {LanguageService.getText('kycMethodTitle', currentLanguage)}
        </Text>

        <Text style={styles.description}>
          {LanguageService.getText('kycMethodDescription', currentLanguage)}
        </Text>

        <VoiceHelper
          text={LanguageService.getText('kycMethodVoice', currentLanguage)}
          language={`${currentLanguage}-IN`}
          autoPlay={true}
        />

        <View style={styles.methodsContainer}>
          {methods.map((method) => (
            <View key={method.id} style={styles.methodCard}>
              {method.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>
                    {currentLanguage === 'hi' ? 'सुझाव' : currentLanguage === 'en' ? 'Recommended' : 'शिफारस'}
                  </Text>
                </View>
              )}
              
              <LargeButton
                title={method.title[currentLanguage]}
                icon={method.icon}
                onPress={() => selectMethod(method)}
                variant={selectedMethod === method.id ? 'primary' : 'outline'}
                loading={selectedMethod === method.id}
                style={[
                  styles.methodButton,
                  method.recommended && styles.recommendedButton,
                ]}
              />
              
              <Text style={styles.methodDescription}>
                {method.description[currentLanguage]}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {currentLanguage === 'hi' 
              ? '🔒 आपकी सभी जानकारी सुरक्षित रहेगी'
              : currentLanguage === 'en'
              ? '🔒 All your information will be kept secure'
              : '🔒 तुमची सर्व माहिती सुरक्षित राहील'
            }
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: typography.fontSize.title,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: typography.lineHeight.title,
  },
  
  description: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: typography.lineHeight.medium,
  },
  
  methodsContainer: {
    marginVertical: 20,
  },
  
  methodCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  
  recommendedText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.bold,
    color: colors.textLight,
  },
  
  methodButton: {
    marginBottom: 15,
  },
  
  recommendedButton: {
    borderColor: colors.secondary,
  },
  
  methodDescription: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.small,
  },
  
  infoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  
  infoText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default KYCMethodScreen;
