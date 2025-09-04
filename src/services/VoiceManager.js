import Tts from 'react-native-tts';

export class VoiceManager {
  static isInitialized = false;
  static currentLanguage = 'hi-IN';

  static async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize TTS only (remove voice recognition for now)
      await this.setupTTS();
      
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
        iosParams: {
          AVSpeechUtteranceDefaultSpeechRate: 0.5,
        },
      });
    } catch (error) {
      console.error('TTS speak failed:', error);
    }
  }

  static async stop() {
    try {
      await Tts.stop();
    } catch (error) {
      console.error('TTS stop failed:', error);
    }
  }

  static async setLanguage(language) {
    try {
      this.currentLanguage = language + '-IN';
      await Tts.setDefaultLanguage(this.currentLanguage);
    } catch (error) {
      console.error('Language change failed:', error);
    }
  }

  // Event handlers
  static onTTSStart = (event) => {
    console.log('TTS started:', event);
  };

  static onTTSFinish = (event) => {
    console.log('TTS finished:', event);
  };

  static onTTSCancel = (event) => {
    console.log('TTS cancelled:', event);
  };

  static cleanup() {
    try {
      Tts.removeEventListener('tts-start', this.onTTSStart);
      Tts.removeEventListener('tts-finish', this.onTTSFinish);
      Tts.removeEventListener('tts-cancel', this.onTTSCancel);
      
      this.isInitialized = false;
    } catch (error) {
      console.error('VoiceManager cleanup failed:', error);
    }
  }
}
