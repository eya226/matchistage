// Enhanced data service with real job integration and proper application tracking
import { realJobsService, RealJob } from './realJobsService';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  duration: string;
  match: number;
  logo: string;
  banner: string;
  postedTime: string;
  skills: string[];
  benefits: string[];
  description: string;
  teamSize: string;
  rating: number;
  source: string;
  requirements: string[];
  applicationDeadline: string;
  isBookmarked?: boolean;
  applyUrl?: string;
  remote?: boolean;
}

export interface Application {
  id: number;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  coverLetter: string;
  nextStep?: string;
  interviewDate?: string;
  source: string;
  applicationUrl?: string;
  notes?: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  title: string;
  location: string;
  university: string;
  major: string;
  skills: string[];
  experience: string[];
  achievements: string[];
  profileCompletion: number;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

// Mock applications storage
const mockApplications: Application[] = [];

// Mock user profile with Eya Hamdi data
const mockUserProfile: UserProfile = {
  id: 1,
  name: 'Eya Hamdi',
  email: 'eya.hamdi@example.com',
  title: 'Computer Science Student',
  location: 'Tunis, Tunisia',
  university: 'ESPRIT',
  major: 'Software Engineering',
  skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git', 'Node.js'],
  experience: [
    'Frontend Developer Intern at Local Startup (Summer 2023)',
    'Web Development Freelancer (2022-2023)',
    'University Programming Tutor (2023-Present)'
  ],
  achievements: ['Dean\'s List 2023', 'Hackathon Winner 2022', 'Programming Contest Finalist'],
  profileCompletion: 85,
  avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  coverImage: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
  bio: 'Passionate software engineering student with experience in full-stack development. Looking for internship opportunities to grow my skills and contribute to innovative projects.',
  linkedinUrl: 'https://linkedin.com/in/eya-hamdi',
  githubUrl: 'https://github.com/eya-hamdi',
  portfolioUrl: 'https://eya-hamdi.dev'
};

// Convert RealJob to Job format
function convertRealJobToJob(realJob: RealJob, index: number): Job {
  const timeAgo = calculateTimeAgo(realJob.postedDate);
  
  return {
    id: index + 1,
    title: realJob.title,
    company: realJob.company,
    location: realJob.location,
    salary: realJob.salary || 'Competitive',
    type: realJob.type,
    duration: realJob.duration || '3-6 months',
    match: realJob.match || 75,
    logo: realJob.logo || 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    banner: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    postedTime: timeAgo,
    skills: realJob.skills,
    benefits: realJob.benefits || ['Professional Development', 'Mentorship', 'Networking'],
    description: realJob.description,
    teamSize: realJob.companySize || '50-100',
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    source: realJob.source,
    requirements: realJob.requirements,
    applicationDeadline: realJob.deadline || 'March 31, 2024',
    isBookmarked: false,
    applyUrl: realJob.applyUrl,
    remote: realJob.remote
  };
}

function calculateTimeAgo(dateString: string): string {
  const now = new Date();
  const posted = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  
  return `${Math.floor(diffInWeeks / 4)} months ago`;
}

// Enhanced service functions
export const dataService = {
  // Jobs - Now using real data
  async getJobs(): Promise<Job[]> {
    try {
      const realJobs = await realJobsService.searchJobs({
        location: 'Tunisia',
        experienceLevel: 'internship'
      });
      
      return realJobs.map((realJob, index) => convertRealJobToJob(realJob, index));
    } catch (error) {
      console.error('Error fetching real jobs:', error);
      // Fallback to mock data if real service fails
      return [];
    }
  },

  async searchJobs(query: string, filters?: any): Promise<Job[]> {
    try {
      const realJobs = await realJobsService.searchJobs({
        keywords: query,
        location: filters?.location || 'Tunisia',
        remote: filters?.remote,
        source: filters?.sources
      });
      
      return realJobs.map((realJob, index) => convertRealJobToJob(realJob, index));
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  },

  async getJobById(id: number): Promise<Job | null> {
    const jobs = await this.getJobs();
    return jobs.find(job => job.id === id) || null;
  },

  async getTrendingJobs(): Promise<Job[]> {
    try {
      const trendingRealJobs = await realJobsService.getTrendingJobs();
      return trendingRealJobs.map((realJob, index) => convertRealJobToJob(realJob, index));
    } catch (error) {
      console.error('Error fetching trending jobs:', error);
      return [];
    }
  },

  async bookmarkJob(jobId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real app, this would save to backend
    console.log(`Job ${jobId} bookmarked`);
  },

  // Applications - Enhanced tracking
  async getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockApplications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  },

  async submitApplication(applicationData: Omit<Application, 'id' | 'lastUpdated'>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newApplication: Application = {
      ...applicationData,
      id: mockApplications.length + 1,
      lastUpdated: new Date().toISOString(),
    };
    
    mockApplications.push(newApplication);
    return newApplication;
  },

  async updateApplicationStatus(id: number, status: Application['status'], notes?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const application = mockApplications.find(app => app.id === id);
    if (application) {
      application.status = status;
      application.lastUpdated = new Date().toISOString();
      if (notes) application.notes = notes;
      
      // Set next steps based on status
      switch (status) {
        case 'reviewed':
          application.nextStep = 'Wait for interview invitation';
          break;
        case 'interview':
          application.nextStep = 'Prepare for interview';
          break;
        case 'accepted':
          application.nextStep = 'Complete onboarding process';
          break;
        case 'rejected':
          application.nextStep = 'Continue applying to other positions';
          break;
        default:
          application.nextStep = 'Application under review';
      }
    }
  },

  async getApplicationById(id: number): Promise<Application | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockApplications.find(app => app.id === id) || null;
  },

  async deleteApplication(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockApplications.findIndex(app => app.id === id);
    if (index > -1) {
      mockApplications.splice(index, 1);
    }
  },

  // Profile - Enhanced with Eya Hamdi data
  async getUserProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUserProfile;
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    Object.assign(mockUserProfile, updates);
    
    // Recalculate profile completion
    const fields = ['name', 'title', 'location', 'university', 'major', 'bio'];
    const completedFields = fields.filter(field => {
      const value = mockUserProfile[field as keyof UserProfile];
      return value && value.toString().trim().length > 0;
    });
    
    const skillsWeight = mockUserProfile.skills.length > 0 ? 1 : 0;
    const experienceWeight = mockUserProfile.experience.length > 0 ? 1 : 0;
    const linksWeight = (mockUserProfile.linkedinUrl || mockUserProfile.githubUrl || mockUserProfile.portfolioUrl) ? 1 : 0;
    
    mockUserProfile.profileCompletion = Math.round(
      ((completedFields.length + skillsWeight + experienceWeight + linksWeight) / (fields.length + 3)) * 100
    );
    
    return mockUserProfile;
  },

  // Analytics - Enhanced with real application data
  async getAnalytics(): Promise<{
    totalApplications: number;
    acceptedApplications: number;
    pendingApplications: number;
    reviewedApplications: number;
    rejectedApplications: number;
    interviewApplications: number;
    profileViews: number;
    responseRate: number;
    averageResponseTime: number;
    topSkillsMatched: string[];
    applicationsBySource: Record<string, number>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const totalApplications = mockApplications.length;
    const acceptedApplications = mockApplications.filter(app => app.status === 'accepted').length;
    const pendingApplications = mockApplications.filter(app => app.status === 'pending').length;
    const reviewedApplications = mockApplications.filter(app => app.status === 'reviewed').length;
    const rejectedApplications = mockApplications.filter(app => app.status === 'rejected').length;
    const interviewApplications = mockApplications.filter(app => app.status === 'interview').length;
    
    // Calculate application distribution by source
    const applicationsBySource: Record<string, number> = {};
    mockApplications.forEach(app => {
      applicationsBySource[app.source] = (applicationsBySource[app.source] || 0) + 1;
    });
    
    return {
      totalApplications,
      acceptedApplications,
      pendingApplications,
      reviewedApplications,
      rejectedApplications,
      interviewApplications,
      profileViews: 127, // Mock data
      responseRate: totalApplications > 0 ? Math.round(((acceptedApplications + interviewApplications) / totalApplications) * 100) : 0,
      averageResponseTime: 5, // days
      topSkillsMatched: ['JavaScript', 'React', 'Python', 'SQL', 'Git'],
      applicationsBySource
    };
  },

  // Job sources
  async getJobSources(): Promise<Array<{id: string, name: string, description: string, jobCount: number}>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const sources = realJobsService.getJobSources();
    
    // Add job counts (mock data)
    return sources.map(source => ({
      ...source,
      jobCount: Math.floor(Math.random() * 50) + 10
    }));
  }
};