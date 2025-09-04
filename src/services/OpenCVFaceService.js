import {NativeModules} from 'react-native';
import RNFS from 'react-native-fs';

const {OpenCV} = NativeModules;

export class OpenCVFaceService {
  static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return true;

    try {
      // Initialize OpenCV
      const result = await OpenCV.initialize();
      this.isInitialized = result;
      console.log('OpenCV initialized:', result);
      return result;
    } catch (error) {
      console.error('OpenCV initialization failed:', error);
      return false;
    }
  }

  static async detectFaces(imageUri) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Convert image to base64 for processing
      const imageBase64 = await RNFS.readFile(imageUri, 'base64');
      
      // Detect faces using OpenCV
      const detectionResult = await OpenCV.detectFaces(imageBase64);
      
      return {
        success: true,
        faces: detectionResult.faces || [],
        faceCount: detectionResult.faces?.length || 0,
        confidence: detectionResult.confidence || 0,
        landmarks: detectionResult.landmarks || [],
      };
    } catch (error) {
      console.error('Face detection failed:', error);
      return {
        success: false,
        error: error.message,
        faces: [],
        faceCount: 0,
      };
    }
  }

  static async detectLiveness(imageUri) {
    try {
      const imageBase64 = await RNFS.readFile(imageUri, 'base64');
      
      // Enhanced liveness detection with OpenCV
      const livenessResult = await OpenCV.detectLiveness(imageBase64);
      
      return {
        isLive: livenessResult.isLive,
        confidence: livenessResult.confidence,
        blinkDetected: livenessResult.blinkDetected,
        motionDetected: livenessResult.motionDetected,
        textureAnalysis: livenessResult.textureAnalysis,
      };
    } catch (error) {
      console.error('Liveness detection failed:', error);
      return {
        isLive: false,
        confidence: 0,
        error: error.message,
      };
    }
  }

  static async extractFaceFeatures(imageUri) {
    try {
      const imageBase64 = await RNFS.readFile(imageUri, 'base64');
      
      // Extract facial features and landmarks
      const features = await OpenCV.extractFaceFeatures(imageBase64);
      
      return {
        success: true,
        features: features.faceEmbedding,
        landmarks: features.landmarks,
        quality: features.quality,
        pose: features.pose, // Head rotation angles
      };
    } catch (error) {
      console.error('Feature extraction failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async compareFaces(imageUri1, imageUri2) {
    try {
      const image1Base64 = await RNFS.readFile(imageUri1, 'base64');
      const image2Base64 = await RNFS.readFile(imageUri2, 'base64');
      
      // Compare two face images
      const comparison = await OpenCV.compareFaces(image1Base64, image2Base64);
      
      return {
        similarity: comparison.similarity,
        isMatch: comparison.similarity > 0.7, // 70% threshold
        confidence: comparison.confidence,
      };
    } catch (error) {
      console.error('Face comparison failed:', error);
      return {
        similarity: 0,
        isMatch: false,
        error: error.message,
      };
    }
  }

  static async enhanceImage(imageUri) {
    try {
      const imageBase64 = await RNFS.readFile(imageUri, 'base64');
      
      // Enhance image quality for better detection
      const enhanced = await OpenCV.enhanceImage(imageBase64, {
        brightness: 1.1,
        contrast: 1.2,
        denoising: true,
        sharpening: true,
      });
      
      return {
        success: true,
        enhancedImage: enhanced.imageBase64,
        improvements: enhanced.improvements,
      };
    } catch (error) {
      console.error('Image enhancement failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
