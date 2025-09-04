export class DigiLockerService {
  static baseURL = 'https://api.digilocker.gov.in/public'; // Mock URL
  
  static async requestOTP(aadhaarNumber) {
    // Mock DigiLocker OTP request
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = aadhaarNumber.length === 12;
        resolve({
          success,
          message: success ? 'OTP sent successfully' : 'Invalid Aadhaar number',
          error: success ? null : 'Invalid Aadhaar number',
        });
      }, 2000);
    });
  }

  static async verifyOTP(aadhaarNumber, otp) {
    // Mock OTP verification
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = otp === '123456' || otp.length === 6; // Mock: accept any 6-digit or 123456
        resolve({
          success,
          sessionId: success ? `session_${Date.now()}` : null,
          documents: success ? [
            { type: 'aadhaar', name: 'Aadhaar Card', id: 'aadhaar_001' },
            { type: 'pan', name: 'PAN Card', id: 'pan_001' },
          ] : [],
          message: success ? 'OTP verified successfully' : 'Invalid OTP',
          error: success ? null : 'Invalid OTP',
        });
      }, 1500);
    });
  }

  static async fetchDocument(sessionId, documentId) {
    // Mock document fetch
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          document: {
            id: documentId,
            type: documentId.includes('aadhaar') ? 'aadhaar' : 'pan',
            data: {
              name: 'राज पटेल',
              number: documentId.includes('aadhaar') ? '****-****-1234' : 'ABCDE1234F',
              address: documentId.includes('aadhaar') ? 'मुंबई, महाराष्ट्र' : undefined,
              father: documentId.includes('pan') ? 'कुमार पटेल' : undefined,
              dob: '01/01/1990',
              photo: 'base64_encoded_photo_data',
            },
            downloadedAt: Date.now(),
          },
        });
      }, 1000);
    });
  }

  static async fetchAllDocuments(sessionId) {
    // Mock fetch all documents
    const aadhaar = await this.fetchDocument(sessionId, 'aadhaar_001');
    const pan = await this.fetchDocument(sessionId, 'pan_001');
    
    return {
      aadhaar: aadhaar.document,
      pan: pan.document,
      fetchedAt: Date.now(),
      sessionId,
    };
  }

  static async logout(sessionId) {
    // Mock logout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
}
