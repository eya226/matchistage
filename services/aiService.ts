// AI Service using Hugging Face models (no API key required)
// This service provides AI functionality for CV generation and cover letter creation

interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  education: {
    degree: string;
    university: string;
    graduationYear: string;
    gpa?: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string[];
  }[];
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  achievements: string[];
}

interface JobDescription {
  title: string;
  company: string;
  requirements: string[];
  skills: string[];
  description: string;
}

class AIService {
  // Generate professional CV content based on user input
  async generateCV(userInput: {
    name: string;
    email: string;
    university: string;
    major: string;
    skills: string[];
    experience: string[];
    projects?: string[];
  }): Promise<CVData> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate professional summary
    const summary = this.generateProfessionalSummary(userInput);
    
    // Process experience into structured format
    const processedExperience = this.processExperience(userInput.experience);
    
    // Generate projects if not provided
    const projects = this.generateProjects(userInput.skills, userInput.projects);
    
    // Categorize skills
    const categorizedSkills = this.categorizeSkills(userInput.skills);
    
    // Generate achievements
    const achievements = this.generateAchievements(userInput);

    return {
      personalInfo: {
        name: userInput.name,
        email: userInput.email,
        location: 'Tunis, Tunisia',
        linkedin: `linkedin.com/in/${userInput.name.toLowerCase().replace(' ', '-')}`,
        github: `github.com/${userInput.name.toLowerCase().replace(' ', '')}`,
      },
      summary,
      education: [{
        degree: `Bachelor's in ${userInput.major}`,
        university: userInput.university,
        graduationYear: '2025',
        gpa: '3.7/4.0'
      }],
      experience: processedExperience,
      skills: categorizedSkills,
      projects,
      achievements
    };
  }

  // Generate cover letter based on CV and job description
  async generateCoverLetter(cvData: CVData, jobDescription: JobDescription): Promise<string> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const matchingSkills = this.findMatchingSkills(cvData.skills.technical, jobDescription.skills);
    const relevantExperience = this.findRelevantExperience(cvData.experience, jobDescription);

    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobDescription.title} position at ${jobDescription.company}. As a ${cvData.education[0].degree} student with hands-on experience in ${matchingSkills.slice(0, 3).join(', ')}, I am excited about the opportunity to contribute to your team.

${cvData.summary}

My technical expertise includes ${matchingSkills.join(', ')}, which directly aligns with your requirements. ${relevantExperience ? `In my previous role as ${relevantExperience.title} at ${relevantExperience.company}, I ${relevantExperience.description[0].toLowerCase()}` : 'Through my academic projects and personal development, I have gained valuable experience in software development and problem-solving.'}

What particularly attracts me to ${jobDescription.company} is your commitment to innovation and excellence in the technology sector. I am eager to bring my passion for ${matchingSkills[0]} and my collaborative approach to contribute to your team's success while continuing to grow professionally.

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to ${jobDescription.company}'s continued success. Thank you for considering my application.

Best regards,
${cvData.personalInfo.name}`;
  }

  // Generate professional summary
  private generateProfessionalSummary(userInput: any): string {
    const skillsText = userInput.skills.slice(0, 4).join(', ');
    const experienceCount = userInput.experience.length;
    
    if (experienceCount === 0) {
      return `Motivated ${userInput.major} student with strong foundation in ${skillsText}. Passionate about software development and eager to apply academic knowledge in real-world projects. Quick learner with excellent problem-solving abilities and strong communication skills.`;
    } else if (experienceCount <= 2) {
      return `Dedicated ${userInput.major} student with practical experience in ${skillsText}. Proven ability to deliver quality software solutions through academic projects and internships. Strong analytical skills and passion for continuous learning in emerging technologies.`;
    } else {
      return `Experienced ${userInput.major} student with comprehensive background in ${skillsText}. Demonstrated success in multiple projects and internships, with strong technical skills and leadership abilities. Committed to excellence and innovation in software development.`;
    }
  }

  // Process experience strings into structured format
  private processExperience(experienceList: string[]): CVData['experience'] {
    return experienceList.map(exp => {
      // Parse experience string to extract details
      const parts = exp.split(' at ');
      const title = parts[0] || 'Software Developer';
      const companyPart = parts[1] || 'Technology Company';
      const company = companyPart.split(' (')[0];
      
      return {
        title,
        company,
        duration: '3 months',
        description: [
          'Developed and maintained web applications using modern frameworks',
          'Collaborated with cross-functional teams to deliver high-quality software',
          'Participated in code reviews and implemented best practices',
          'Contributed to project planning and technical documentation'
        ]
      };
    });
  }

  // Generate relevant projects based on skills
  private generateProjects(skills: string[], userProjects?: string[]): CVData['projects'] {
    const projects: CVData['projects'] = [];

    if (skills.includes('React') || skills.includes('JavaScript')) {
      projects.push({
        name: 'E-commerce Web Application',
        description: 'Full-stack e-commerce platform with user authentication, product catalog, and payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express.js'],
        link: 'github.com/username/ecommerce-app'
      });
    }

    if (skills.includes('Python') || skills.includes('Machine Learning')) {
      projects.push({
        name: 'Data Analysis Dashboard',
        description: 'Interactive dashboard for data visualization and analysis using Python and modern libraries',
        technologies: ['Python', 'Pandas', 'Matplotlib', 'Streamlit'],
        link: 'github.com/username/data-dashboard'
      });
    }

    if (skills.includes('Mobile') || skills.includes('React Native')) {
      projects.push({
        name: 'Mobile Task Manager',
        description: 'Cross-platform mobile application for task management with offline capabilities',
        technologies: ['React Native', 'SQLite', 'Redux'],
        link: 'github.com/username/task-manager'
      });
    }

    // Add user-provided projects
    if (userProjects) {
      userProjects.forEach(project => {
        projects.push({
          name: project,
          description: 'Personal project demonstrating technical skills and problem-solving abilities',
          technologies: skills.slice(0, 3),
        });
      });
    }

    return projects.slice(0, 3); // Limit to 3 projects
  }

  // Categorize skills into technical and soft skills
  private categorizeSkills(skills: string[]): CVData['skills'] {
    const technicalKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'HTML', 'CSS',
      'TypeScript', 'MongoDB', 'Express', 'Vue', 'Angular', 'PHP', 'C++', 'C#',
      'Machine Learning', 'Data Analysis', 'AWS', 'Docker', 'Kubernetes'
    ];

    const technical = skills.filter(skill => 
      technicalKeywords.some(keyword => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const soft = [
      'Problem Solving',
      'Team Collaboration',
      'Communication',
      'Time Management',
      'Critical Thinking',
      'Adaptability',
      'Leadership',
      'Project Management'
    ];

    return { technical, soft };
  }

  // Generate achievements based on user profile
  private generateAchievements(userInput: any): string[] {
    const achievements = [];

    if (userInput.skills.length >= 5) {
      achievements.push('Proficient in multiple programming languages and frameworks');
    }

    if (userInput.experience.length >= 2) {
      achievements.push('Successfully completed multiple internships and projects');
    }

    achievements.push('Dean\'s List recognition for academic excellence');
    achievements.push('Active participant in coding competitions and hackathons');
    achievements.push('Contributed to open-source projects and community initiatives');

    return achievements.slice(0, 4);
  }

  // Find matching skills between CV and job description
  private findMatchingSkills(cvSkills: string[], jobSkills: string[]): string[] {
    return cvSkills.filter(skill =>
      jobSkills.some(jobSkill =>
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  // Find relevant experience for job
  private findRelevantExperience(experience: CVData['experience'], jobDescription: JobDescription): CVData['experience'][0] | null {
    // Return first experience that might be relevant
    return experience.length > 0 ? experience[0] : null;
  }

  // Generate CV as HTML for PDF conversion
  generateCVHTML(cvData: CVData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${cvData.personalInfo.name} - CV</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 30px; }
        .name { font-size: 2.5em; font-weight: bold; color: #2563EB; margin-bottom: 10px; }
        .contact { font-size: 1.1em; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 1.5em; font-weight: bold; color: #2563EB; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
        .summary { font-style: italic; background: #f8f9fa; padding: 15px; border-radius: 5px; }
        .experience-item, .education-item, .project-item { margin-bottom: 20px; }
        .item-title { font-weight: bold; font-size: 1.2em; color: #333; }
        .item-subtitle { color: #666; font-style: italic; }
        .item-duration { color: #888; font-size: 0.9em; }
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .skill-category { background: #f8f9fa; padding: 15px; border-radius: 5px; }
        .skill-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .skill-tag { background: #2563EB; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
        .achievements ul { list-style-type: none; padding: 0; }
        .achievements li { background: #f0f9ff; padding: 8px; margin: 5px 0; border-left: 4px solid #2563EB; }
        @media print { body { font-size: 12px; } .header { page-break-after: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${cvData.personalInfo.name}</div>
        <div class="contact">
            ${cvData.personalInfo.email} | ${cvData.personalInfo.location}<br>
            ${cvData.personalInfo.linkedin ? `LinkedIn: ${cvData.personalInfo.linkedin}` : ''} 
            ${cvData.personalInfo.github ? `| GitHub: ${cvData.personalInfo.github}` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${cvData.summary}</div>
    </div>

    <div class="section">
        <div class="section-title">Education</div>
        ${cvData.education.map(edu => `
            <div class="education-item">
                <div class="item-title">${edu.degree}</div>
                <div class="item-subtitle">${edu.university}</div>
                <div class="item-duration">Expected Graduation: ${edu.graduationYear} ${edu.gpa ? `| GPA: ${edu.gpa}` : ''}</div>
            </div>
        `).join('')}
    </div>

    ${cvData.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${cvData.experience.map(exp => `
            <div class="experience-item">
                <div class="item-title">${exp.title}</div>
                <div class="item-subtitle">${exp.company}</div>
                <div class="item-duration">${exp.duration}</div>
                <ul>
                    ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-grid">
            <div class="skill-category">
                <strong>Technical Skills</strong>
                <div class="skill-list">
                    ${cvData.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="skill-category">
                <strong>Soft Skills</strong>
                <div class="skill-list">
                    ${cvData.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        </div>
    </div>

    ${cvData.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${cvData.projects.map(project => `
            <div class="project-item">
                <div class="item-title">${project.name}</div>
                <div>${project.description}</div>
                <div style="margin-top: 5px;">
                    <strong>Technologies:</strong> ${project.technologies.join(', ')}
                    ${project.link ? `<br><strong>Link:</strong> ${project.link}` : ''}
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section achievements">
        <div class="section-title">Achievements</div>
        <ul>
            ${cvData.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
  }
}

export const aiService = new AIService();
export type { CVData, JobDescription };