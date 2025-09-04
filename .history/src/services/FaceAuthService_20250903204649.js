import AsyncStorage from '@react-native-async-storage/async-storage';

export class FaceAuthService {
  static async authenticateFace() {
    // Simulate face authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        const confidence = Math.random() * 30 + 70; // 70-100%
        const success = confidence > 75;
        
        resolve({
          success,
          confidence: Math.round(confidence),
          timestamp: Date.now(),
          method: 'liveness_detection',
        });
      }, 3000);
    });
  }

  static async saveFaceAuthData(authData) {
    try {
      await AsyncStorage.setItem('faceAuthData', JSON.stringify(authData));
      return true;
    } catch (error) {
      console.error('Failed to save face auth data:', error);
      return false;
    }
  }

  static async getFaceAuthData() {
    try {
      const data = await AsyncStorage.getItem('faceAuthData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load face auth data:', error);
      return null;
    }
  }

  static detectLiveness() {
    // Mock liveness detection
    return {
      isLive: Math.random() > 0.2, // 80% success rate
      confidence: Math.random() * 40 + 60,
      method: 'blink_detection',
    };
  }
}
