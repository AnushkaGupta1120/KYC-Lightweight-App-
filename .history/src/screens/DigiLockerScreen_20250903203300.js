import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
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

const DigiLockerScreen = ({navigation}) => {
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [step, setStep] = useState(1); // 1: auth, 2: otp, 3: documents
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [availableDocuments, setAvailableDocuments] = useState([]);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const language = await AsyncStorage.getItem('selectedLanguage') || 'hi';
    setCurrentLanguage(language);
  };

  const handleAadhaarSubmit = async () => {
    if (aadhaarNumber.length < 12) {
      Alert.alert(
        currentLanguage === 'hi' ? 'गलत आधार नंबर' : 'Invalid Aadhaar',
        currentLanguage === 'hi' 
          ? 'कृपया 12 अंकों का आधार नंबर डालें'
          : 'Please enter 12-digit Aadhaar number'
      );
      return;
    }

    setIsLoading(true);
    VoiceManager.speak(
      currentLanguage === 'hi'
        ? 'DigiLocker से जुड़ रहे हैं। OTP भेजा जा रहा है।'
        : 'Connecting to DigiLocker. Sending OTP.',
      currentLanguage
    );

    try {
      // Simulate DigiLocker OTP request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep(2);
      VoiceManager.speak(
        currentLanguage === 'hi'
          ? 'OTP आपके मोबाइल पर भेजा गया है।'
          : 'OTP has been sent to your mobile.',
        currentLanguage
      );
    } catch (error) {
      Alert.alert(
        currentLanguage === 'hi' ? 'त्रुटि' : 'Error',
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length < 6) {
      Alert.alert(
        currentLanguage === 'hi' ? 'गलत OTP' : 'Invalid OTP',
        currentLanguage === 'hi' 
          ? 'कृपया 6 अंकों का OTP डालें'
          : 'Please enter 6-digit OTP'
      );
      return;
    }

    setIsLoading(true);
    VoiceManager.speak(
      currentLanguage === 'hi'
        ? 'OTP की जांच की जा रही है...'
        : 'Verifying OTP...',
      currentLanguage
    );

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sessionId = `session_${Date.now()}`;
      const documents = [
        { type: 'aadhaar', name: 'Aadhaar Card', id: 'aadhaar_001' },
        { type: 'pan', name: 'PAN Card', id: 'pan_001' },
      ];
      
      setSessionId(sessionId);
      setAvailableDocuments(documents);
      setStep(3);
      
      VoiceManager.speak(
        currentLanguage === 'hi'
          ? 'सफलतापूर्वक जुड़ाव। दस्तावेज़ मिल गए।'
          : 'Successfully connected. Documents found.',
        currentLanguage
      );
    } catch (error) {
      Alert.alert(
        currentLanguage === 'hi' ? 'त्रुटि' : 'Error',
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentFetch = async () => {
    setIsLoading(true);
    VoiceManager.speak(
      currentLanguage === 'hi'
        ? 'दस्तावेज़ डाउनलोड किए जा रहे हैं...'
        : 'Downloading documents...',
      currentLanguage
    );

    try {
      // Simulate document download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDocuments = {
        aadhaar: {
          name: 'राज पटेल',
          number: '****-****-1234',
          address: 'मुंबई, महाराष्ट्र',
        },
        pan: {
          name: 'RAJ PATEL',
          number: 'ABCDE1234F',
          father: 'KUMAR PATEL',
        },
      };
      
      await AsyncStorage.setItem('digilockerDocuments', JSON.stringify(mockDocuments));
      
      VoiceManager.speak(
        currentLanguage === 'hi'
          ? 'दस्तावेज़ सफलतापूर्वक प्राप्त। अब चेहरे की पहचान करें।'
          : 'Documents received successfully. Now proceed to face verification.',
        currentLanguage
      );

      setTimeout(() => {
        navigation.navigate('FaceAuth');
      }, 2000);
    } catch (error) {
      Alert.alert(
        currentLanguage === 'hi' ? 'त्रुटि' : 'Error',
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelp = () => {
    const helpTexts = {
      1: {
        hi: 'आधार नंबर डालें जो आपके मोबाइल से जुड़ा है। OTP इसी नंबर पर आएगा।',
        en: 'Enter Aadhaar number linked to your mobile. OTP will come on this number.',
        mr: 'तुमच्या मोबाइलशी जोडलेला आधार नंबर टाका. OTP याच नंबरवर येईल.',
      },
      2: {
        hi: 'मोबाइल पर आया OTP डालें। 6 अंकों का होगा।',
        en: 'Enter OTP received on mobile. It will be 6 digits.',
        mr: 'मोबाइलवर आलेला OTP टाका. तो 6 अंकांचा असेल.',
      },
      3: {
        hi: 'आपके DigiLocker से दस्तावेज़ मिल गए हैं। अब इन्हें डाउनलोड करें।',
        en: 'Documents found in your DigiLocker. Now download them.',
        mr: 'तुमच्या DigiLocker मध्ये कागदपत्रे सापडली आहेत. आता ती डाउनलोड करा.',
      },
    };

    VoiceManager.speak(helpTexts[step][currentLanguage], currentLanguage);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <HelpButton onPress={handleHelp} />
      
      <ProgressIndicator
        currentStep={3}
        totalSteps={5}
        stepTitles={['भाषा / Language', 'KYC विधि / Method', 'DigiLocker', 'चेहरा / Face', 'सफल / Success']}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          DigiLocker से जुड़ें{'\n'}
          Connect with DigiLocker
        </Text>

        <VoiceHelper
          text={
            step === 1 
              ? (currentLanguage === 'hi' ? 'अपना आधार नंबर डालें' : 'Enter your Aadhaar number')
              : step === 2
              ? (currentLanguage === 'hi' ? 'OTP डालें' : 'Enter OTP')
              : (currentLanguage === 'hi' ? 'दस्तावेज़ डाउनलोड करें' : 'Download documents')
          }
          language={`${currentLanguage}-IN`}
          autoPlay={true}
        />

        {/* Step 1: Aadhaar Input */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>
              {currentLanguage === 'hi' ? 'आधार नंबर / Aadhaar Number' : 'Aadhaar Number'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder={currentLanguage === 'hi' ? 'XXXX-XXXX-XXXX' : 'XXXX-XXXX-XXXX'}
              value={aadhaarNumber}
              onChangeText={setAadhaarNumber}
              keyboardType="numeric"
              maxLength={12}
              autoFocus={true}
            />
            
            <Text style={styles.inputHelper}>
              {currentLanguage === 'hi' 
                ? '* मोबाइल से जुड़ा आधार नंबर डालें'
                : '* Enter mobile-linked Aadhaar number'
              }
            </Text>

            <LargeButton
              title={
                currentLanguage === 'hi' 
                  ? 'OTP भेजें' 
                  : 'Send OTP'
              }
              icon="send"
              onPress={handleAadhaarSubmit}
              disabled={aadhaarNumber.length < 12 || isLoading}
              loading={isLoading}
              style={styles.actionButton}
            />
          </View>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>
              {currentLanguage === 'hi' ? 'OTP' : 'OTP'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder={currentLanguage === 'hi' ? 'XXXXXX' : 'XXXXXX'}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              autoFocus={true}
            />
            
            <Text style={styles.inputHelper}>
              {currentLanguage === 'hi' 
                ? `* OTP ${aadhaarNumber.slice(-4)} पर भेजा गया`
                : `* OTP sent to ${aadhaarNumber.slice(-4)}`
              }
            </Text>

            <LargeButton
              title={
                currentLanguage === 'hi' 
                  ? 'OTP सत्यापित करें' 
                  : 'Verify OTP'
              }
              icon="verified"
              onPress={handleOTPSubmit}
              disabled={otp.length < 6 || isLoading}
              loading={isLoading}
              style={styles.actionButton}
            />

            <LargeButton
              title={
                currentLanguage === 'hi' 
                  ? 'दोबारा OTP भेजें' 
                  : 'Resend OTP'
              }
              icon="refresh"
              onPress={handleAadhaarSubmit}
              variant="outline"
              disabled={isLoading}
              style={styles.resendButton}
            />
          </View>
        )}

        {/* Step 3: Document List */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.documentsTitle}>
              {currentLanguage === 'hi' 
                ? 'उपलब्ध दस्तावेज़:'
                : 'Available Documents:'
              }
            </Text>

            <View style={styles.documentsContainer}>
              {availableDocuments.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <Text style={styles.documentIcon}>
                    {doc.type === 'aadhaar' ? '🆔' : doc.type === 'pan' ? '💳' : '📄'}
                  </Text>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <Text style={styles.documentStatus}>
                      {currentLanguage === 'hi' ? 'उपलब्ध' : 'Available'}
                    </Text>
                  </View>
                  <Text style={styles.documentCheck}>✅</Text>
                </View>
              ))}
            </View>

            <LargeButton
              title={
                currentLanguage === 'hi' 
                  ? 'दस्तावेज़ डाउनलोड करें' 
                  : 'Download Documents'
              }
              icon="download"
              onPress={handleDocumentFetch}
              disabled={isLoading}
              loading={isLoading}
              style={styles.actionButton}
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {currentLanguage === 'hi' 
              ? '🔒 आपकी जानकारी पूर्णतः सुरक्षित है\n📱 यह सरकारी DigiLocker सेवा है'
              : '🔒 Your information is completely secure\n📱 This is official DigiLocker service'
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
    marginBottom: 20,
    lineHeight: typography.lineHeight.title,
  },
  
  stepContainer: {
    marginVertical: 20,
  },
  
  label: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
    marginBottom: 8,
  },
  
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.regular,
    backgroundColor: colors.surface,
    textAlign: 'center',
    letterSpacing: 2,
  },
  
  inputHelper: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  
  actionButton: {
    marginTop: 20,
  },
  
  resendButton: {
    marginTop: 10,
  },
  
  documentsTitle: {
    fontSize: typography.fontSize.large,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: 15,
  },
  
  documentsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  documentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  
  documentInfo: {
    flex: 1,
  },
  
  documentName: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
  },
  
  documentStatus: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.regular,
    color: colors.success,
    marginTop: 2,
  },
  
  documentCheck: {
    fontSize: 20,
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
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.small,
  },
});

export default DigiLockerScreen;
