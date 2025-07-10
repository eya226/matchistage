// User-specific data service with persistent storage
import { storageService } from './storageService';

export interface UserProgress {
  userId: string;
  profileCompletion: number;
  skillsProgress: Record<string, {
    level: 'beginner' | 'intermediate' | 'advanced';
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
  }>;
  applications: {
    total: number;
    pending: number;
    reviewed: number;
    interview: number;
    accepted: number;
    rejected: number;
    bySource: Record<string, number>;
  };
  achievements: {
    id: string;
    type: 'achievement' | 'skill' | 'milestone' | 'social';
    title: string;
    description: string;
    earnedAt: string;
    progress?: number;
  }[];
  networkStats: {
    totalConnections: number;
    connectionsByType: Record<string, number>;
    recentConnections: number;
  };
  learningStats: {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lessonsCompleted: number;
    coursesCompleted: number;
    lastLearningActivity: string;
  };
  profileData: {
    name: string;
    email: string;
    title?: string;
    bio?: string;
    location: string;
    university: string;
    major: string;
    graduationYear?: string;
    skills: string[];
    experience: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    avatar?: string;
    coverImage?: string;
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    remote: boolean;
    notifications: boolean;
    dataUsage: 'low' | 'normal' | 'high';
    language: 'en' | 'ar';
  };
  analytics: {
    profileViews: number;
    searchAppearances: number;
    responseRate: number;
    averageResponseTime: number;
    topSkillsMatched: string[];
    lastUpdated: string;
  };
}

class UserDataService {
  private currentUserId: string | null = null;
  private userData: Map<string, UserProgress> = new Map();

  // Initialize user session
  async initializeUser(userId: string, email: string): Promise<void> {
    this.currentUserId = userId;
    
    // Load existing user data or create new
    const existingData = await storageService.getUserData(userId);
    if (existingData) {
      this.userData.set(userId, existingData);
    } else {
      // Create new user with default data
      const newUserData: UserProgress = {
        userId,
        profileCompletion: 15, // Start with basic info only
        skillsProgress: {},
        applications: {
          total: 0,
          pending: 0,
          reviewed: 0,
          interview: 0,
          accepted: 0,
          rejected: 0,
          bySource: {},
        },
        achievements: [
          {
            id: 'welcome',
            type: 'achievement',
            title: 'Welcome!',
            description: 'Joined MatchiStage',
            earnedAt: new Date().toISOString(),
          }
        ],
        networkStats: {
          totalConnections: 0,
          connectionsByType: {},
          recentConnections: 0,
        },
        learningStats: {
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          coursesCompleted: 0,
          lastLearningActivity: new Date().toISOString(),
        },
        profileData: {
          name: '',
          email,
          location: '',
          university: '',
          major: '',
          skills: [],
          experience: [],
        },
        preferences: {
          jobTypes: [],
          locations: [],
          remote: false,
          notifications: true,
          dataUsage: 'normal',
          language: 'en',
        },
        analytics: {
          profileViews: 0,
          searchAppearances: 0,
          responseRate: 0,
          averageResponseTime: 0,
          topSkillsMatched: [],
          lastUpdated: new Date().toISOString(),
        },
      };
      
      this.userData.set(userId, newUserData);
      await this.saveUserData();
    }
  }

  // Get current user data
  getCurrentUserData(): UserProgress | null {
    if (!this.currentUserId) return null;
    return this.userData.get(this.currentUserId) || null;
  }

  // Update profile data and recalculate completion
  async updateProfile(updates: Partial<UserProgress['profileData']>): Promise<UserProgress> {
    if (!this.currentUserId) throw new Error('No user logged in');
    
    const userData = this.userData.get(this.currentUserId)!;
    userData.profileData = { ...userData.profileData, ...updates };
    
    // Recalculate profile completion
    userData.profileCompletion = this.calculateProfileCompletion(userData);
    
    // Check for achievements
    await this.checkProfileAchievements(userData);
    
    await this.saveUserData();
    return userData;
  }

  // Add skill progress
  async updateSkillProgress(skillId: string, progress: number, completedLessons: number): Promise<void> {
    if (!this.currentUserId) throw new Error('No user logged in');
    
    const userData = this.userData.get(this.currentUserId)!;
    
    if (!userData.skillsProgress[skillId]) {
      userData.skillsProgress[skillId] = {
        level: 'beginner',
        progress: 0,
        completedLessons: 0,
        totalLessons: 20, // Default
        lastAccessed: new Date().toISOString(),
      };
    }
    
    const skillData = userData.skillsProgress[skillId];
    const oldProgress = skillData.progress;
    
    skillData.progress = Math.max(skillData.progress, progress);
    skillData.completedLessons = Math.max(skillData.completedLessons, completedLessons);
    skillData.lastAccessed = new Date().toISOString();
    
    // Update level based on progress
    if (skillData.progress >= 80) skillData.level = 'advanced';
    else if (skillData.progress >= 40) skillData.level = 'intermediate';
    
    // Add XP for progress
    const xpGained = Math.floor((skillData.progress - oldProgress) * 2);
    userData.learningStats.totalXP += xpGained;
    userData.learningStats.lessonsCompleted += (completedLessons - skillData.completedLessons);
    
    // Update level based on XP
    userData.learningStats.level = Math.floor(userData.learningStats.totalXP / 500) + 1;
    
    // Update streak
    const today = new Date().toDateString();
    const lastActivity = new Date(userData.learningStats.lastLearningActivity).toDateString();
    
    if (today !== lastActivity) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivity === yesterday.toDateString()) {
        userData.learningStats.currentStreak += 1;
      } else {
        userData.learningStats.currentStreak = 1;
      }
      
      userData.learningStats.longestStreak = Math.max(
        userData.learningStats.longestStreak,
        userData.learningStats.currentStreak
      );
      
      userData.learningStats.lastLearningActivity = new Date().toISOString();
    }
    
    // Check for skill achievements
    await this.checkSkillAchievements(userData, skillId);
    
    await this.saveUserData();
  }

  // Track application submission
  async addApplication(applicationData: {
    jobId: string;
    jobTitle: string;
    company: string;
    source: string;
    status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  }): Promise<void> {
    if (!this.currentUserId) throw new Error('No user logged in');
    
    const userData = this.userData.get(this.currentUserId)!;
    
    userData.applications.total += 1;
    userData.applications[applicationData.status] += 1;
    userData.applications.bySource[applicationData.source] = 
      (userData.applications.bySource[applicationData.source] || 0) + 1;
    
    // Check for application achievements
    await this.checkApplicationAchievements(userData);
    
    await this.saveUserData();
  }

  // Update application status
  async updateApplicationStatus(
    oldStatus: string, 
    newStatus: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected'
  ): Promise<void> {
    if (!this.currentUserId) throw new Error('No user logged in');
    
    const userData = this.userData.get(this.currentUserId)!;
    
    // Decrease old status count
    if (oldStatus in userData.applications) {
      userData.applications[oldStatus as keyof typeof userData.applications] -= 1;
    }
    
    // Increase new status count
    userData.applications[newStatus] += 1;
    
    // Update analytics
    userData.analytics.responseRate = userData.applications.total > 0 
      ? Math.round(((userData.applications.accepted + userData.applications.interview) / userData.applications.total) * 100)
      : 0;
    
    userData.analytics.lastUpdated = new Date().toISOString();
    
    await this.saveUserData();
  }

  // Add network connection
  async addConnection(connectionType: string): Promise<void> {
    if (!this.currentUserId) throw new Error('No user logged in');
    
    const userData = this.userData.get(this.currentUserId)!;
    
    userData.networkStats.totalConnections += 1;
    userData.networkStats.connectionsByType[connectionType] = 
      (userData.networkStats.connectionsByType[connectionType] || 0) + 1;
    
    // Check if connection was made in last week
    userData.networkStats.recentConnections += 1;
    
    // Check for networking achievements
    await this.checkNetworkAchievements(userData);
    
    await this.saveUserData();
  }

  // Increment profile views
  async incrementProfileViews(): Promise<void> {
    if (!this.currentUserId) throw new Error('No user logged in');
    
    const userData = this.userData.get(this.currentUserId)!;
    userData.analytics.profileViews += 1;
    userData.analytics.lastUpdated = new Date().toISOString();
    
    await this.saveUserData();
  }

  // Calculate profile completion percentage
  private calculateProfileCompletion(userData: UserProgress): number {
    const profile = userData.profileData;
    let completed = 0;
    let total = 0;
    
    // Basic info (40% weight)
    const basicFields = ['name', 'email', 'location', 'university', 'major'];
    basicFields.forEach(field => {
      total += 8;
      if (profile[field as keyof typeof profile] && 
          String(profile[field as keyof typeof profile]).trim()) {
        completed += 8;
      }
    });
    
    // Bio (10% weight)
    total += 10;
    if (profile.bio && profile.bio.trim().length > 20) {
      completed += 10;
    }
    
    // Skills (20% weight)
    total += 20;
    if (profile.skills.length >= 5) {
      completed += 20;
    } else if (profile.skills.length > 0) {
      completed += (profile.skills.length / 5) * 20;
    }
    
    // Experience (15% weight)
    total += 15;
    if (profile.experience.length >= 2) {
      completed += 15;
    } else if (profile.experience.length > 0) {
      completed += (profile.experience.length / 2) * 15;
    }
    
    // Social links (15% weight)
    total += 15;
    const links = [profile.linkedinUrl, profile.githubUrl, profile.portfolioUrl];
    const validLinks = links.filter(link => link && link.trim()).length;
    completed += (validLinks / 3) * 15;
    
    return Math.round((completed / total) * 100);
  }

  // Achievement checking methods
  private async checkProfileAchievements(userData: UserProgress): Promise<void> {
    const achievements = [];
    
    if (userData.profileCompletion >= 50 && !this.hasAchievement(userData, 'profile-50')) {
      achievements.push({
        id: 'profile-50',
        type: 'milestone' as const,
        title: 'Profile Builder',
        description: '50% profile completed',
        earnedAt: new Date().toISOString(),
      });
    }
    
    if (userData.profileCompletion >= 90 && !this.hasAchievement(userData, 'profile-90')) {
      achievements.push({
        id: 'profile-90',
        type: 'achievement' as const,
        title: 'Profile Master',
        description: '90% profile completed',
        earnedAt: new Date().toISOString(),
      });
    }
    
    if (userData.profileData.skills.length >= 5 && !this.hasAchievement(userData, 'skills-5')) {
      achievements.push({
        id: 'skills-5',
        type: 'skill' as const,
        title: 'Skill Collector',
        description: 'Added 5 skills',
        earnedAt: new Date().toISOString(),
      });
    }
    
    userData.achievements.push(...achievements);
  }

  private async checkSkillAchievements(userData: UserProgress, skillId: string): Promise<void> {
    const skillData = userData.skillsProgress[skillId];
    const achievements = [];
    
    if (skillData.progress >= 100 && !this.hasAchievement(userData, `skill-complete-${skillId}`)) {
      achievements.push({
        id: `skill-complete-${skillId}`,
        type: 'skill' as const,
        title: 'Skill Master',
        description: `Completed ${skillId}`,
        earnedAt: new Date().toISOString(),
      });
    }
    
    if (userData.learningStats.currentStreak >= 7 && !this.hasAchievement(userData, 'streak-7')) {
      achievements.push({
        id: 'streak-7',
        type: 'achievement' as const,
        title: 'Week Warrior',
        description: '7 day learning streak',
        earnedAt: new Date().toISOString(),
      });
    }
    
    userData.achievements.push(...achievements);
  }

  private async checkApplicationAchievements(userData: UserProgress): Promise<void> {
    const achievements = [];
    
    if (userData.applications.total === 1 && !this.hasAchievement(userData, 'first-app')) {
      achievements.push({
        id: 'first-app',
        type: 'milestone' as const,
        title: 'First Step',
        description: 'First application submitted',
        earnedAt: new Date().toISOString(),
      });
    }
    
    if (userData.applications.total >= 10 && !this.hasAchievement(userData, 'app-10')) {
      achievements.push({
        id: 'app-10',
        type: 'achievement' as const,
        title: 'Job Hunter',
        description: '10 applications submitted',
        earnedAt: new Date().toISOString(),
      });
    }
    
    if (userData.applications.accepted >= 1 && !this.hasAchievement(userData, 'first-accept')) {
      achievements.push({
        id: 'first-accept',
        type: 'achievement' as const,
        title: 'Success!',
        description: 'First application accepted',
        earnedAt: new Date().toISOString(),
      });
    }
    
    userData.achievements.push(...achievements);
  }

  private async checkNetworkAchievements(userData: UserProgress): Promise<void> {
    const achievements = [];
    
    if (userData.networkStats.totalConnections >= 5 && !this.hasAchievement(userData, 'network-5')) {
      achievements.push({
        id: 'network-5',
        type: 'social' as const,
        title: 'Networker',
        description: '5 connections made',
        earnedAt: new Date().toISOString(),
      });
    }
    
    if (userData.networkStats.totalConnections >= 25 && !this.hasAchievement(userData, 'network-25')) {
      achievements.push({
        id: 'network-25',
        type: 'social' as const,
        title: 'Social Butterfly',
        description: '25 connections made',
        earnedAt: new Date().toISOString(),
      });
    }
    
    userData.achievements.push(...achievements);
  }

  private hasAchievement(userData: UserProgress, achievementId: string): boolean {
    return userData.achievements.some(achievement => achievement.id === achievementId);
  }

  // Save user data to storage
  private async saveUserData(): Promise<void> {
    if (!this.currentUserId) return;
    
    const userData = this.userData.get(this.currentUserId);
    if (userData) {
      await storageService.saveUserData(this.currentUserId, userData);
    }
  }

  // Get analytics for current user
  getAnalytics() {
    const userData = this.getCurrentUserData();
    if (!userData) return null;
    
    return {
      totalApplications: userData.applications.total,
      acceptedApplications: userData.applications.accepted,
      pendingApplications: userData.applications.pending,
      reviewedApplications: userData.applications.reviewed,
      rejectedApplications: userData.applications.rejected,
      interviewApplications: userData.applications.interview,
      profileViews: userData.analytics.profileViews,
      responseRate: userData.analytics.responseRate,
      averageResponseTime: userData.analytics.averageResponseTime,
      topSkillsMatched: userData.analytics.topSkillsMatched,
      applicationsBySource: userData.applications.bySource,
    };
  }

  // Get user profile for current user
  getUserProfile() {
    const userData = this.getCurrentUserData();
    if (!userData) return null;
    
    return {
      id: 1,
      name: userData.profileData.name,
      email: userData.profileData.email,
      title: userData.profileData.title || 'Student',
      location: userData.profileData.location,
      university: userData.profileData.university,
      major: userData.profileData.major,
      skills: userData.profileData.skills,
      experience: userData.profileData.experience,
      achievements: userData.achievements.map(a => a.title),
      profileCompletion: userData.profileCompletion,
      avatar: userData.profileData.avatar,
      coverImage: userData.profileData.coverImage,
      bio: userData.profileData.bio,
      linkedinUrl: userData.profileData.linkedinUrl,
      githubUrl: userData.profileData.githubUrl,
      portfolioUrl: userData.profileData.portfolioUrl,
    };
  }

  // Get learning progress for skills screen
  getSkillsProgress() {
    const userData = this.getCurrentUserData();
    if (!userData) return null;
    
    return {
      skillsProgress: userData.skillsProgress,
      learningStats: userData.learningStats,
      achievements: userData.achievements,
    };
  }

  // Clear all user data (for logout)
  async clearUserData(): Promise<void> {
    this.currentUserId = null;
    this.userData.clear();
  }
}

export const userDataService = new UserDataService();