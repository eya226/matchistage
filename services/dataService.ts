// Mock data service - In production, this would connect to your backend API
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
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  coverLetter: string;
  nextStep?: string;
  interviewDate?: string;
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
}

// Mock data
const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Microsoft Tunisia',
    location: 'Tunis, Tunisia',
    salary: '1500-2000 TND',
    type: 'Summer Internship',
    duration: '3 months',
    match: 95,
    logo: 'https://images.pexels.com/photos/6615068/pexels-photo-6615068.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    banner: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    postedTime: '2 hours ago',
    skills: ['React', 'TypeScript', 'Node.js', 'Azure'],
    benefits: ['Health Insurance', 'Flexible Hours', 'Mentorship', 'Full-time Offer Potential'],
    description: 'Join our engineering team to work on cutting-edge cloud solutions. You\'ll collaborate with senior engineers on real projects that impact millions of users.',
    teamSize: '50-100',
    rating: 4.8,
    source: 'LinkedIn',
    requirements: ['Computer Science student', '3rd year or above', 'Strong programming skills'],
    applicationDeadline: 'March 15, 2024',
    isBookmarked: false,
  },
  {
    id: 2,
    title: 'Data Science Intern',
    company: 'Orange Tunisia',
    location: 'Tunis, Tunisia',
    salary: '1200-1800 TND',
    type: 'Research Internship',
    duration: '6 months',
    match: 87,
    logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    banner: 'https://images.pexels.com/photos/3182755/pexels-photo-3182755.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    postedTime: '4 hours ago',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    benefits: ['Training Programs', 'Industry Exposure', 'Research Publications'],
    description: 'Work with our data science team to analyze customer behavior and develop predictive models for telecommunications.',
    teamSize: '10-25',
    rating: 4.6,
    source: 'Indeed',
    requirements: ['Statistics/Data Science background', 'Python proficiency', 'Final year student'],
    applicationDeadline: 'March 20, 2024',
    isBookmarked: true,
  },
];

const mockApplications: Application[] = [];

const mockUserProfile: UserProfile = {
  id: 1,
  name: 'New User',
  email: 'user@example.com',
  title: '',
  location: '',
  university: '',
  major: '',
  skills: [],
  experience: [],
  achievements: [],
  profileCompletion: 15,
};

// Service functions
export const dataService = {
  // Jobs
  async getJobs(): Promise<Job[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockJobs;
  },

  async getJobById(id: number): Promise<Job | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockJobs.find(job => job.id === id) || null;
  },

  async bookmarkJob(jobId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const job = mockJobs.find(j => j.id === jobId);
    if (job) {
      job.isBookmarked = !job.isBookmarked;
    }
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockApplications;
  },

  async submitApplication(applicationData: Omit<Application, 'id'>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newApplication: Application = {
      ...applicationData,
      id: mockApplications.length + 1,
    };
    mockApplications.push(newApplication);
    return newApplication;
  },

  async updateApplicationStatus(id: number, status: Application['status']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const application = mockApplications.find(app => app.id === id);
    if (application) {
      application.status = status;
    }
  },

  // Profile
  async getUserProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUserProfile;
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    Object.assign(mockUserProfile, updates);
    
    // Recalculate profile completion
    const fields = ['name', 'title', 'location', 'university', 'major'];
    const completedFields = fields.filter(field => mockUserProfile[field as keyof UserProfile]);
    const skillsWeight = mockUserProfile.skills.length > 0 ? 1 : 0;
    const experienceWeight = mockUserProfile.experience.length > 0 ? 1 : 0;
    
    mockUserProfile.profileCompletion = Math.round(
      ((completedFields.length + skillsWeight + experienceWeight) / (fields.length + 2)) * 100
    );
    
    return mockUserProfile;
  },

  // Analytics
  async getAnalytics(): Promise<{
    totalApplications: number;
    acceptedApplications: number;
    pendingApplications: number;
    profileViews: number;
    responseRate: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const totalApplications = mockApplications.length;
    const acceptedApplications = mockApplications.filter(app => app.status === 'accepted').length;
    const pendingApplications = mockApplications.filter(app => app.status === 'pending').length;
    
    return {
      totalApplications,
      acceptedApplications,
      pendingApplications,
      profileViews: Math.floor(Math.random() * 50) + 10,
      responseRate: totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0,
    };
  },
};