import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import {NativeEventEmitter, NativeModules} from 'react-native';
import Sound from 'react-native-sound';

export class EnhancedVoiceManager {
  static isInitialized = false;
  static currentLanguage = 'hi-IN';
  static voiceEventEmitter = null;
  static isListening = false;
  static speechResults = [];

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
        await Tts.setDefaultVoice(hindiVoices.id);
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
      
      // Load sound effects
      this.sounds = {
        success: new Sound('success.mp3', Sound.MAIN_BUNDLE),
        error: new Sound('error.mp3', Sound.MAIN_BUNDLE),
        notification: new Sound('notification.mp3', Sound.MAIN_BUNDLE),
      };
      
      return true;
    } catch (error) {
      console.error('Sound effects setup failed:', error);
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
        emphasis = false,
        breakTime = 0,
      } = options;

      // Add SSML tags for better pronunciation
      let enhancedText = text;
      
      if (emphasis) {
        enhancedText = \`<speak><emphasis level="strong">\${text}</emphasis></speak>\`;
      }
      
      if (breakTime > 0) {
        enhancedText += \`<break time="\${breakTime}s"/>\`;
      }

      await Tts.speak(enhancedText, {
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
      const originalFinish = this.onTTSFinish;
      
      this.onTTSFinish = (event) => {
        originalFinish(event);
        if (onComplete) onComplete();
        resolve(true);
      };
      
      this.speak(text, options);
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
        EXTRA_PARTIAL_RESULTS: partialResults,
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: timeout,
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
      }
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }

  // Enhanced event handlers
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
    this.isListening = false;
  };

  static onSpeechError = (e) => {
    console.error('Speech error:', e);
    this.isListening = false;
  };

  static onSpeechResults = (e) => {
    console.log('Speech results:', e.value);
    this.speechResults = e.value || [];
  };

  static onSpeechPartialResults = (e) => {
    console.log('Partial results:', e.value);
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
      Tts.removeEventListener('tts-progress', this.onTTSProgress);
      Tts.removeEventListener('tts-finish', this.onTTSFinish);
      Tts.removeEventListener('tts-cancel', this.onTTSCancel);
      
      // Cleanup voice recognition
      Voice.destroy().then(Voice.removeAllListeners);
      
      // Release sound resources
      if (this.sounds) {
        Object.values(this.sounds).forEach(sound => {
          sound.release();
        });
      }
      
      this.isInitialized = false;
      this.isListening = false;
    } catch (error) {
      console.error('VoiceManager cleanup failed:', error);
    }
  }
}
