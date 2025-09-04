import {VoiceManager} from './VoiceManager';

export class AIAssistant {
  static responses = {
    greeting: {
      hi: 'नमस्ते! मैं आपकी KYC में मदद करूंगा। क्या समस्या है?',
      en: 'Hello! I will help with your KYC. What is the problem?',
      mr: 'नमस्कार! मी तुमच्या KYC मध्ये मदत करेन. काय समस्या आहे?',
    },
    
    documentHelp: {
      hi: 'दस्तावेज़ साफ होना चाहिए। अच्छी रोशनी में फोटो लें। धुंधला न हो।',
      en: 'Document should be clear. Take photo in good light. Should not be blurry.',
      mr: 'कागदपत्र स्पष्ट असावे. चांगल्या प्रकाशात फोटो घ्या. धुसर नसावे.',
    },
    
    faceHelp: {
      hi: 'कैमरे को सीधे देखें और धीरे-धीरे पलक झपकाएं। फोन हिलाएं नहीं।',
      en: 'Look directly at camera and blink slowly. Do not move the phone.',
      mr: 'कॅमेऱ्याकडे थेट पहा आणि हळूहळू डोळे मिचका. फोन हलवू नका.',
    },
    
    digilockerHelp: {
      hi: 'मोबाइल से जुड़ा आधार नंबर डालें। OTP उसी नंबर पर आएगा।',
      en: 'Enter mobile-linked Aadhaar number. OTP will come on that number.',
      mr: 'मोबाइलशी जोडलेला आधार नंबर टाका. OTP त्याच नंबरवर येईल.',
    },
    
    offlineHelp: {
      hi: 'इंटरनेट नहीं है कोई बात नहीं। आप ऑफलाइन भी KYC कर सकते हैं। बाद में अपलोड हो जाएगा।',
      en: 'No internet, no problem. You can do KYC offline. Will upload later.',
      mr: 'इंटरनेट नाही, काही हरकत नाही. तुम्ही ऑफलाइन KYC करू शकता. नंतर अपलोड होईल.',
    },
    
    languageHelp: {
      hi: 'आप कोई भी भाषा चुन सकते हैं। बाद में भी बदल सकते हैं।',
      en: 'You can choose any language. Can change later too.',
      mr: 'तुम्ही कोणतीही भाषा निवडू शकता. नंतर देखील बदलू शकता.',
    },
    
    errorHelp: {
      hi: 'कुछ गलत हुआ है। चिंता न करें, दोबारा कोशिश करें। आपका डेटा सुरक्षित है।',
      en: 'Something went wrong. Do not worry, try again. Your data is safe.',
      mr: 'काहीतरी चूक झाली आहे. चिंता करू नका, पुन्हा प्रयत्न करा. तुमचा डेटा सुरक्षित आहे.',
    },
  };

  static contextKeywords = {
    document: ['document', 'photo', 'picture', 'दस्तावेज़', 'फोटो', 'कागदपत्र'],
    face: ['face', 'camera', 'selfie', 'चेहरा', 'कैमरा', 'चेहरा'],
    digilocker: ['digilocker', 'aadhaar', 'otp', 'आधार'],
    offline: ['offline', 'internet', 'network', 'ऑफलाइन', 'इंटरनेट'],
    language: ['language', 'भाषा', 'hindi', 'english', 'marathi'],
    error: ['error', 'problem', 'issue', 'गलत', 'समस्या', 'त्रुटि'],
  };

  static async getContextualHelp(screen, userInput = '', language = 'hi') {
    // Determine context from screen name
    let context = 'greeting';
    
    if (screen.includes('Document')) {
      context = 'documentHelp';
    } else if (screen.includes('Face')) {
      context = 'faceHelp';
    } else if (screen.includes('DigiLocker')) {
      context = 'digilockerHelp';
    } else if (screen.includes('Language')) {
      context = 'languageHelp';
    }

    // Override context based on user input keywords
    if (userInput) {
      const input = userInput.toLowerCase();
      
      for (const [key, keywords] of Object.entries(this.contextKeywords)) {
        if (keywords.some(keyword => input.includes(keyword.toLowerCase()))) {
          context = key + 'Help';
          break;
        }
      }
    }

    const response = this.responses[context] || this.responses.greeting;
    return response[language] || response.hi;
  }

  static async speakHelp(screen, userInput = '', language = 'hi') {
    const helpText = await this.getContextualHelp(screen, userInput, language);
    VoiceManager.speak(helpText, language);
    return helpText;
  }

  static getQuickResponses(screen, language = 'hi') {
    const quickResponses = {
      Welcome: {
        hi: ['KYC क्या है?', 'कितना समय लगेगा?', 'क्या सुरक्षित है?'],
        en: ['What is KYC?', 'How long will it take?', 'Is it secure?'],
        mr: ['KYC म्हणजे काय?', 'किती वेळ लागेल?', 'सुरक्षित आहे का?'],
      },
      
      Language: {
        hi: ['भाषा कैसे बदलें?', 'कौन सी भाषा बेहतर?', 'बाद में बदल सकते हैं?'],
        en: ['How to change language?', 'Which language is better?', 'Can change later?'],
        mr: ['भाषा कशी बदलावी?', 'कोणती भाषा चांगली?', 'नंतर बदलू शकतो का?'],
      },
      
      DocumentCapture: {
        hi: ['फोटो कैसे लें?', 'धुंधली क्यों है?', 'दोबारा कैसे लें?'],
        en: ['How to take photo?', 'Why is it blurry?', 'How to retake?'],
        mr: ['फोटो कसा घ्यावा?', 'धुसर का आहे?', 'पुन्हा कसा घ्यावा?'],
      },
      
      FaceAuth: {
        hi: ['चेहरा नहीं दिख रहा', 'पलक कैसे झपकाएं?', 'कैमरा काम नहीं कर रहा'],
        en: ['Face not showing', 'How to blink?', 'Camera not working'],
        mr: ['चेहरा दिसत नाही', 'डोळे कसे मिचकावे?', 'कॅमेरा कार्य करत नाही'],
      },
    };

    return quickResponses[screen]?.[language] || [];
  }

  static async handleQuickResponse(response, screen, language = 'hi') {
    // Handle predefined quick responses
    const responses = {
      'KYC क्या है?': {
        hi: 'KYC यानी नो योर कस्टमर। यह पहचान की जांच है। बैंक और वित्तीय सेवाओं के लिए जरूरी है।',
        en: 'KYC means Know Your Customer. It is identity verification. Required for banking and financial services.',
        mr: 'KYC म्हणजे नो युअर कस्टमर. ही ओळख तपासणी आहे. बँकिंग आणि वित्तीय सेवांसाठी आवश्यक आहे.',
      },
      
      'कितना समय लगेगा?': {
        hi: 'सिर्फ 5 मिनट लगेंगे। आवाज़ गाइड आपकी मदद करेगा।',
        en: 'Just 5 minutes needed. Voice guide will help you.',
        mr: 'फक्त 5 मिनिटे लागतील. आवाज गाइड तुमची मदत करेल.',
      },
      
      'फोटो कैसे लें?': {
        hi: 'कैमरा बटन दबाएं। दस्तावेज़ को अच्छी रोशनी में रखें। साफ होना चाहिए।',
        en: 'Press camera button. Keep document in good light. Should be clear.',
        mr: 'कॅमेरा बटण दाबा. कागदपत्राला चांगल्या प्रकाशात ठेवा. स्पष्ट असावे.',
      },
    };

    const responseText = responses[response]?.[language];
    if (responseText) {
      VoiceManager.speak(responseText, language);
      return responseText;
    }

    // Fallback to contextual help
    return this.speakHelp(screen, response, language);
  }

  static generateSmartSuggestions(screen, userProgress, language = 'hi') {
    // Generate smart suggestions based on user progress
    const suggestions = {
      hi: [],
      en: [],
      mr: [],
    };

    if (userProgress.documentsCompleted < 2) {
      suggestions.hi.push('दस्तावेज़ की फोटो अभी भी लेनी है');
      suggestions.en.push('Still need to take document photos');
      suggestions.mr.push('अजूनही कागदपत्रांचे फोटो घ्यावे लागतील');
    }

    if (!userProgress.faceAuthCompleted) {
      suggestions.hi.push('चेहरे की पहचान बाकी है');
      suggestions.en.push('Face verification is pending');
      suggestions.mr.push('चेहरा ओळख बाकी आहे');
    }

    if (userProgress.isOffline) {
      suggestions.hi.push('ऑफलाइन मोड में काम कर रहे हैं');
      suggestions.en.push('Working in offline mode');
      suggestions.mr.push('ऑफलाइन मोडमध्ये कार्य करत आहात');
    }

    return suggestions[language] || suggestions.hi;
  }
}
