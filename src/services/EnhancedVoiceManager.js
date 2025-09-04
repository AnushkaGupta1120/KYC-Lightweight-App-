import Tts from 'react-native-tts';

export class EnhancedVoiceManager {
  static isInitialized = false;
  static currentLanguage = 'hi-IN';
  static isListening = false;
  static speechResults = [];
  static voiceCallbacks = new Map();

  static async initialize() {
    if (this.isInitialized) return true;

    try {
      // Initialize TTS
      await this.setupTTS();
      
      // Initialize Voice Recognition (mock)
      await this.setupVoiceRecognition();
      
      this.isInitialized = true;
      console.log('EnhancedVoiceManager initialized successfully');
      return true;
    } catch (error) {
      console.error('EnhancedVoiceManager initialization failed:', error);
      return false;
    }
  }

  static async setupTTS() {
    try {
      // Set TTS properties for better rural India support
      Tts.setDefaultLanguage(this.currentLanguage);
      Tts.setDefaultRate(0.4); // Very slow for comprehension
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
      // Mock voice recognition setup
      console.log('Voice recognition setup (simulated)');
      return true;
    } catch (error) {
      console.error('Voice recognition setup failed:', error);
      return false;
    }
  }

  static async speak(text, options = {}) {
    if (!text) return;

    try {
      const {
        language = this.currentLanguage,
        rate = 0.4,
        pitch = 1.0,
        volume = 0.8,
      } = options;

      await Tts.speak(text, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: volume,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
        iosParams: {
          AVSpeechUtteranceDefaultSpeechRate: rate,
        },
      });

      return true;
    } catch (error) {
      console.error('TTS speak failed:', error);
      return false;
    }
  }

  static async speakWithCallback(text, onComplete, options = {}) {
    return new Promise((resolve) => {
      const callbackId = Date.now().toString();
      
      // Store callback
      this.voiceCallbacks.set(callbackId, () => {
        if (onComplete) onComplete();
        this.voiceCallbacks.delete(callbackId);
        resolve(true);
      });
      
      // Start speaking
      this.speak(text, options);
      
      // Simulate completion based on text length
      const estimatedDuration = Math.max(text.length * 80, 2000); // 80ms per char, min 2s
      setTimeout(() => {
        const callback = this.voiceCallbacks.get(callbackId);
        if (callback) {
          callback();
        }
      }, estimatedDuration);
    });
  }

  static async startListening(options = {}) {
    try {
      const {
        language = this.currentLanguage,
        partialResults = true,
        timeout = 10000,
      } = options;

      this.isListening = true;
      this.speechResults = [];
      
      console.log('Voice listening started (simulated)', { language, partialResults, timeout });
      
      // Simulate voice recognition
      this.simulateVoiceRecognition();
      
      return true;
    } catch (error) {
      console.error('Voice listening failed:', error);
      this.isListening = false;
      return false;
    }
  }

  static async stopListening() {
    try {
      this.isListening = false;
      console.log('Voice listening stopped');
      return true;
    } catch (error) {
      console.error('Stop listening failed:', error);
      return false;
    }
  }

  static simulateVoiceRecognition() {
    // Simulate voice recognition with common Hindi/English commands
    const mockCommands = [
      'शुरू करें', 'start', 'आगे', 'next', 'मदद', 'help', 
      'दोबारा', 'retry', 'रोकें', 'stop', 'हाँ', 'yes', 'नहीं', 'no'
    ];
    
    // Randomly simulate hearing a command after 2-5 seconds
    setTimeout(() => {
      if (this.isListening) {
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        this.speechResults = [randomCommand];
        console.log('Simulated voice recognition:', randomCommand);
      }
    }, 2000 + Math.random() * 3000);
  }

  static async pauseTTS() {
    try {
      await Tts.stop();
      return true;
    } catch (error) {
      console.error('TTS pause failed:', error);
      return false;
    }
  }

  static async resumeTTS() {
    // Note: Resume functionality - just return true for now
    return true;
  }

  static playSound(soundName) {
    try {
      console.log('Playing sound:', soundName);
      // Mock sound playback
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }

  // Enhanced event handlers
  static onTTSStart = (event) => {
    console.log('TTS started:', event);
  };

  static onTTSFinish = (event) => {
    console.log('TTS finished:', event);
    // Trigger any pending callbacks
    this.voiceCallbacks.forEach(callback => callback());
    this.voiceCallbacks.clear();
  };

  static onTTSCancel = (event) => {
    console.log('TTS cancelled:', event);
  };

  static getLastSpeechResult() {
    return this.speechResults.length > 0 ? this.speechResults : null;
  }

  static getAllSpeechResults() {
    return this.speechResults;
  }

  static async setLanguage(languageCode) {
    try {
      this.currentLanguage = languageCode + '-IN';
      await Tts.setDefaultLanguage(this.currentLanguage);
      return true;
    } catch (error) {
      console.error('Language change failed:', error);
      return false;
    }
  }

  static cleanup() {
    try {
      // Remove TTS listeners
      Tts.removeEventListener('tts-start', this.onTTSStart);
      Tts.removeEventListener('tts-finish', this.onTTSFinish);
      Tts.removeEventListener('tts-cancel', this.onTTSCancel);
      
      // Clear callbacks and state
      this.voiceCallbacks.clear();
      this.isListening = false;
      this.speechResults = [];
      this.isInitialized = false;
      
      console.log('EnhancedVoiceManager cleaned up');
    } catch (error) {
      console.error('EnhancedVoiceManager cleanup failed:', error);
    }
  }
}
