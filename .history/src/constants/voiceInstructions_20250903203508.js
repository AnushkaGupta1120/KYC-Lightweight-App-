export const voiceInstructions = {
  welcome: {
    hi: 'नमस्ते! मैं आपकी KYC प्रक्रिया में मदद करूंगा। यह बहुत आसान है और सिर्फ 5 मिनट लगेंगे।',
    en: 'Hello! I will help you with your KYC process. It is very easy and will take just 5 minutes.',
    mr: 'नमस्कार! मी तुमच्या KYC प्रक्रियेत मदत करेन. हे खूप सोपे आहे आणि फक्त 5 मिनिटे लागतील.',
  },
  
  languageSelection: {
    hi: 'कृपया अपनी पसंदीदा भाषा चुनें। यह ऐप आपको इसी भाषा में गाइड करेगा।',
    en: 'Please choose your preferred language. This app will guide you in this language.',
    mr: 'कृपया तुमची आवडती भाषा निवडा. हे अॅप तुम्हाला या भाषेत गाइड करेल.',
  },
  
  kycMethodSelection: {
    hi: 'अब KYC विधि चुनें। DigiLocker तेज़ है लेकिन इंटरनेट चाहिए। फोटो अपलोड ऑफलाइन भी काम करता है।',
    en: 'Now choose KYC method. DigiLocker is fast but needs internet. Photo upload works offline too.',
    mr: 'आता KYC पद्धत निवडा. DigiLocker जलद आहे पण इंटरनेट हवे. फोटो अपलोड ऑफलाइन देखील कार्य करते.',
  },
  
  documentCapture: {
    hi: 'अब अपने दस्तावेज़ की फोटो लें। कैमरे को दस्तावेज़ पर फोकस करें। साफ और धुंधला नहीं होना चाहिए।',
    en: 'Now take photo of your document. Focus camera on document. Should be clear, not blurry.',
    mr: 'आता तुमच्या कागदपत्राचे फोटो घ्या. कॅमेरा कागदपत्रावर फोकस करा. स्पष्ट आणि धुसर नसावे.',
  },
  
  faceAuthentication: {
    hi: 'अब चेहरे की पहचान करेंगे। कैमरे को सीधे देखें और धीरे-धीरे पलक झपकाएं।',
    en: 'Now we will do face verification. Look directly at camera and blink slowly.',
    mr: 'आता आम्ही चेहरा ओळख करू. कॅमेऱ्याकडे थेट पहा आणि हळूहळू डोळे मिचका.',
  },
  
  success: {
    hi: 'बधाई हो! आपकी KYC सफलतापूर्वक पूरी हो गई है। आप अब सभी सेवाओं का उपयोग कर सकते हैं।',
    en: 'Congratulations! Your KYC has been completed successfully. You can now use all services.',
    mr: 'अभिनंदन! तुमची KYC यशस्वीपणे पूर्ण झाली आहे. तुम्ही आता सर्व सेवांचा वापर करू शकता.',
  },
  
  // Error messages
  errors: {
    cameraPermission: {
      hi: 'कैमरा अनुमति की जरूरत है। सेटिंग्स में जाकर अनुमति दें।',
      en: 'Camera permission is needed. Please grant permission in settings.',
      mr: 'कॅमेरा परवानगी हवी. सेटिंग्जमध्ये जाऊन परवानगी द्या.',
    },
    
    networkError: {
      hi: 'इंटरनेट कनेक्शन नहीं है। ऑफलाइन मोड में जारी रखें या इंटरनेट कनेक्ट करें।',
      en: 'No internet connection. Continue in offline mode or connect to internet.',
      mr: 'इंटरनेट कनेक्शन नाही. ऑफलाइन मोडमध्ये सुरू ठेवा किंवा इंटरनेट कनेक्ट करा.',
    },
    
    documentBlurry: {
      hi: 'दस्तावेज़ धुंधला है। अच्छी रोशनी में साफ फोटो लें।',
      en: 'Document is blurry. Take clear photo in good lighting.',
      mr: 'कागदपत्र धुसर आहे. चांगल्या प्रकाशात स्पष्ट फोटो घ्या.',
    },
    
    faceNotDetected: {
      hi: 'चेहरा नहीं दिख रहा। कैमरे के सामने आएं और दोबारा कोशिश करें।',
      en: 'Face not detected. Come in front of camera and try again.',
      mr: 'चेहरा दिसत नाही. कॅमेऱ्यासमोर या आणि पुन्हा प्रयत्न करा.',
    },
  },
  
  // Help messages
  help: {
    general: {
      hi: 'यह KYC ऐप है। आपको अपने दस्तावेजों की फोटो लेनी होगी और चेहरे की पहचान करानी होगी। यह सभी ऑफलाइन भी काम करता है।',
      en: 'This is KYC app. You need to take photos of documents and do face verification. All works offline too.',
      mr: 'हे KYC अॅप आहे. तुम्हाला कागदपत्रांचे फोटो घ्यावे लागतील आणि चेहरा ओळख करावी लागेल. हे सर्व ऑफलाइन देखील कार्य करते.',
    },
    
    navigation: {
      hi: 'आगे बढ़ने के लिए हरे बटन दबाएं। पीछे जाने के लिए वापस बटन दबाएं।',
      en: 'Press green button to go forward. Press back button to go back.',
      mr: 'पुढे जाण्यासाठी हिरवे बटण दाबा. मागे जाण्यासाठी बॅक बटण दाबा.',
    },
    
    voice: {
      hi: 'आवाज़ गाइड सुनने के लिए स्पीकर चालू करें। हेल्प के लिए कभी भी हेल्प बटन दबाएं।',
      en: 'Turn on speaker to hear voice guide. Press help button anytime for help.',
      mr: 'आवाज गाइड ऐकण्यासाठी स्पीकर चालू करा. मदतीसाठी कधीही हेल्प बटण दाबा.',
    },
  },
  
  // Progress messages
  progress: {
    step1: {
      hi: 'चरण 1: भाषा चुनें',
      en: 'Step 1: Choose Language',
      mr: 'पायरी 1: भाषा निवडा',
    },
    
    step2: {
      hi: 'चरण 2: KYC विधि चुनें',
      en: 'Step 2: Choose KYC Method',
      mr: 'पायरी 2: KYC पद्धत निवडा',
    },
    
    step3: {
      hi: 'चरण 3: दस्तावेज़ अपलोड करें',
      en: 'Step 3: Upload Documents',
      mr: 'पायरी 3: कागदपत्रे अपलोड करा',
    },
    
    step4: {
      hi: 'चरण 4: चेहरे की पहचान',
      en: 'Step 4: Face Verification',
      mr: 'पायरी 4: चेहरा ओळख',
    },
    
    step5: {
      hi: 'चरण 5: KYC पूर्ण',
      en: 'Step 5: KYC Complete',
      mr: 'पायरी 5: KYC पूर्ण',
    },
  },
};
