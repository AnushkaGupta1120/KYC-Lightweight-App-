import AsyncStorage from '@react-native-async-storage/async-storage';

export class LanguageService {
  static currentLanguage = 'hi';
  
  static translations = {
    // Welcome Screen
    welcomeTitle: {
      hi: 'KYC डेमो में आपका स्वागत है',
      en: 'Welcome to KYC Demo',
      mr: 'KYC डेमोमध्ये तुमचे स्वागत आहे',
    },
    
    welcomeSubtitle: {
      hi: 'सिर्फ 5 मिनट में अपनी KYC पूरी करें',
      en: 'Complete your KYC in just 5 minutes',
      mr: 'फक्त 5 मिनिटांत तुमची KYC पूर्ण करा',
    },
    
    // Language Screen
    languageTitle: {
      hi: 'अपनी भाषा चुनें',
      en: 'Choose Your Language',
      mr: 'तुमची भाषा निवडा',
    },
    
    languageDescription: {
      hi: 'यह ऐप आपको आपकी चुनी गई भाषा में गाइड करेगा',
      en: 'The app will guide you in your selected language',
      mr: 'हे अॅप तुम्हाला तुमच्या निवडलेल्या भाषेत गाइड करेल',
    },
    
    // KYC Method Screen
    kycMethodTitle: {
      hi: 'KYC विधि चुनें',
      en: 'Choose KYC Method',
      mr: 'KYC पद्धत निवडा',
    },
    
    kycMethodDescription: {
      hi: 'अपनी सुविधा के अनुसार KYC विधि चुनें',
      en: 'Choose KYC method as per your convenience',
      mr: 'तुमच्या सोयीनुसार KYC पद्धत निवडा',
    },
    
    kycMethodVoice: {
      hi: 'DigiLocker तेज़ है लेकिन इंटरनेट चाहिए। फोटो अपलोड ऑफलाइन भी काम करता है।',
      en: 'DigiLocker is fast but needs internet. Photo upload works offline too.',
      mr: 'DigiLocker जलद आहे पण इंटरनेट हवे. फोटो अपलोड ऑफलाइन देखील कार्य करते.',
    },
    
    // Document Capture Screen
    documentCaptureTitle: {
      hi: 'दस्तावेज़ की फोटो लें',
      en: 'Take Document Photo',
      mr: 'कागदपत्राचे फोटो घ्या',
    },
    
    documentCaptureInstructions: {
      hi: 'कैमरे को दस्तावेज़ पर फोकस करें। साफ और धुंधला नहीं होना चाहिए।',
      en: 'Focus camera on document. Should be clear, not blurry.',
      mr: 'कॅमेरा कागदपत्रावर फोकस करा. स्पष्ट आणि धुसर नसावे.',
    },
    
    // Face Authentication Screen
    faceAuthTitle: {
      hi: 'चेहरे की पहचान',
      en: 'Face Verification',
      mr: 'चेहरा ओळख',
    },
    
    faceAuthInstructions: {
      hi: 'कैमरे को देखें और धीरे-धीरे पलक झपकाएं।',
      en: 'Look at the camera and blink slowly.',
      mr: 'कॅमेऱ्याकडे पहा आणि हळूहळू डोळे मिचका.',
    },
    
    // Success Screen
    successTitle: {
      hi: 'बधाई हो! KYC पूरी हुई',
      en: 'Congratulations! KYC Completed',
      mr: 'अभिनंदन! KYC पूर्ण झाली',
    },
    
    successMessage: {
      hi: 'आपकी KYC सफलतापूर्वक पूरी हो गई है।',
      en: 'Your KYC has been completed successfully.',
      mr: 'तुमची KYC यशस्वीपणे पूर्ण झाली आहे.',
    },
    
    // Common phrases
    next: {
      hi: 'आगे',
      en: 'Next',
      mr: 'पुढे',
    },
    
    back: {
      hi: 'पीछे',
      en: 'Back',
      mr: 'मागे',
    },
    
    help: {
      hi: 'मदद',
      en: 'Help',
      mr: 'मदत',
    },
    
    retry: {
      hi: 'दोबारा कोशिश करें',
      en: 'Try Again',
      mr: 'पुन्हा प्रयत्न करा',
    },
    
    loading: {
      hi: 'लोड हो रहा है...',
      en: 'Loading...',
      mr: 'लोड होत आहे...',
    },
  };

  static async setLanguage(languageCode) {
    try {
      this.currentLanguage = languageCode;
      await AsyncStorage.setItem('selectedLanguage', languageCode);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }

  static async getLanguage() {
    try {
      const saved = await AsyncStorage.getItem('selectedLanguage');
      if (saved) {
        this.currentLanguage = saved;
      }
      return this.currentLanguage;
    } catch (error) {
      console.error('Failed to load language:', error);
      return 'hi';
    }
  }

  static getText(key, language = null) {
    const lang = language || this.currentLanguage;
    const translation = this.translations[key];
    
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    
    return translation[lang] || translation.hi || key;
  }

  static getAllTexts(language = null) {
    const lang = language || this.currentLanguage;
    const result = {};
    
    Object.keys(this.translations).forEach(key => {
      result[key] = this.getText(key, lang);
    });
    
    return result;
  }
}
