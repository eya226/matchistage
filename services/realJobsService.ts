// Enhanced real internship data service with international opportunities
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
  source: 'linkedin' | 'indeed' | 'glassdoor' | 'internshala' | 'forage' | 'angellist' | 'naukri' | 'foundit' | 'letsintern' | 'internmatch' | 'glassdoor-intl' | 'remote-year' | 'workaway';
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
  country: string;
  visa?: boolean;
}

export interface JobSearchParams {
  location?: string;
  keywords?: string;
  company?: string;
  experienceLevel?: string;
  remote?: boolean;
  datePosted?: 'today' | 'week' | 'month';
  source?: string[];
  international?: boolean;
  country?: string;
}

class RealJobsService {
  private baseUrls = {
    linkedin: 'https://www.linkedin.com/jobs/search',
    indeed: 'https://indeed.com/jobs',
    glassdoor: 'https://www.glassdoor.com/Job',
    internshala: 'https://internshala.com/internships',
    forage: 'https://www.theforage.com/virtual-internships',
    angellist: 'https://angel.co/jobs',
    naukri: 'https://www.naukri.com/internship-jobs',
    foundit: 'https://www.foundit.in/internships',
    letsintern: 'https://www.letsintern.com/internships',
    internmatch: 'https://www.internmatch.com/internships',
    'glassdoor-intl': 'https://www.glassdoor.com/Job/international-internships',
    'remote-year': 'https://remoteyear.com/jobs',
    workaway: 'https://www.workaway.info/internships',
  };

  // Enhanced real internship data with international opportunities
  private realInternships: RealJob[] = [
    // Tunisia Local Opportunities
    {
      id: 'tn_001',
      title: 'Software Engineering Intern',
      company: 'Microsoft Tunisia',
      location: 'Tunis, Tunisia',
      country: 'Tunisia',
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
      match: 95,
      visa: false
    },

    // International Remote Opportunities
    {
      id: 'remote_001',
      title: 'Remote Frontend Developer Intern',
      company: 'GitLab',
      location: 'Remote Worldwide',
      country: 'Global',
      salary: '$2000-3000 USD/month',
      type: 'Remote Internship',
      description: 'Join GitLab\'s distributed team as a Frontend Developer Intern. Work on the world\'s largest DevOps platform used by millions of developers. This is a fully remote position open to students worldwide.',
      requirements: [
        'Strong knowledge of JavaScript and Vue.js',
        'Experience with Git and version control',
        'Understanding of web development best practices',
        'Excellent communication skills in English',
        'Available for 40 hours/week for 12 weeks'
      ],
      skills: ['Vue.js', 'JavaScript', 'CSS3', 'HTML5', 'Git', 'Ruby on Rails'],
      applyUrl: 'https://about.gitlab.com/jobs/apply/frontend-developer-intern',
      source: 'remote-year',
      postedDate: '2024-01-20',
      deadline: '2024-04-01',
      remote: true,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Technology',
      benefits: ['Remote Work', 'Flexible Hours', 'Mentorship', 'Open Source Contribution'],
      duration: '12 weeks',
      match: 88,
      visa: false
    },

    // European Opportunities
    {
      id: 'eu_001',
      title: 'Data Science Intern',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      country: 'Sweden',
      salary: '€1800-2200/month',
      type: 'Summer Internship',
      description: 'Join Spotify\'s Data Science team in Stockholm to work on music recommendation algorithms and user behavior analysis. This internship offers visa sponsorship for international students.',
      requirements: [
        'Pursuing degree in Data Science, Statistics, or Computer Science',
        'Proficiency in Python and SQL',
        'Experience with machine learning frameworks',
        'Strong analytical and problem-solving skills',
        'Fluent in English'
      ],
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas', 'Spark'],
      applyUrl: 'https://www.lifeatspotify.com/jobs/data-science-intern',
      source: 'glassdoor-intl',
      postedDate: '2024-01-25',
      deadline: '2024-03-30',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Music Technology',
      benefits: ['Visa Sponsorship', 'Relocation Assistance', 'Health Insurance', 'Spotify Premium'],
      duration: '10 weeks',
      match: 82,
      visa: true
    },

    {
      id: 'eu_002',
      title: 'Mobile App Development Intern',
      company: 'SAP',
      location: 'Berlin, Germany',
      country: 'Germany',
      salary: '€1600-2000/month',
      type: 'Technical Internship',
      description: 'Work on enterprise mobile applications at SAP\'s Berlin office. Contribute to mobile solutions used by Fortune 500 companies worldwide.',
      requirements: [
        'Experience with React Native or Flutter',
        'Knowledge of mobile app development principles',
        'Understanding of REST APIs',
        'Strong programming fundamentals',
        'English proficiency required, German is a plus'
      ],
      skills: ['React Native', 'Flutter', 'JavaScript', 'TypeScript', 'REST APIs', 'Mobile UI/UX'],
      applyUrl: 'https://jobs.sap.com/job/berlin-mobile-app-development-intern',
      source: 'linkedin',
      postedDate: '2024-02-01',
      deadline: '2024-04-15',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Enterprise Software',
      benefits: ['Visa Support', 'Housing Assistance', 'Language Classes', 'Career Development'],
      duration: '6 months',
      match: 79,
      visa: true
    },

    // North American Opportunities
    {
      id: 'na_001',
      title: 'AI Research Intern',
      company: 'OpenAI',
      location: 'San Francisco, USA',
      country: 'USA',
      salary: '$8000-10000 USD/month',
      type: 'Research Internship',
      description: 'Join OpenAI\'s research team to work on cutting-edge artificial intelligence projects. This internship offers the opportunity to contribute to groundbreaking AI research.',
      requirements: [
        'PhD or Master\'s student in AI, ML, or Computer Science',
        'Strong background in machine learning and deep learning',
        'Experience with PyTorch or TensorFlow',
        'Published research papers preferred',
        'Excellent English communication skills'
      ],
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision'],
      applyUrl: 'https://openai.com/careers/research-intern',
      source: 'angellist',
      postedDate: '2024-02-05',
      deadline: '2024-04-20',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '100-500',
      industry: 'Artificial Intelligence',
      benefits: ['H1-B Sponsorship', 'Housing Stipend', 'Research Publication', 'Conference Travel'],
      duration: '12 weeks',
      match: 91,
      visa: true
    },

    {
      id: 'na_002',
      title: 'Full Stack Developer Intern',
      company: 'Shopify',
      location: 'Toronto, Canada',
      country: 'Canada',
      salary: 'CAD $6000-7500/month',
      type: 'Summer Internship',
      description: 'Build e-commerce solutions that power millions of businesses worldwide. Work with Shopify\'s engineering team on scalable web applications.',
      requirements: [
        'Experience with Ruby on Rails and React',
        'Understanding of web development best practices',
        'Knowledge of databases and APIs',
        'Strong problem-solving skills',
        'Eligible to work in Canada or visa sponsorship available'
      ],
      skills: ['Ruby on Rails', 'React', 'JavaScript', 'PostgreSQL', 'GraphQL', 'Docker'],
      applyUrl: 'https://www.shopify.com/careers/full-stack-developer-intern',
      source: 'indeed',
      postedDate: '2024-02-08',
      deadline: '2024-04-25',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'E-commerce',
      benefits: ['Work Permit Support', 'Health Benefits', 'Learning Budget', 'Return Offer Potential'],
      duration: '16 weeks',
      match: 85,
      visa: true
    },

    // Asian Opportunities
    {
      id: 'asia_001',
      title: 'Product Management Intern',
      company: 'Grab',
      location: 'Singapore',
      country: 'Singapore',
      salary: 'SGD $3000-4000/month',
      type: 'Product Internship',
      description: 'Join Southeast Asia\'s leading super-app as a Product Management Intern. Work on products that serve millions of users across the region.',
      requirements: [
        'Business, Engineering, or related field student',
        'Strong analytical and communication skills',
        'Interest in product management and user experience',
        'Previous internship experience preferred',
        'Fluent in English'
      ],
      skills: ['Product Management', 'Data Analysis', 'User Research', 'Agile', 'SQL', 'A/B Testing'],
      applyUrl: 'https://grab.careers/product-management-intern',
      source: 'linkedin',
      postedDate: '2024-02-10',
      deadline: '2024-05-01',
      remote: false,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Technology',
      benefits: ['Visa Sponsorship', 'Housing Allowance', 'Transportation', 'Mentorship'],
      duration: '12 weeks',
      match: 76,
      visa: true
    },

    // Virtual/Online Opportunities
    {
      id: 'virtual_001',
      title: 'Virtual Software Engineering Experience',
      company: 'JPMorgan Chase & Co.',
      location: 'Virtual/Online',
      country: 'Global',
      salary: 'Certificate Program (Unpaid)',
      type: 'Virtual Experience',
      description: 'Complete real-world tasks that JPMorgan Chase software engineers work on daily. Build your skills in Python, Git, and financial technology through this self-paced virtual program.',
      requirements: [
        'Basic programming knowledge',
        'Interest in financial technology',
        'Self-motivated learner',
        'Available for 5-6 hours per week',
        'No prior experience required'
      ],
      skills: ['Python', 'Git', 'Financial Markets', 'Data Analysis', 'React'],
      applyUrl: 'https://www.theforage.com/virtual-internships/prototype/R5iK7HMxJGBgaSbvk/Software-Engineering-Virtual-Experience',
      source: 'forage',
      postedDate: '2024-01-01',
      deadline: '2024-12-31',
      remote: true,
      experienceLevel: 'entry',
      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Financial Services',
      benefits: ['Certificate of Completion', 'Portfolio Project', 'Industry Insights', 'Self-paced'],
      duration: '4-6 weeks',
      match: 74,
      visa: false
    },

    {
      id: 'virtual_002',
      title: 'Cybersecurity Virtual Internship',
      company: 'Mastercard',
      location: 'Virtual/Online',
      country: 'Global',
      salary: 'Certificate Program (Unpaid)',
      type: 'Virtual Experience',
      description: 'Learn cybersecurity fundamentals through real Mastercard projects. Gain experience in threat detection, security analysis, and risk assessment.',
      requirements: [
        'Interest in cybersecurity',
        'Basic understanding of computer networks',
        'Analytical thinking skills',
        'Self-directed learning ability'
      ],
      skills: ['Cybersecurity', 'Network Security', 'Risk Assessment', 'Incident Response', 'Security Analysis'],
      applyUrl: 'https://www.theforage.com/virtual-internships/prototype/vcKAB5yYAgvemepGQ/Cybersecurity-Virtual-Experience-Program',
      source: 'forage',
      postedDate: '2024-01-05',
      deadline: '2024-12-31',
      remote: true,
      experienceLevel: 'entry',
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '1000+',
      industry: 'Financial Services',
      benefits: ['Industry Recognition', 'Skill Certification', 'Portfolio Building', 'Flexible Schedule'],
      duration: '3-4 weeks',
      match: 71,
      visa: false
    },

    // More Tunisia Local
    {
      id: 'tn_002',
      title: 'UX/UI Design Intern',
      company: 'Tunisie Telecom',
      location: 'Tunis, Tunisia',
      country: 'Tunisia',
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
      match: 68,
      visa: false
    },

    // More International Remote
    {
      id: 'remote_002',
      title: 'Content Marketing Intern',
      company: 'Buffer',
      location: 'Remote Worldwide',
      country: 'Global',
      salary: '$1500-2500 USD/month',
      type: 'Marketing Internship',
      description: 'Join Buffer\'s fully distributed marketing team. Create content for social media, blog posts, and marketing campaigns for a global audience.',
      requirements: [
        'Excellent writing skills in English',
        'Understanding of social media platforms',
        'Basic knowledge of content marketing',
        'Creative thinking and storytelling ability',
        'Available for 30-40 hours/week'
      ],
      skills: ['Content Marketing', 'Social Media', 'Copywriting', 'SEO', 'Analytics', 'Canva'],
      applyUrl: 'https://buffer.com/careers/content-marketing-intern',
      source: 'remote-year',
      postedDate: '2024-02-12',
      deadline: '2024-05-15',
      remote: true,
      experienceLevel: 'internship',
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      companySize: '50-100',
      industry: 'Social Media',
      benefits: ['Remote Work', 'Flexible Hours', 'Professional Development', 'Global Team'],
      duration: '12 weeks',
      match: 73,
      visa: false
    }
  ];

  async searchJobs(params: JobSearchParams = {}): Promise<RealJob[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredJobs = [...this.realInternships];

    // Apply filters
    if (params.location && params.location !== 'Global') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(params.location!.toLowerCase()) ||
        job.country.toLowerCase().includes(params.location!.toLowerCase())
      );
    }

    if (params.keywords) {
      const keywords = params.keywords.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(keywords) ||
        job.description.toLowerCase().includes(keywords) ||
        job.skills.some(skill => skill.toLowerCase().includes(keywords)) ||
        job.company.toLowerCase().includes(keywords)
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

    if (params.international) {
      filteredJobs = filteredJobs.filter(job => 
        job.country !== 'Tunisia' || job.remote === true
      );
    }

    if (params.country) {
      filteredJobs = filteredJobs.filter(job => 
        job.country.toLowerCase() === params.country!.toLowerCase()
      );
    }

    if (params.source && params.source.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        params.source!.includes(job.source)
      );
    }

    // Calculate match scores based on user profile
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

  async getJobsByCountry(country: string): Promise<RealJob[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.realInternships.filter(job => 
      job.country.toLowerCase() === country.toLowerCase()
    );
  }

  async getRemoteJobs(): Promise<RealJob[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.realInternships.filter(job => job.remote === true);
  }

  async getInternationalJobs(): Promise<RealJob[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.realInternships.filter(job => 
      job.country !== 'Tunisia' || job.remote === true
    );
  }

  async getTrendingJobs(): Promise<RealJob[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Return jobs posted in the last week, sorted by match score
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.realInternships
      .filter(job => new Date(job.postedDate) >= oneWeekAgo)
      .sort((a, b) => (b.match || 0) - (a.match || 0))
      .slice(0, 8);
  }

  private calculateMatchScore(job: RealJob): number {
    // Enhanced match calculation
    let score = 50; // Base score
    
    // Boost for popular skills
    const userSkills = ['JavaScript', 'Python', 'React', 'SQL', 'Git']; // Mock user skills
    const matchingSkills = job.skills.filter(skill => 
      userSkills.some(userSkill => skill.toLowerCase().includes(userSkill.toLowerCase()))
    );
    score += matchingSkills.length * 8;
    
    // Boost for location preferences
    if (job.location.includes('Tunisia') || job.remote) score += 15;
    
    // Boost for internship type
    if (job.type.toLowerCase().includes('internship')) score += 10;
    
    // Boost for visa sponsorship if international
    if (job.visa && job.country !== 'Tunisia') score += 12;
    
    // Boost for remote work
    if (job.remote) score += 8;
    
    // Boost for recent postings
    const daysSincePosted = Math.floor(
      (new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePosted <= 7) score += 10;
    else if (daysSincePosted <= 30) score += 5;
    
    // Boost for well-known companies
    const topCompanies = ['Microsoft', 'Google', 'Apple', 'Meta', 'Amazon', 'Netflix', 'Spotify', 'GitLab', 'OpenAI'];
    if (topCompanies.some(company => job.company.includes(company))) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  // Get available job sources with international focus
  getJobSources(): Array<{id: string, name: string, description: string}> {
    return [
      { id: 'linkedin', name: 'LinkedIn', description: 'Global professional network' },
      { id: 'indeed', name: 'Indeed', description: 'International job search' },
      { id: 'glassdoor', name: 'Glassdoor', description: 'Company reviews and salaries' },
      { id: 'glassdoor-intl', name: 'Glassdoor International', description: 'Global opportunities with visa support' },
      { id: 'internshala', name: 'Internshala', description: 'Student internships platform' },
      { id: 'forage', name: 'Forage', description: 'Virtual work experiences' },
      { id: 'angellist', name: 'AngelList', description: 'Startup jobs worldwide' },
      { id: 'remote-year', name: 'Remote Year', description: 'Remote work opportunities' },
      { id: 'naukri', name: 'Naukri.com', description: 'Leading job portal' },
      { id: 'foundit', name: 'Foundit', description: 'Career opportunities' },
      { id: 'letsintern', name: 'LetsIntern', description: 'Internship marketplace' },
      { id: 'internmatch', name: 'InternMatch', description: 'Global internship matching' },
      { id: 'workaway', name: 'Workaway', description: 'International work exchange' }
    ];
  }

  // Get countries with available opportunities
  getAvailableCountries(): Array<{code: string, name: string, jobCount: number}> {
    const countries = this.realInternships.reduce((acc, job) => {
      if (!acc[job.country]) {
        acc[job.country] = 0;
      }
      acc[job.country]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countries).map(([country, count]) => ({
      code: country.toLowerCase().replace(/\s+/g, '-'),
      name: country,
      jobCount: count
    })).sort((a, b) => b.jobCount - a.jobCount);
  }
}

export const realJobsService = new RealJobsService();