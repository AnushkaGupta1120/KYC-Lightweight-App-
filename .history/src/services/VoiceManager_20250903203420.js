import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';

export class VoiceManager {
  static isInitialized = false;
  static currentLanguage = 'hi-IN';

  static async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize TTS
      await this.setupTTS();
      
      // Initialize Voice Recognition
      await this.setupVoiceRecognition();
      
      this.isInitialized = true;
      console.log('VoiceManager initialized successfully');
    } catch (error) {
      console.error('VoiceManager initialization failed:', error);
    }
  }

  static async setupTTS() {
    try {
      // Set default language
      Tts.setDefaultLanguage(this.currentLanguage);
      Tts.setDefaultRate(0.5); // Slower for better comprehension
      Tts.setDefaultPitch(1.0);
      
      // Add event listeners
      Tts.addEventListener('tts-start', this.onTTSStart);
      Tts.addEventListener('tts-finish', this.onTTSFinish);
      Tts.addEventListener('tts-cancel', this.onTTSCancel);
      
      return true;
    } catch (error) {
      console.error('TTS setup failed:', error);
      return false;
    }
  }

  static async setupVoiceRecognition() {
    try {
      Voice.onSpeechStart = this.onSpeechStart;
      Voice.onSpeechRecognized = this.onSpeechRecognized;
      Voice.onSpeechEnd = this.onSpeechEnd;
      Voice.onSpeechError = this.onSpeechError;
      Voice.onSpeechResults = this.onSpeechResults;
      
      return true;
    } catch (error) {
      console.error('Voice recognition setup failed:', error);
      return false;
    }
  }

  static async speak(text, language = null) {
    if (!text) return;

    try {
      const lang = language || this.currentLanguage;
      
      await Tts.speak(text, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.7,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
     
