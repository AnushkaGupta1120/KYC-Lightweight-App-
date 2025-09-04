import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import { NativeEventEmitter, NativeModules } from 'react-native';
import Sound from 'react-native-sound';

export class EnhancedVoiceManager {
  static isInitialized = false;
  static currentLanguage = 'hi-IN';
  static voiceEventEmitter = null;
  static isListening = false;
  static speechResults = [];
  static sounds = {}; // Initialize sounds object

  static async initialize() {
    if (this.isInitialized) return true;

    try {
      // Initialize TTS
      await this.setupTTS();
      
      // Initialize Voice Recognition
      await this.setupVoiceRecognition();
      
      // Setup sound effects
      await this.setupSoundEffects();
      
      this.isInitialized = true;
      console.log('Enhanced VoiceManager initialized');
      return true;
    } catch (error) {
      console.error('VoiceManager initialization failed:', error);
      return false;
    }
  }

  static async setupTTS() {
    try {
      // Set TTS properties for better rural India support
      Tts.setDefaultLanguage(this.currentLanguage);
      Tts.setDefaultRate(0.4); // Very slow for comprehension
      Tts.setDefaultPitch(1.0);
      
      // Get available voices
      const voices = await Tts.voices();
      console.log('Available voices:', voices);
      
      // Select best Hindi voice if available
      const hindiVoices = voices.filter(voice => 
        voice.language.includes('hi') || voice.language.includes('hindi')
      );
      
      if (hindiVoices.length > 0) {
        // Fix: Use voice id property correctly
        await Tts.setDefaultVoice(hindiVoices[0].id);
      }
      
      // Add event listeners
      Tts.addEventListener('tts-start', this.onTTSStart);
      Tts.addEventListener('tts-progress', this.onTTSProgress);
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
      Voice.onSpeechPartialResults = this.onSpeechPartialResults;
      
      return true;
    } catch (error) {
      console.error('Voice recognition setup failed:', error);
      return false;
    }
  }

  static async setupSoundEffects() {
    try {
      // Enable playback in silence mode
      Sound.setCategory('Playback');
      
      // Load sound effects with error handling
      this.sounds = {};
      
      // Load sounds with promises to handle loading completion
      const loadSound = (name, filename) => {
        return new Promise((resolve) => {
          this.sounds[name] = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log(`Failed to load sound ${name}:`, error);
              resolve(false);
            } else {
              console.log(`Successfully loaded sound ${name}`);
              resolve(true);
            }
          });
        });
      };

      await Promise.all([
        loadSound('success', 'success.mp3'),
        loadSound('error', 'error.mp3'),
        loadSound('notification', 'notification.mp3'),
      ]);
      
      return true;
    } catch (error) {
      console.error('Sound effects setup failed:', error);
      return false;
    }
  }

  static async speak(text, options = {}) {
    if (!text) return false;

    try {
      const {
        language = this.currentLanguage,
        rate = 0.4,
        pitch = 1.0,
        volume = 0.8,
        emphasis = false,
        breakTime = 0,
      } = options;

      // Simple text enhancement without SSML (not supported by all engines)
      let enhancedText = text;
      
      // Add pauses for better comprehension
      if (breakTime > 0) {
        enhancedText = text + '. '; // Add natural pause with period
      }

      // Set language before speaking
      await Tts.setDefaultLanguage(language);
      await Tts.setDefaultRate(rate);
      await Tts.setDefaultPitch(pitch);

      await Tts.speak(enhancedText);

      return true;
    } catch (error) {
      console.error('TTS speak failed:', error);
      return false;
    }
  }

  static async speakWithCallback(text, onComplete, options = {}) {
    return new Promise((resolve) => {
      // Store original finish handler
      const originalFinish = this.onTTSFinish;
      
      // Create temporary finish handler
      const tempFinishHandler = (event) => {
        // Restore original handler
        this.onTTSFinish = originalFinish;
        
        // Remove this temporary listener
        Tts.removeEventListener('tts-finish', tempFinishHandler);
        
        // Call completion callback
        if (onComplete) onComplete();
        resolve(true);
      };
      
      // Add temporary listener
      Tts.addEventListener('tts-finish', tempFinishHandler);
      
      // Start speaking
      this.speak(text, options).catch(() => resolve(false));
    });
  }

  static async startListening(options = {}) {
    if (this.isListening) {
      await this.stopListening();
    }

    try {
      const {
        language = this.currentLanguage,
        partialResults = true,
        timeout = 10000,
      } = options;

      this.isListening = true;
      this.speechResults = [];
      
      await Voice.start(language, {
        'EXTRA_PARTIAL_RESULTS': partialResults,
        'EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS': timeout,
      });

      return true;
    } catch (error) {
      console.error('Voice listening failed:', error);
      this.isListening = false;
      return false;
    }
  }

  static async stopListening() {
    try {
      if (this.isListening) {
        await Voice.stop();
        this.isListening = false;
      }
      return true;
    } catch (error) {
      console.error('Stop listening failed:', error);
      return false;
    }
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
    // Note: Resume functionality depends on the text being re-spoken
    // This is a limitation of react-native-tts
    return true;
  }

  static playSound(soundName) {
    try {
      if (this.sounds && this.sounds[soundName]) {
        this.sounds[soundName].play((success) => {
          if (!success) {
            console.log('Sound playback failed');
          }
        });
        return true;
      } else {
        console.log(`Sound ${soundName} not found`);
        return false;
      }
    } catch (error) {
      console.error('Sound playback error:', error);
      return false;
    }
  }

  // Enhanced event handlers - Fix arrow functions binding
  static onTTSStart = (event) => {
    console.log('TTS started:', event);
  };

  static onTTSProgress = (event) => {
    console.log('TTS progress:', event);
  };

  static onTTSFinish = (event) => {
    console.log('TTS finished:', event);
  };

  static onTTSCancel = (event) => {
    console.log('TTS cancelled:', event);
  };

  static onSpeechStart = (e) => {
    console.log('Speech started:', e);
  };

  static onSpeechRecognized = (e) => {
    console.log('Speech recognized:', e);
  };

  static onSpeechEnd = (e) => {
    console.log('Speech ended:', e);
    EnhancedVoiceManager.isListening = false; // Fix: use class name for static reference
  };

  static onSpeechError = (e) => {
    console.error('Speech error:', e);
    EnhancedVoiceManager.isListening = false; // Fix: use class name for static reference
  };

  static onSpeechResults = (e) => {
    console.log('Speech results:', e.value);
    EnhancedVoiceManager.speechResults = e.value || []; // Fix: use class name for static reference
  };

  static onSpeechPartialResults = (e) => {
    console.log('Partial results:', e.value);
  };

  static getLastSpeechResult() {
    return this.speechResults.length > 0 ? this.speechResults[0] : null; // Fix: return first result, not array
  }

  static getAllSpeechResults() {
    return this.speechResults;
  }

  static async setLanguage(languageCode) {
    try {
      // Fix: Handle language code properly
      const formattedLanguage = languageCode.includes('-') 
        ? languageCode 
        : `${languageCode}-IN`;
      
      this.currentLanguage = formattedLanguage;
      await Tts.setDefaultLanguage(this.currentLanguage);
      return true;
    } catch (error) {
      console.error('Language change failed:', error);
      return false;
    }
  }

  static async cleanup() {
    try {
      // Stop any ongoing TTS
      await Tts.stop();
      
      // Remove TTS listeners
      Tts.removeEventListener('tts-start', this.onTTSStart);
      Tts.removeEventListener('tts-progress', this.onTTSProgress);
      Tts.removeEventListener('tts-finish', this.onTTSFinish);
      Tts.removeEventListener('tts-cancel', this.onTTSCancel);
      
      // Stop voice recognition and cleanup
      if (this.isListening) {
        await Voice.stop();
      }
      await Voice.destroy();
      Voice.removeAllListeners();
      
      // Release sound resources
      if (this.sounds) {
        Object.values(this.sounds).forEach(sound => {
          if (sound && typeof sound.release === 'function') {
            sound.release();
          }
        });
        this.sounds = {};
      }
      
      this.isInitialized = false;
      this.isListening = false;
      this.speechResults = [];
      
      console.log('VoiceManager cleanup completed');
      return true;
    } catch (error) {
      console.error('VoiceManager cleanup failed:', error);
      return false;
    }
  }

  // Additional utility methods
  static async checkTTSAvailability() {
    try {
      const voices = await Tts.voices();
      return voices.length > 0;
    } catch (error) {
      console.error('TTS availability check failed:', error);
      return false;
    }
  }

  static async checkVoiceRecognitionAvailability() {
    try {
      const isAvailable = await Voice.isAvailable();
      return isAvailable;
    } catch (error) {
      console.error('Voice recognition availability check failed:', error);
      return false;
    }
  }

  static getStatus() {
    return {
      isInitialized: this.isInitialized,
      currentLanguage: this.currentLanguage,
      isListening: this.isListening,
      speechResultsCount: this.speechResults.length,
      soundsLoaded: Object.keys(this.sounds).length,
    };
  }
}