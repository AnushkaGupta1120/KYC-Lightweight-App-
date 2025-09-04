import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

export class KYCDataManager {
  static STORAGE_KEYS = {
    KYC_DATA: 'kycData',
    SYNC_QUEUE: 'syncQueue',
    LANGUAGE: 'selectedLanguage',
    DOCUMENTS: 'kycDocuments',
    FACE_AUTH: 'faceAuthData',
    USER_PROFILE: 'userProfile',
  };

  static async saveKYCData(type, data) {
    try {
      const existingData = await this.getKYCData();
      const updatedData = {
        ...existingData,
        [type]: {
          ...data,
          timestamp: Date.now(),
          status: 'pending_sync',
          id: this.generateId(),
        },
      };

      await AsyncStorage.setItem(
        this.STORAGE_KEYS.KYC_DATA,
        JSON.stringify(updatedData)
      );

      // Add to sync queue
      await this.addToSyncQueue(type, updatedData[type]);
      
      // Try immediate sync if online
      this.attemptSync();
      
      return true;
    } catch (error) {
      console.error('Failed to save KYC data:', error);
      return false;
    }
  }

  static async getKYCData() {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEYS.KYC_DATA);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load KYC data:', error);
      return {};
    }
  }

  static async addToSyncQueue(type, data) {
    try {
      const queue = await this.getSyncQueue();
      queue.push({
        type,
        data,
        timestamp: Date.now(),
        attempts: 0,
        maxAttempts: 5,
      });

      await AsyncStorage.setItem(
        this.STORAGE_KEYS.SYNC_QUEUE,
        JSON.stringify(queue)
      );
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  static async getSyncQueue() {
    try {
      const queue = await AsyncStorage.getItem(this.STORAGE_KEYS.SYNC_QUEUE);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      return [];
    }
  }

  static async attemptSync() {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        console.log('No internet connection - sync scheduled for later');
        return false;
      }

      const queue = await this.getSyncQueue();
      const pendingItems = queue.filter(item => item.attempts < item.maxAttempts);

      if (pendingItems.length === 0) {
        console.log('No pending items to sync');
        return true;
      }

      console.log(\`Syncing \${pendingItems.length} items...\`);
      
      for (const item of pendingItems) {
        await this.syncItem(item);
      }

      return true;
    } catch (error) {
      console.error('Sync attempt failed:', error);
      return false;
    }
  }

  static async syncItem(item) {
    try {
      item.attempts++;
      
      // Simulate API call with exponential backoff
      const delay = Math.pow(2, item.attempts - 1) * 1000; // 1s, 2s, 4s, 8s, 16s
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, 5000)));

      const response = await this.sendToServer(item);
      
      if (response.success) {
        await this.markAsSynced(item);
        console.log(\`Item \${item.type} synced successfully\`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(\`Failed to sync item \${item.type}:\`, error);
      
      if (item.attempts >= item.maxAttempts) {
        console.error(\`Max attempts reached for \${item.type}\`);
        await this.markAsFailed(item);
      } else {
        await this.updateSyncQueue();
      }
    }
  }

  static async sendToServer(item) {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        resolve({
          success,
          error: success ? null : 'Server error',
          syncId: this.generateId(),
        });
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  static async markAsSynced(item) {
    try {
      const queue = await this.getSyncQueue();
      const updatedQueue = queue.filter(queueItem => 
        queueItem.data.id !== item.data.id
      );
      
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.SYNC_QUEUE,
        JSON.stringify(updatedQueue)
      );

      // Update KYC data status
      const kycData = await this.getKYCData();
      if (kycData[item.type]) {
        kycData[item.type].status = 'synced';
        kycData[item.type].syncedAt = Date.now();
        
        await AsyncStorage.setItem(
          this.STORAGE_KEYS.KYC_DATA,
          JSON.stringify(kycData)
        );
      }
    } catch (error) {
      console.error('Failed to mark as synced:', error);
    }
  }

  static async markAsFailed(item) {
    try {
      const kycData = await this.getKYCData();
      if (kycData[item.type]) {
        kycData[item.type].status = 'sync_failed';
        kycData[item.type].failedAt = Date.now();
        
        await AsyncStorage.setItem(
          this.STORAGE_KEYS.KYC_DATA,
          JSON.stringify(kycData)
        );
      }
    } catch (error) {
      console.error('Failed to mark as failed:', error);
    }
  }

  static async updateSyncQueue() {
    // Update queue with latest attempt counts
    const queue = await this.getSyncQueue();
    await AsyncStorage.setItem(
      this.STORAGE_KEYS.SYNC_QUEUE,
      JSON.stringify(queue)
    );
  }

  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(this.STORAGE_KEYS));
      console.log('All KYC data cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  static async getStorageStats() {
    try {
      const kycData = await this.getKYCData();
      const syncQueue = await this.getSyncQueue();
      
      return {
        totalItems: Object.keys(kycData).length,
        pendingSync: syncQueue.filter(item => item.attempts < item.maxAttempts).length,
        failedSync: syncQueue.filter(item => item.attempts >= item.maxAttempts).length,
        storageUsed: JSON.stringify(kycData).length + JSON.stringify(syncQueue).length,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return null;
    }
  }
}
