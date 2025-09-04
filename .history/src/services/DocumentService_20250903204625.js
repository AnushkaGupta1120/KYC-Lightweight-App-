import AsyncStorage from '@react-native-async-storage/async-storage';

export class DocumentService {
  static async validateDocument(image, documentType) {
    // Simulate document validation
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = image.fileSize > 10000; // At least 10KB
        const confidence = Math.random() * 40 + 60; // 60-100%
        
        resolve({
          isValid,
          confidence,
          documentType,
          feedback: {
            hi: isValid 
              ? 'दस्तावेज़ स्वीकार किया गया'
              : 'फोटो साफ नहीं है। अच्छी रोशनी में दोबारा लें।',
            en: isValid
              ? 'Document accepted'
              : 'Photo is not clear. Retake in good lighting.',
            mr: isValid
              ? 'कागदपत्र स्वीकारले'
              : 'फोटो स्पष्ट नाही. चांगल्या प्रकाशात पुन्हा घ्या.',
          },
        });
      }, 2000);
    });
  }

  static async saveDocuments(documents) {
    try {
      await AsyncStorage.setItem('kycDocuments', JSON.stringify(documents));
      return true;
    } catch (error) {
      console.error('Failed to save documents:', error);
      return false;
    }
  }

  static async getDocuments() {
    try {
      const docs = await AsyncStorage.getItem('kycDocuments');
      return docs ? JSON.parse(docs) : {};
    } catch (error) {
      console.error('Failed to load documents:', error);
      return {};
    }
  }

  static extractTextFromImage(image, documentType) {
    // Mock OCR extraction
    const mockData = {
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

    return mockData[documentType] || {};
  }
}
