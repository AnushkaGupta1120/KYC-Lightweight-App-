import React, {useState} from 'react';
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

const LanguageScreen = ({navigation}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  const languages = [
    {
      code: 'hi',
      name: 'हिंदी',
      englishName: 'Hindi',
      voice: 'हिंदी भाषा चुनी गई। अब KYC विधि चुनने के लिए आगे बढ़ते हैं।',
      flag: '🇮🇳',
    },
    {
      code: 'en',
      name: 'English',
      englishName: 'English',
      voice: 'English language selected. Now proceeding to select KYC method.',
      flag: '🇬🇧',
    },
    {
      code: 'mr',
      name: 'मराठी',
      englishName: 'Marathi',
      voice: 'मराठी भाषा निवडली. आता KYC पद्धत निवडण्यासाठी पुढे जात आहे.',
      flag: '🇮🇳',
    },
  ];

  const selectLanguage = async (language) => {
    setSelectedLanguage(language.code);
    
    // Save selected language
    await AsyncStorage.setItem('selectedLanguage', language.code);
    await LanguageService.setLanguage(language.code);
    
    // Speak confirmation
    VoiceManager.speak(language.voice, language.code);
    
    // Navigate after voice completes
    setTimeout(() => {
      navigation.navigate('KYCMethod');
    }, 3000);
  };

  const handleHelp = () => {
    VoiceManager.speak(
      'कृपया अपनी पसंदीदा भाषा चुनें। यह ऐप आपको इसी भाषा में गाइड करेगा।',
      'hi'
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <HelpButton onPress={handleHelp} />
      
      <ProgressIndicator
        currentStep={1}
        totalSteps={5}
        stepTitles={['भाषा / Language', 'KYC विधि / Method', 'दस्तावेज़ / Documents', 'चेहरा / Face', 'सफल / Success']}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          अपनी भाषा चुनें{'\n'}
          Choose Your Language
        </Text>

        <Text style={styles.description}>
          यह ऐप आपको आपकी चुनी गई भाषा में गाइड करेगा{'\n'}
          The app will guide you in your selected language
        </Text>

        <VoiceHelper
          text="कृपया अपनी पसंदीदा भाषा चुनें"
          language="hi-IN"
          autoPlay={true}
        />

        <View style={styles.languagesContainer}>
          {languages.map((language) => (
            <LargeButton
              key={language.code}
              title={`${language.flag} ${language.name} (${language.englishName})`}
              onPress={() => selectLanguage(language)}
              variant={selectedLanguage === language.code ? 'primary' : 'outline'}
              style={[
                styles.languageButton,
                selectedLanguage === language.code && styles.selectedButton,
              ]}
              loading={selectedLanguage === language.code}
            />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 आप बाद में भी भाषा बदल सकते हैं{'\n'}
            You can change language later too
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
  
  languagesContainer: {
    marginVertical: 20,
  },
  
  languageButton: {
    marginVertical: 8,
  },
  
  selectedButton: {
    backgroundColor: colors.primary,
  },
  
  infoContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  
  infoText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LanguageScreen;
