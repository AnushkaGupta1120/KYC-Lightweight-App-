import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
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
import {DocumentService} from '../services/DocumentService';

const DocumentCaptureScreen = ({navigation}) => {
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [documents, setDocuments] = useState({
    aadhaar: null,
    pan: null,
  });
  const [currentDoc, setCurrentDoc] = useState('aadhaar');
  const [isValidating, setIsValidating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentTypes = [
    {
      type: 'aadhaar',
      name: {hi: 'आधार कार्ड', en: 'Aadhaar Card', mr: 'आधार कार्ड'},
      required: true,
    },
    {
      type: 'pan',
      name: {hi: 'पैन कार्ड', en: 'PAN Card', mr: 'पॅन कार्ड'},
      required: true,
    },
  ];

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const language = await AsyncStorage.getItem('selectedLanguage') || 'hi';
    setCurrentLanguage(language);
  };

  const captureDocument = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    Alert.alert(
      currentLanguage === 'hi' ? 'फोटो कैसे लें' : 'How to take photo',
      currentLanguage === 'hi' 
        ? 'कैमरा खोलें या गैलरी से चुनें'
        : 'Open camera or choose from gallery',
      [
        {
          text: currentLanguage === 'hi' ? 'कैमरा' : 'Camera',
          onPress: () => launchCamera(options, handleImageResponse),
        },
        {
          text: currentLanguage === 'hi' ? 'गैलरी' : 'Gallery',
          onPress: () => launchImageLibrary(options, handleImageResponse),
        },
        {
          text: currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleImageResponse = async (response) => {
    if (response.didCancel || response.error) {
      VoiceManager.speak(
        currentLanguage === 'hi' 
          ? 'फोटो नहीं ली गई। दोबारा कोशिश करें।'
          : 'Photo not taken. Please try again.',
        currentLanguage
      );
      return;
    }

    if (response.assets && response.assets) {
      const image = response.assets;
      await validateDocument(image);
    }
  };

  const validateDocument = async (image) => {
    setIsValidating(true);
    
    VoiceManager.speak(
      currentLanguage === 'hi'
        ? 'दस्तावेज़ की जांच की जा रही है...'
        : 'Validating document...',
      currentLanguage
    );

    try {
      // Simulate validation with progress
      for (let i = 0; i <= 100; i += 20) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const validation = await DocumentService.validateDocument(image, currentDoc);
      
      if (validation.isValid) {
        const updatedDocs = {...documents, [currentDoc]: image};
        setDocuments(updatedDocs);
        
        VoiceManager.speak(
          currentLanguage === 'hi'
            ? `${documentTypes.find(d => d.type === currentDoc).name[currentLanguage]} स्वीकार किया गया`
            : `${documentTypes.find(d => d.type === currentDoc).name[currentLanguage]} accepted`,
          currentLanguage
        );

        // Move to next document or face auth
        if (currentDoc === 'aadhaar') {
          setCurrentDoc('pan');
        } else {
          // Save all documents and proceed
          await DocumentService.saveDocuments(updatedDocs);
          setTimeout(() => {
            navigation.navigate('FaceAuth');
          }, 2000);
        }
      } else {
        VoiceManager.speak(validation.feedback[currentLanguage], currentLanguage);
      }
    } catch (error) {
      console.error('Document validation error:', error);
      VoiceManager.speak(
        currentLanguage === 'hi'
          ? 'कुछ गलत हुआ। दोबारा कोशिश करें।'
          : 'Something went wrong. Please try again.',
        currentLanguage
      );
    } finally {
      setIsValidating(false);
      setUploadProgress(0);
    }
  };

  const handleHelp = () => {
    const helpText = {
      hi: 'दस्तावेज़ की साफ फोटो लें। अच्छी रोशनी में रखें और धुंधला न हो।',
      en: 'Take clear photo of document. Keep in good light and avoid blur.',
      mr: 'कागदपत्राचे स्पष्ट फोटो घ्या. चांगल्या प्रकाशात ठेवा आणि धुसर होऊ देऊ नका.',
    };
    VoiceManager.speak(helpText[currentLanguage], currentLanguage);
  };

  const currentDocName = documentTypes.find(d => d.type === currentDoc)?.name[currentLanguage];

  return (
    <SafeAreaView style={commonStyles.container}>
      <HelpButton onPress={handleHelp} />
      
      <ProgressIndicator
        currentStep={3}
        totalSteps={5}
        stepTitles={['भाषा / Language', 'KYC विधि / Method', 'दस्तावेज़ / Documents', 'चेहरा / Face', 'सफल / Success']}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {currentDocName} की फोटो लें{'\n'}
          Take photo of {currentDocName}
        </Text>

        <VoiceHelper
          text={LanguageService.getText('documentCaptureInstructions', currentLanguage)}
          language={`${currentLanguage}-IN`}
          autoPlay={true}
        />

        {/* Document preview */}
        <View style={styles.previewContainer}>
          {documents[currentDoc] ? (
            <Image 
              source={{uri: documents[currentDoc].uri}} 
              style={styles.documentPreview}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>📄</Text>
              <Text style={styles.placeholderDescription}>
                {currentLanguage === 'hi' 
                  ? `${currentDocName} की फोटो लें`
                  : `Take ${currentDocName} photo`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Upload progress */}
        {isValidating && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, {width: `${uploadProgress}%`}]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentLanguage === 'hi' 
                ? `जांच की जा रही है... ${uploadProgress}%`
                : `Validating... ${uploadProgress}%`
              }
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <LargeButton
          title={
            documents[currentDoc] 
              ? (currentLanguage === 'hi' ? 'फिर से फोटो लें' : 'Retake Photo')
              : (currentLanguage === 'hi' ? 'फोटो लें' : 'Take Photo')
          }
          icon="camera-alt"
          onPress={captureDocument}
          disabled={isValidating}
          style={styles.captureButton}
        />

        {documents[currentDoc] && !isValidating && (
          <LargeButton
            title={
              currentDoc === 'aadhaar' 
                ? (currentLanguage === 'hi' ? 'अगला दस्तावेज़' : 'Next Document')
                : (currentLanguage === 'hi' ? 'चेहरे की पहचान करें' : 'Proceed to Face Auth')
            }
            icon={currentDoc === 'aadhaar' ? 'navigate-next' : 'face'}
            onPress={() => {
              if (currentDoc === 'aadhaar') {
                setCurrentDoc('pan');
              } else {
                navigation.navigate('FaceAuth');
              }
            }}
            variant="secondary"
            style={styles.nextButton}
          />
        )}

        {/* Document checklist */}
        <View style={styles.checklistContainer}>
          <Text style={styles.checklistTitle}>
            {currentLanguage === 'hi' ? 'दस्तावेज़ सूची:' : 'Document List:'}
          </Text>
          {documentTypes.map((doc) => (
            <View key={doc.type} style={styles.checklistItem}>
              <Text style={styles.checklistIcon}>
                {documents[doc.type] ? '✅' : '⭕'}
              </Text>
              <Text style={styles.checklistText}>
                {doc.name[currentLanguage]}
                {doc.required && ' *'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
  
  previewContainer: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  
  documentPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  placeholderText: {
    fontSize: 48,
    marginBottom: 10,
  },
  
  placeholderDescription: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  progressContainer: {
    marginVertical: 20,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  
  progressText: {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  
  captureButton: {
    marginVertical: 10,
  },
  
  nextButton: {
    marginVertical: 10,
  },
  
  checklistContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  
  checklistTitle: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: 10,
  },
  
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  
  checklistIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  
  checklistText: {
    fontSize: typography.fontSize.medium,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
  },
});

export default DocumentCaptureScreen;
