import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, ArrowLeft, CircleCheck as CheckCircle, User, GraduationCap, MapPin, Briefcase, Award, Globe, Github, Linkedin, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { dataService } from '@/services/dataService';

interface ProfileSetupData {
  personalInfo: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  education: {
    university: string;
    major: string;
    graduationYear: string;
    gpa?: string;
  };
  skills: string[];
  experience: string[];
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  preferences: {
    jobTypes: string[];
    locations: string[];
    remote: boolean;
  };
}

const AVAILABLE_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  
  // Frontend
  'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'Bootstrap', 'jQuery',
  
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET',
  
  // Mobile
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
  
  // Databases
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
  
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'Data Analysis', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  
  // Design
  'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch',
  
  // Other
  'Agile', 'Scrum', 'Project Management', 'Testing', 'API Development', 'Microservices'
];

const JOB_TYPES = [
  'Full-time Internship',
  'Part-time Internship', 
  'Summer Internship',
  'Remote Internship',
  'Research Internship',
  'Paid Internship',
  'Entry Level Position',
  'Graduate Program',
  'Freelance Projects'
];

const LOCATIONS = [
  'Tunis, Tunisia',
  'Sfax, Tunisia', 
  'Sousse, Tunisia',
  'Ariana, Tunisia',
  'Remote',
  'Paris, France',
  'London, UK',
  'Berlin, Germany',
  'Dubai, UAE',
  'Montreal, Canada',
  'New York, USA',
  'San Francisco, USA'
];

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileSetupData>({
    personalInfo: {
      firstName: 'Eya',
      lastName: 'Hamdi',
      bio: '',
      location: 'Tunis, Tunisia',
    },
    education: {
      university: 'ESPRIT',
      major: 'Software Engineering',
      graduationYear: '2025',
      gpa: '',
    },
    skills: [],
    experience: [],
    links: {},
    preferences: {
      jobTypes: [],
      locations: ['Tunis, Tunisia'],
      remote: true,
    },
  });

  const totalSteps = 5;

  const updateProfileData = (section: keyof ProfileSetupData, data: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const addSkill = (skill: string) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addExperience = (experience: string) => {
    if (experience.trim()) {
      setProfileData(prev => ({
        ...prev,
        experience: [...prev.experience, experience.trim()]
      }));
    }
  };

  const removeExperience = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const toggleJobType = (jobType: string) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        jobTypes: prev.preferences.jobTypes.includes(jobType)
          ? prev.preferences.jobTypes.filter(t => t !== jobType)
          : [...prev.preferences.jobTypes, jobType]
      }
    }));
  };

  const toggleLocation = (location: string) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        locations: prev.preferences.locations.includes(location)
          ? prev.preferences.locations.filter(l => l !== location)
          : [...prev.preferences.locations, location]
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Update user profile with all the collected data
      await dataService.updateUserProfile({
        name: `${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName}`,
        bio: profileData.personalInfo.bio,
        location: profileData.personalInfo.location,
        university: profileData.education.university,
        major: profileData.education.major,
        skills: profileData.skills,
        experience: profileData.experience,
        linkedinUrl: profileData.links.linkedin,
        githubUrl: profileData.links.github,
        portfolioUrl: profileData.links.portfolio,
      });

      Alert.alert(
        'Profile Setup Complete! 🎉',
        'Your profile has been successfully created. You\'re now ready to discover amazing internship opportunities!',
        [
          {
            text: 'Start Exploring',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <User size={32} color="#2563EB" />
        <Text style={styles.stepTitle}>Personal Information</Text>
        <Text style={styles.stepDescription}>Tell us about yourself</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={styles.input}
          value={profileData.personalInfo.firstName}
          onChangeText={(text) => updateProfileData('personalInfo', { firstName: text })}
          placeholder="Enter your first name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={profileData.personalInfo.lastName}
          onChangeText={(text) => updateProfileData('personalInfo', { lastName: text })}
          placeholder="Enter your last name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profileData.personalInfo.bio}
          onChangeText={(text) => updateProfileData('personalInfo', { bio: text })}
          placeholder="Write a brief bio about yourself..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Location</Text>
        <TextInput
          style={styles.input}
          value={profileData.personalInfo.location}
          onChangeText={(text) => updateProfileData('personalInfo', { location: text })}
          placeholder="City, Country"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <GraduationCap size={32} color="#2563EB" />
        <Text style={styles.stepTitle}>Education</Text>
        <Text style={styles.stepDescription}>Your academic background</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>University</Text>
        <TextInput
          style={styles.input}
          value={profileData.education.university}
          onChangeText={(text) => updateProfileData('education', { university: text })}
          placeholder="e.g., ESPRIT, INSAT, ENIT"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Major</Text>
        <TextInput
          style={styles.input}
          value={profileData.education.major}
          onChangeText={(text) => updateProfileData('education', { major: text })}
          placeholder="e.g., Computer Science, Software Engineering"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Expected Graduation Year</Text>
        <TextInput
          style={styles.input}
          value={profileData.education.graduationYear}
          onChangeText={(text) => updateProfileData('education', { graduationYear: text })}
          placeholder="e.g., 2025"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>GPA (Optional)</Text>
        <TextInput
          style={styles.input}
          value={profileData.education.gpa}
          onChangeText={(text) => updateProfileData('education', { gpa: text })}
          placeholder="e.g., 3.8/4.0"
        />
      </View>
    </View>
  );

  const renderStep3 = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredSkills = AVAILABLE_SKILLS.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !profileData.skills.includes(skill)
    );

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Award size={32} color="#2563EB" />
          <Text style={styles.stepTitle}>Skills</Text>
          <Text style={styles.stepDescription}>Select your technical skills</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Search Skills</Text>
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search for skills..."
          />
        </View>

        {profileData.skills.length > 0 && (
          <View style={styles.selectedSkillsContainer}>
            <Text style={styles.selectedSkillsTitle}>Selected Skills ({profileData.skills.length})</Text>
            <View style={styles.skillsGrid}>
              {profileData.skills.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={styles.selectedSkillChip}
                  onPress={() => removeSkill(skill)}
                >
                  <Text style={styles.selectedSkillText}>{skill}</Text>
                  <X size={14} color="#FFFFFF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.availableSkillsContainer}>
          <Text style={styles.availableSkillsTitle}>Available Skills</Text>
          <View style={styles.skillsGrid}>
            {filteredSkills.slice(0, 20).map((skill) => (
              <TouchableOpacity
                key={skill}
                style={styles.skillChip}
                onPress={() => addSkill(skill)}
              >
                <Text style={styles.skillText}>{skill}</Text>
                <Plus size={14} color="#2563EB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderStep4 = () => {
    const [newExperience, setNewExperience] = useState('');

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <Briefcase size={32} color="#2563EB" />
          <Text style={styles.stepTitle}>Experience</Text>
          <Text style={styles.stepDescription}>Add your work experience and projects</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Add Experience</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newExperience}
            onChangeText={setNewExperience}
            placeholder="e.g., Frontend Developer Intern at Company X (Summer 2023)"
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              addExperience(newExperience);
              setNewExperience('');
            }}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Experience</Text>
          </TouchableOpacity>
        </View>

        {profileData.experience.length > 0 && (
          <View style={styles.experienceList}>
            <Text style={styles.experienceTitle}>Your Experience</Text>
            {profileData.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.experienceText}>{exp}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeExperience(index)}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Globe size={32} color="#2563EB" />
        <Text style={styles.stepTitle}>Preferences</Text>
        <Text style={styles.stepDescription}>What are you looking for?</Text>
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.preferencesTitle}>Job Types</Text>
        <View style={styles.preferencesGrid}>
          {JOB_TYPES.map((jobType) => (
            <TouchableOpacity
              key={jobType}
              style={[
                styles.preferenceChip,
                profileData.preferences.jobTypes.includes(jobType) && styles.selectedPreferenceChip
              ]}
              onPress={() => toggleJobType(jobType)}
            >
              <Text style={[
                styles.preferenceText,
                profileData.preferences.jobTypes.includes(jobType) && styles.selectedPreferenceText
              ]}>
                {jobType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.preferencesTitle}>Preferred Locations</Text>
        <View style={styles.preferencesGrid}>
          {LOCATIONS.map((location) => (
            <TouchableOpacity
              key={location}
              style={[
                styles.preferenceChip,
                profileData.preferences.locations.includes(location) && styles.selectedPreferenceChip
              ]}
              onPress={() => toggleLocation(location)}
            >
              <Text style={[
                styles.preferenceText,
                profileData.preferences.locations.includes(location) && styles.selectedPreferenceText
              ]}>
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Social Links (Optional)</Text>
        
        <View style={styles.linkInput}>
          <Linkedin size={20} color="#0A66C2" />
          <TextInput
            style={styles.linkTextInput}
            value={profileData.links.linkedin}
            onChangeText={(text) => updateProfileData('links', { linkedin: text })}
            placeholder="LinkedIn profile URL"
          />
        </View>

        <View style={styles.linkInput}>
          <Github size={20} color="#333" />
          <TextInput
            style={styles.linkTextInput}
            value={profileData.links.github}
            onChangeText={(text) => updateProfileData('links', { github: text })}
            placeholder="GitHub profile URL"
          />
        </View>

        <View style={styles.linkInput}>
          <Globe size={20} color="#2563EB" />
          <TextInput
            style={styles.linkTextInput}
            value={profileData.links.portfolio}
            onChangeText={(text) => updateProfileData('links', { portfolio: text })}
            placeholder="Portfolio website URL"
          />
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
        <Text style={styles.headerSubtitle}>Step {currentStep} of {totalSteps}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round((currentStep / totalSteps) * 100)}% Complete</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
          </Text>
          {currentStep === totalSteps ? (
            <CheckCircle size={20} color="#FFFFFF" />
          ) : (
            <ArrowRight size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectedSkillsContainer: {
    marginBottom: 20,
  },
  selectedSkillsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  availableSkillsContainer: {
    marginBottom: 20,
  },
  availableSkillsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginRight: 6,
  },
  selectedSkillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedSkillText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  experienceList: {
    marginTop: 20,
  },
  experienceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  experienceText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  removeButton: {
    padding: 4,
  },
  preferencesSection: {
    marginBottom: 24,
  },
  preferencesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedPreferenceChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  preferenceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  selectedPreferenceText: {
    color: '#FFFFFF',
  },
  linkInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  linkTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 6,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});