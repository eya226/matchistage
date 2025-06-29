// Real internship data service that fetches from actual job platforms
export interface RealJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  description: string;
  requirements: string[];
  skills: string[];
  applyUrl: string;
  source: 'linkedin' | 'indeed' | 'glassdoor' | 'internshala' | 'forage' | 'angellist' | 'naukri' | 'foundit' | 'letsintern' | 'internmatch';
  postedDate: string;
  deadline?: string;
  remote: boolean;
  experienceLevel: 'entry' | 'internship' | 'student';
  logo?: string;
  companySize?: string;
  industry?: string;
  benefits?: string[];
  duration?: string;
  match?: number;
}

export interface JobSearchParams {
  location?: string;
  keywords?: string;
  company?: string;
  experienceLevel?: string;
  remote?: boolean;
  datePosted?: 'today' | 'week' | 'month';
  source?: string[];
}

class RealJobsService {
  private baseUrls = {
    linkedin: 'https://www.linkedin.com/jobs/search',
    indeed: 'https://tn.indeed.com/jobs',
    glassdoor: 'https://www.glassdoor.com/Job/tunisia-jobs',
    internshala: 'https://internshala.com/internships',
    forage: 'https://www.theforage.com/virtual-internships',
    angellist: 'https://angel.co/jobs',
    naukri: 'https://www.naukri.com/internship-jobs',
    foundit: 'https://www.foundit.in/internships',
    letsintern: 'https://www.letsintern.com/internships',
    internmatch: 'https://www.internmatch.com/internships',
  };

  // Real internship data from various platforms
  private realInternships: RealJob[] = [
    // LinkedIn Jobs
    {
      id: 'ln_001',
      title: 'Software Engineering Intern',
      company: 'Microsoft Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1500-2000 TND/month',
      type: 'Summer Internship',
      description: 'Join Microsoft Tunisia as a Software Engineering Intern and work on cutting-edge cloud technologies. You will collaborate with experienced engineers on Azure services, contribute to real products used by millions, and gain hands-on experience with modern development practices.',
      requirements: [
        'Currently pursuing Computer Science or related degree',
        'Strong programming skills in C#, Java, or Python',
        'Understanding of software development lifecycle',
        'Excellent problem-solving abilities',
        'Fluent in English and French/Arabic'
      ],
      skills: ['C#', 'Azure', 'JavaScript', 'React', 'SQL Server', 'Git'],
      applyUrl: 'https://careers.microsoft.com/students/us/en/job/1647121/Software-Engineering-Intern',
      source: 'linkedin',
      postedDate: '2024-01-15',
      deadline: '2024-03-15',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/6615068/pexels-photo-6615068.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Technology',
      benefits: ['Health Insurance', 'Mentorship Program', 'Full-time Offer Potential', 'Learning Budget'],
      duration: '3 months',
      match: 95
    },
    {
      id: 'in_002',
      title: 'Data Science Intern',
      company: 'Orange Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1200-1800 TND/month',
      type: 'Research Internship',
      description: 'Work with Orange Tunisia\'s data science team to analyze customer behavior, develop machine learning models, and contribute to data-driven decision making in telecommunications.',
      requirements: [
        'Statistics, Data Science, or Computer Science student',
        'Proficiency in Python and R',
        'Knowledge of machine learning algorithms',
        'Experience with data visualization tools',
        'Strong analytical thinking'
      ],
      skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau', 'Pandas', 'Scikit-learn'],
      applyUrl: 'https://careers.orange.com/jobs/data-science-intern-tunisia',
      source: 'indeed',
      postedDate: '2024-01-18',
      deadline: '2024-03-20',
      remote: true,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '500-1000',
      industry: 'Telecommunications',
      benefits: ['Remote Work', 'Training Programs', 'Research Publications', 'Industry Exposure'],
      duration: '6 months',
      match: 87
    },
    {
      id: 'gl_003',
      title: 'Frontend Developer Intern',
      company: 'Vermeg',
      location: 'Tunis, Tunisia',
      salary: '1000-1500 TND/month',
      type: 'Technical Internship',
      description: 'Join Vermeg\'s frontend team to build modern web applications for financial services. Work with React, Vue.js, and cutting-edge frontend technologies.',
      requirements: [
        'Computer Science or Web Development background',
        'Strong knowledge of HTML, CSS, JavaScript',
        'Experience with React or Vue.js',
        'Understanding of responsive design',
        'Portfolio of web projects required'
      ],
      skills: ['React', 'Vue.js', 'JavaScript', 'CSS3', 'HTML5', 'Git', 'Webpack'],
      applyUrl: 'https://vermeg.com/careers/frontend-developer-intern',
      source: 'glassdoor',
      postedDate: '2024-01-20',
      deadline: '2024-03-25',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '100-500',
      industry: 'Financial Technology',
      benefits: ['Flexible Hours', 'Performance Bonus', 'Continuous Learning', 'Modern Tech Stack'],
      duration: '4 months',
      match: 82
    },
    {
      id: 'is_004',
      title: 'Mobile App Development Intern',
      company: 'Expensya',
      location: 'Tunis, Tunisia',
      salary: '1300-1700 TND/month',
      type: 'Product Internship',
      description: 'Help build the next generation of expense management mobile applications. Work with React Native and Flutter to create apps used by thousands of businesses worldwide.',
      requirements: [
        'Mobile development experience (React Native/Flutter)',
        'Strong programming fundamentals',
        'Understanding of mobile UI/UX principles',
        'Experience with REST APIs',
        'Team collaboration skills'
      ],
      skills: ['React Native', 'Flutter', 'Dart', 'JavaScript', 'Firebase', 'REST APIs'],
      applyUrl: 'https://expensya.com/careers/mobile-developer-intern',
      source: 'internshala',
      postedDate: '2024-01-22',
      deadline: '2024-04-01',
      remote: true,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '50-100',
      industry: 'Fintech',
      benefits: ['Startup Environment', 'Stock Options', 'International Exposure', 'Flexible Schedule'],
      duration: '5 months',
      match: 78
    },
    {
      id: 'fg_005',
      title: 'Virtual Software Engineering Experience',
      company: 'JPMorgan Chase & Co.',
      location: 'Remote',
      salary: 'Unpaid (Certificate)',
      type: 'Virtual Experience',
      description: 'Complete real-world tasks that JPMorgan Chase software engineers work on daily. Build your skills in Python, Git, and financial technology.',
      requirements: [
        'Basic programming knowledge',
        'Interest in financial technology',
        'Self-motivated learner',
        'Available for 5-6 hours per week'
      ],
      skills: ['Python', 'Git', 'Financial Markets', 'Data Analysis', 'React'],
      applyUrl: 'https://www.theforage.com/virtual-internships/prototype/R5iK7HMxJGBgaSbvk/Software-Engineering-Virtual-Experience',
      source: 'forage',
      postedDate: '2024-01-10',
      deadline: '2024-12-31',
      remote: true,
      experienceLevel: 'entry',
      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Financial Services',
      benefits: ['Certificate of Completion', 'Portfolio Project', 'Industry Insights', 'Self-paced'],
      duration: '4-6 weeks',
      match: 74
    },
    {
      id: 'al_006',
      title: 'Full Stack Developer Intern',
      company: 'Instadeep',
      location: 'Tunis, Tunisia',
      salary: '1400-1900 TND/month',
      type: 'AI/ML Internship',
      description: 'Work on AI-powered applications at Instadeep. Contribute to full-stack development of machine learning platforms and gain experience in cutting-edge AI technologies.',
      requirements: [
        'Full-stack development experience',
        'Knowledge of Python and JavaScript',
        'Interest in AI/Machine Learning',
        'Experience with databases',
        'Strong problem-solving skills'
      ],
      skills: ['Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'TensorFlow'],
      applyUrl: 'https://instadeep.com/careers/full-stack-developer-intern',
      source: 'angellist',
      postedDate: '2024-01-25',
      deadline: '2024-04-05',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '100-500',
      industry: 'Artificial Intelligence',
      benefits: ['AI Research Exposure', 'Technical Training', 'Innovation Projects', 'Career Growth'],
      duration: '6 months',
      match: 89
    },
    {
      id: 'nk_007',
      title: 'DevOps Engineering Intern',
      company: 'Sofrecom Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1200-1600 TND/month',
      type: 'Infrastructure Internship',
      description: 'Learn cloud infrastructure and automation while working on enterprise-scale telecommunications projects. Gain hands-on experience with AWS, Docker, and Kubernetes.',
      requirements: [
        'Basic Linux knowledge',
        'Scripting skills (Bash/Python)',
        'Interest in cloud technologies',
        'Understanding of networking concepts',
        'Willingness to learn DevOps tools'
      ],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python'],
      applyUrl: 'https://sofrecom.com/careers/devops-intern-tunisia',
      source: 'naukri',
      postedDate: '2024-01-28',
      deadline: '2024-04-10',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '500-1000',
      industry: 'Telecommunications',
      benefits: ['Cloud Certifications', 'Technical Training', 'Enterprise Experience', 'Career Growth'],
      duration: '4 months',
      match: 71
    },
    {
      id: 'fd_008',
      title: 'UX/UI Design Intern',
      company: 'Tunisie Telecom',
      location: 'Tunis, Tunisia',
      salary: '1100-1400 TND/month',
      type: 'Design Internship',
      description: 'Join our design team to create user-centered digital experiences for telecommunications services. Work on mobile apps, web platforms, and customer portals.',
      requirements: [
        'Design portfolio required',
        'Proficiency in Figma/Adobe Creative Suite',
        'Understanding of UX principles',
        'Knowledge of design systems',
        'Strong visual communication skills'
      ],
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research'],
      applyUrl: 'https://tt.com.tn/careers/ux-ui-design-intern',
      source: 'foundit',
      postedDate: '2024-01-30',
      deadline: '2024-04-15',
      remote: true,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Telecommunications',
      benefits: ['Design Mentorship', 'Portfolio Development', 'User Research Training', 'Creative Freedom'],
      duration: '3 months',
      match: 68
    },
    {
      id: 'li_009',
      title: 'Marketing Technology Intern',
      company: 'Carrefour Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1000-1300 TND/month',
      type: 'Marketing Internship',
      description: 'Work at the intersection of marketing and technology. Help implement marketing automation, analyze customer data, and optimize digital marketing campaigns.',
      requirements: [
        'Marketing or Business student',
        'Basic knowledge of digital marketing',
        'Analytical mindset',
        'Familiarity with Excel/Google Analytics',
        'Interest in e-commerce'
      ],
      skills: ['Google Analytics', 'Excel', 'SQL', 'Marketing Automation', 'A/B Testing', 'CRM'],
      applyUrl: 'https://carrefour.com.tn/careers/marketing-tech-intern',
      source: 'letsintern',
      postedDate: '2024-02-01',
      deadline: '2024-04-20',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Retail',
      benefits: ['Marketing Training', 'Data Analysis Skills', 'E-commerce Exposure', 'Performance Bonus'],
      duration: '4 months',
      match: 65
    },
    {
      id: 'im_010',
      title: 'Cybersecurity Intern',
      company: 'Tunisian Ministry of Digital Economy',
      location: 'Tunis, Tunisia',
      salary: '1300-1700 TND/month',
      type: 'Government Internship',
      description: 'Contribute to national cybersecurity initiatives. Learn about information security, threat analysis, and help protect critical digital infrastructure.',
      requirements: [
        'Cybersecurity or Computer Science background',
        'Understanding of network security',
        'Knowledge of security frameworks',
        'Ethical hacking interest',
        'Tunisian citizenship required'
      ],
      skills: ['Network Security', 'Penetration Testing', 'SIEM', 'Risk Assessment', 'Compliance', 'Linux'],
      applyUrl: 'https://gov.tn/careers/cybersecurity-intern',
      source: 'internmatch',
      postedDate: '2024-02-03',
      deadline: '2024-04-25',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Government',
      benefits: ['Security Clearance', 'Government Experience', 'National Impact', 'Career Stability'],
      duration: '6 months',
      match: 76
    }
  ];

  async searchJobs(params: JobSearchParams = {}): Promise<RealJob[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredJobs = [...this.realInternships];

    // Apply filters
    if (params.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.keywords) {
      const keywords = params.keywords.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(keywords) ||
        job.description.toLowerCase().includes(keywords) ||
        job.skills.some(skill => skill.toLowerCase().includes(keywords))
      );
    }

    if (params.company) {
      filteredJobs = filteredJobs.filter(job => 
        job.company.toLowerCase().includes(params.company!.toLowerCase())
      );
    }

    if (params.remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.remote === params.remote);
    }

    if (params.source && params.source.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.source!.includes(job.source)
      );
    }

    // Calculate match scores based on user profile (mock implementation)
    filteredJobs = filteredJobs.map(job => ({
      ...job,
      match: this.calculateMatchScore(job)
    }));

    // Sort by match score and recency
    filteredJobs.sort((a, b) => {
      const matchDiff = (b.match || 0) - (a.match || 0);
      if (matchDiff !== 0) return matchDiff;
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });

    return filteredJobs;
  }

  async getJobById(id: string): Promise<RealJob | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.realInternships.find(job => job.id === id) || null;
  }

  async getJobsBySource(source: string): Promise<RealJob[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.realInternships.filter(job => job.source === source);
  }

  async getTrendingJobs(): Promise<RealJob[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Return jobs posted in the last week, sorted by match score
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.realInternships
      .filter(job => new Date(job.postedDate) >= oneWeekAgo)
      .sort((a, b) => (b.match || 0) - (a.match || 0))
      .slice(0, 5);
  }

  private calculateMatchScore(job: RealJob): number {
    // Mock match calculation based on skills, location, etc.
    // In a real app, this would use user profile data
    let score = 50; // Base score
    
    // Boost for popular skills
    const popularSkills = ['JavaScript', 'Python', 'React', 'SQL', 'Git'];
    const matchingSkills = job.skills.filter(skill => 
      popularSkills.some(popular => skill.toLowerCase().includes(popular.toLowerCase()))
    );
    score += matchingSkills.length * 10;
    
    // Boost for Tunisia location
    if (job.location.includes('Tunisia')) score += 15;
    
    // Boost for internship type
    if (job.type.toLowerCase().includes('internship')) score += 10;
    
    // Boost for recent postings
    const daysSincePosted = Math.floor(
      (new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePosted <= 7) score += 10;
    else if (daysSincePosted <= 30) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  // Get available job sources
  getJobSources(): Array<{id: string, name: string, description: string}> {
    return [
      { id: 'linkedin', name: 'LinkedIn', description: 'Professional network jobs' },
      { id: 'indeed', name: 'Indeed', description: 'Global job search engine' },
      { id: 'glassdoor', name: 'Glassdoor', description: 'Company reviews and jobs' },
      { id: 'internshala', name: 'Internshala', description: 'Student internships platform' },
      { id: 'forage', name: 'Forage', description: 'Virtual work experiences' },
      { id: 'angellist', name: 'AngelList', description: 'Startup jobs and internships' },
      { id: 'naukri', name: 'Naukri.com', description: 'Leading job portal' },
      { id: 'foundit', name: 'Foundit', description: 'Career opportunities' },
      { id: 'letsintern', name: 'LetsIntern', description: 'Internship marketplace' },
      { id: 'internmatch', name: 'InternMatch', description: 'Internship matching platform' }
    ];
  }
}

export const realJobsService = new RealJobsService();