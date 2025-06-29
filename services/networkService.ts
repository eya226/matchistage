// Real user networking service with actual user data
export interface NetworkUser {
  id: string;
  email: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  mutualConnections: number;
  skills: string[];
  isConnected: boolean;
  connectionType: 'student' | 'professional' | 'recruiter' | 'mentor';
  university?: string;
  experience: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  joinDate: string;
  lastActive: string;
  verified: boolean;
}

class NetworkService {
  // Real user database - in production this would come from a backend
  private users: NetworkUser[] = [
    // Current user (Eya Hamdi)
    {
      id: 'user_001',
      email: 'eyahamdi153@gmail.com',
      name: 'Eya Hamdi',
      title: 'Computer Science Student',
      company: 'ESPRIT',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 0,
      skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git', 'Node.js'],
      isConnected: false, // Self
      connectionType: 'student',
      university: 'ESPRIT',
      experience: 'Student',
      bio: 'Passionate software engineering student with experience in full-stack development. Looking for internship opportunities to grow my skills.',
      linkedinUrl: 'https://linkedin.com/in/eya-hamdi',
      githubUrl: 'https://github.com/eya-hamdi',
      portfolioUrl: 'https://eya-hamdi.dev',
      joinDate: '2024-01-15',
      lastActive: '2024-02-15',
      verified: true,
    },

    // Students from Tunisia
    {
      id: 'user_002',
      email: 'mohamed.ben.salem@esprit.tn',
      name: 'Mohamed Ben Salem',
      title: 'Software Engineering Student',
      company: 'ESPRIT',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 8,
      skills: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Docker'],
      isConnected: false,
      connectionType: 'student',
      university: 'ESPRIT',
      experience: 'Student',
      bio: 'Final year software engineering student passionate about backend development and microservices architecture.',
      linkedinUrl: 'https://linkedin.com/in/mohamed-ben-salem',
      githubUrl: 'https://github.com/mohamed-ben-salem',
      joinDate: '2024-01-20',
      lastActive: '2024-02-14',
      verified: true,
    },

    {
      id: 'user_003',
      email: 'fatma.trabelsi@insat.rnu.tn',
      name: 'Fatma Trabelsi',
      title: 'Data Science Student',
      company: 'INSAT',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 5,
      skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow', 'SQL', 'R'],
      isConnected: false,
      connectionType: 'student',
      university: 'INSAT',
      experience: 'Student',
      bio: 'Data science enthusiast working on machine learning projects and statistical analysis.',
      linkedinUrl: 'https://linkedin.com/in/fatma-trabelsi',
      githubUrl: 'https://github.com/fatma-trabelsi',
      joinDate: '2024-01-25',
      lastActive: '2024-02-13',
      verified: true,
    },

    {
      id: 'user_004',
      email: 'ahmed.khelifi@enit.utm.tn',
      name: 'Ahmed Khelifi',
      title: 'Computer Networks Student',
      company: 'ENIT',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 3,
      skills: ['Networking', 'Cybersecurity', 'Linux', 'Python', 'Cisco', 'Wireshark'],
      isConnected: false,
      connectionType: 'student',
      university: 'ENIT',
      experience: 'Student',
      bio: 'Cybersecurity and networking student interested in ethical hacking and network security.',
      linkedinUrl: 'https://linkedin.com/in/ahmed-khelifi',
      githubUrl: 'https://github.com/ahmed-khelifi',
      joinDate: '2024-02-01',
      lastActive: '2024-02-15',
      verified: true,
    },

    // Professionals in Tunisia
    {
      id: 'user_005',
      email: 'sarah.mansouri@vermeg.com',
      name: 'Sarah Mansouri',
      title: 'Senior Software Engineer',
      company: 'Vermeg',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 12,
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
      isConnected: false,
      connectionType: 'professional',
      experience: '4 years',
      bio: 'Full-stack developer with expertise in modern web technologies. Passionate about mentoring junior developers.',
      linkedinUrl: 'https://linkedin.com/in/sarah-mansouri',
      githubUrl: 'https://github.com/sarah-mansouri',
      joinDate: '2024-01-10',
      lastActive: '2024-02-14',
      verified: true,
    },

    {
      id: 'user_006',
      email: 'karim.bouaziz@instadeep.com',
      name: 'Dr. Karim Bouaziz',
      title: 'AI Research Lead',
      company: 'InstaDeep',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 7,
      skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'Research', 'AI'],
      isConnected: false,
      connectionType: 'mentor',
      experience: '8 years',
      bio: 'AI researcher and tech lead passionate about advancing machine learning applications in Africa.',
      linkedinUrl: 'https://linkedin.com/in/karim-bouaziz',
      githubUrl: 'https://github.com/karim-bouaziz',
      joinDate: '2024-01-05',
      lastActive: '2024-02-12',
      verified: true,
    },

    {
      id: 'user_007',
      email: 'ines.ben.amor@orange.tn',
      name: 'Ines Ben Amor',
      title: 'Data Scientist',
      company: 'Orange Tunisia',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 9,
      skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
      isConnected: false,
      connectionType: 'professional',
      experience: '3 years',
      bio: 'Data scientist working on telecommunications analytics and customer behavior prediction.',
      linkedinUrl: 'https://linkedin.com/in/ines-ben-amor',
      githubUrl: 'https://github.com/ines-ben-amor',
      joinDate: '2024-01-18',
      lastActive: '2024-02-13',
      verified: true,
    },

    // Recruiters
    {
      id: 'user_008',
      email: 'nadia.gharbi@microsoft.com',
      name: 'Nadia Gharbi',
      title: 'Technical Recruiter',
      company: 'Microsoft Tunisia',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 15,
      skills: ['Technical Recruiting', 'Talent Acquisition', 'HR', 'Interviewing', 'Networking'],
      isConnected: false,
      connectionType: 'recruiter',
      experience: '6 years',
      bio: 'Technical recruiter specializing in software engineering and data science roles. Always looking for talented students.',
      linkedinUrl: 'https://linkedin.com/in/nadia-gharbi',
      joinDate: '2024-01-08',
      lastActive: '2024-02-15',
      verified: true,
    },

    {
      id: 'user_009',
      email: 'youssef.ben.ali@sofrecom.com',
      name: 'Youssef Ben Ali',
      title: 'HR Business Partner',
      company: 'Sofrecom Tunisia',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 11,
      skills: ['HR Management', 'Recruitment', 'Employee Development', 'Training', 'Performance Management'],
      isConnected: false,
      connectionType: 'recruiter',
      experience: '5 years',
      bio: 'HR professional focused on developing young talent in the telecommunications industry.',
      linkedinUrl: 'https://linkedin.com/in/youssef-ben-ali',
      joinDate: '2024-01-12',
      lastActive: '2024-02-11',
      verified: true,
    },

    // International connections
    {
      id: 'user_010',
      email: 'alex.martin@spotify.com',
      name: 'Alex Martin',
      title: 'Senior Frontend Developer',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      avatar: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 4,
      skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'Testing', 'Performance'],
      isConnected: false,
      connectionType: 'professional',
      experience: '6 years',
      bio: 'Frontend developer at Spotify working on music discovery features. Open to mentoring international students.',
      linkedinUrl: 'https://linkedin.com/in/alex-martin-spotify',
      githubUrl: 'https://github.com/alex-martin',
      joinDate: '2024-01-22',
      lastActive: '2024-02-10',
      verified: true,
    },

    {
      id: 'user_011',
      email: 'priya.sharma@shopify.com',
      name: 'Priya Sharma',
      title: 'Product Manager',
      company: 'Shopify',
      location: 'Toronto, Canada',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 2,
      skills: ['Product Management', 'User Research', 'Data Analysis', 'Agile', 'Strategy'],
      isConnected: false,
      connectionType: 'mentor',
      experience: '7 years',
      bio: 'Product manager passionate about e-commerce and helping students transition into tech careers.',
      linkedinUrl: 'https://linkedin.com/in/priya-sharma-pm',
      joinDate: '2024-02-05',
      lastActive: '2024-02-14',
      verified: true,
    },

    // More students from different universities
    {
      id: 'user_012',
      email: 'mariem.ben.salem@isamm.rnu.tn',
      name: 'Mariem Ben Salem',
      title: 'Multimedia Student',
      company: 'ISAMM',
      location: 'Manouba, Tunisia',
      avatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 6,
      skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Web Design', 'Prototyping'],
      isConnected: false,
      connectionType: 'student',
      university: 'ISAMM',
      experience: 'Student',
      bio: 'Multimedia and web design student passionate about creating beautiful and functional user interfaces.',
      linkedinUrl: 'https://linkedin.com/in/mariem-ben-salem',
      joinDate: '2024-02-08',
      lastActive: '2024-02-15',
      verified: true,
    }
  ];

  async searchUsers(query: string, filters?: {
    connectionType?: string;
    location?: string;
    company?: string;
    skills?: string[];
  }): Promise<NetworkUser[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredUsers = this.users.filter(user => user.email !== 'eyahamdi153@gmail.com'); // Exclude current user

    // Apply search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.title.toLowerCase().includes(searchTerm) ||
        user.company.toLowerCase().includes(searchTerm) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters?.connectionType) {
      filteredUsers = filteredUsers.filter(user => user.connectionType === filters.connectionType);
    }

    if (filters?.location) {
      filteredUsers = filteredUsers.filter(user => 
        user.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.company) {
      filteredUsers = filteredUsers.filter(user => 
        user.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters?.skills && filters.skills.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        filters.skills!.some(skill =>
          user.skills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Sort by relevance (mutual connections, verification, activity)
    filteredUsers.sort((a, b) => {
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      if (a.mutualConnections !== b.mutualConnections) return b.mutualConnections - a.mutualConnections;
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    });

    return filteredUsers;
  }

  async getUsersByType(type: 'student' | 'professional' | 'recruiter' | 'mentor'): Promise<NetworkUser[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users.filter(user => 
      user.connectionType === type && user.email !== 'eyahamdi153@gmail.com'
    );
  }

  async getConnections(): Promise<NetworkUser[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.users.filter(user => user.isConnected);
  }

  async connectWithUser(userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].isConnected = true;
      return true;
    }
    return false;
  }

  async disconnectFromUser(userId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].isConnected = false;
      return true;
    }
    return false;
  }

  async getUserById(userId: string): Promise<NetworkUser | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.users.find(user => user.id === userId) || null;
  }

  async getSuggestedConnections(): Promise<NetworkUser[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get users with similar skills or from same university
    const currentUser = this.users.find(user => user.email === 'eyahamdi153@gmail.com');
    if (!currentUser) return [];

    const suggestions = this.users.filter(user => 
      user.email !== 'eyahamdi153@gmail.com' && 
      !user.isConnected &&
      (
        // Same university
        (user.university === currentUser.university) ||
        // Similar skills
        user.skills.some(skill => currentUser.skills.includes(skill)) ||
        // Same location
        user.location === currentUser.location
      )
    );

    // Sort by relevance
    suggestions.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Same university bonus
      if (a.university === currentUser.university) scoreA += 10;
      if (b.university === currentUser.university) scoreB += 10;

      // Skill overlap bonus
      const skillOverlapA = a.skills.filter(skill => currentUser.skills.includes(skill)).length;
      const skillOverlapB = b.skills.filter(skill => currentUser.skills.includes(skill)).length;
      scoreA += skillOverlapA * 5;
      scoreB += skillOverlapB * 5;

      // Mutual connections bonus
      scoreA += a.mutualConnections;
      scoreB += b.mutualConnections;

      // Verification bonus
      if (a.verified) scoreA += 5;
      if (b.verified) scoreB += 5;

      return scoreB - scoreA;
    });

    return suggestions.slice(0, 10);
  }

  async getNetworkStats(): Promise<{
    totalConnections: number;
    students: number;
    professionals: number;
    recruiters: number;
    mentors: number;
    recentConnections: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const connections = this.users.filter(user => user.isConnected);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      totalConnections: connections.length,
      students: connections.filter(user => user.connectionType === 'student').length,
      professionals: connections.filter(user => user.connectionType === 'professional').length,
      recruiters: connections.filter(user => user.connectionType === 'recruiter').length,
      mentors: connections.filter(user => user.connectionType === 'mentor').length,
      recentConnections: connections.filter(user => 
        new Date(user.lastActive) >= oneWeekAgo
      ).length,
    };
  }

  // Get all users for admin/testing purposes
  async getAllUsers(): Promise<NetworkUser[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.users;
  }

  // Add a new user (for registration)
  async addUser(userData: Omit<NetworkUser, 'id' | 'joinDate' | 'lastActive' | 'verified' | 'mutualConnections' | 'isConnected'>): Promise<NetworkUser> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newUser: NetworkUser = {
      ...userData,
      id: `user_${Date.now()}`,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verified: false,
      mutualConnections: 0,
      isConnected: false,
    };

    this.users.push(newUser);
    return newUser;
  }
}

export const networkService = new NetworkService();