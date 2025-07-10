// Local storage service for offline functionality
// In a real app, you'd use SQLite or AsyncStorage
import { UserProgress } from './userDataService';

interface StorageData {
  bookmarkedJobs: number[];
  recentSearches: string[];
  offlineJobs: any[];
  userData: Record<string, UserProgress>;
  userPreferences: {
    notifications: boolean;
    dataUsage: 'low' | 'normal' | 'high';
    language: 'en' | 'ar';
  };
}

class StorageService {
  private data: StorageData = {
    bookmarkedJobs: [],
    recentSearches: [],
    offlineJobs: [],
    userData: {},
    userPreferences: {
      notifications: true,
      dataUsage: 'normal',
      language: 'en',
    },
  };

  // Bookmarks
  async getBookmarkedJobs(): Promise<number[]> {
    return this.data.bookmarkedJobs;
  }

  async addBookmark(jobId: number): Promise<void> {
    if (!this.data.bookmarkedJobs.includes(jobId)) {
      this.data.bookmarkedJobs.push(jobId);
    }
  }

  async removeBookmark(jobId: number): Promise<void> {
    this.data.bookmarkedJobs = this.data.bookmarkedJobs.filter(id => id !== jobId);
  }

  // Recent searches
  async getRecentSearches(): Promise<string[]> {
    return this.data.recentSearches;
  }

  async addRecentSearch(query: string): Promise<void> {
    // Remove if already exists
    this.data.recentSearches = this.data.recentSearches.filter(q => q !== query);
    // Add to beginning
    this.data.recentSearches.unshift(query);
    // Keep only last 10
    this.data.recentSearches = this.data.recentSearches.slice(0, 10);
  }

  async clearRecentSearches(): Promise<void> {
    this.data.recentSearches = [];
  }

  // Offline jobs
  async saveJobsForOffline(jobs: any[]): Promise<void> {
    this.data.offlineJobs = jobs;
  }

  async getOfflineJobs(): Promise<any[]> {
    return this.data.offlineJobs;
  }

  // User preferences
  async getUserPreferences(): Promise<StorageData['userPreferences']> {
    return this.data.userPreferences;
  }

  async updateUserPreferences(preferences: Partial<StorageData['userPreferences']>): Promise<void> {
    this.data.userPreferences = { ...this.data.userPreferences, ...preferences };
  }

  // User-specific data storage
  async saveUserData(userId: string, userData: UserProgress): Promise<void> {
    this.data.userData[userId] = userData;
    // In a real app, this would persist to AsyncStorage or SQLite
  }

  async getUserData(userId: string): Promise<UserProgress | null> {
    return this.data.userData[userId] || null;
  }

  async deleteUserData(userId: string): Promise<void> {
    delete this.data.userData[userId];
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    this.data = {
      bookmarkedJobs: [],
      recentSearches: [],
      offlineJobs: [],
      userData: {},
      userPreferences: {
        notifications: true,
        dataUsage: 'normal',
        language: 'en',
      },
    };
  }
}

export const storageService = new StorageService();