import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, User, GraduationCap, Briefcase, Award, Download, Eye, Sparkles, Plus, Trash2, FileText } from 'lucide-react-native';
import { aiService, CVData } from '@/services/aiService';
import { userDataService } from '@/services/userDataService';

interface CVGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CVGeneratorModal({ visible, onClose }: CVGeneratorModalProps) {
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    skills: [] as string[],
    experience: [] as string[],
    projects: [] as string[],
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newProject, setNewProject] = useState('');

  React.useEffect(() => {
    if (visible) {
      loadUserData();
    }
  }, [visible]);

  const loadUserData = async () => {
    const userData = userDataService.getCurrentUserData();
    if (userData) {
      setFormData({
        name: userData.profileData.name || '',
        email: userData.profileData.email || '',
        phone: '',
        university: userData.profileData.university || '',
        major: userData.profileData.major || '',
        skills: userData.profileData.skills || [],
        experience: userData.profileData.experience || [],
        projects: [],
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (newExperience.trim()) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience.trim()]
      }));
      setNewExperience('');
    }
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (newProject.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject.trim()]
      }));
      setNewProject('');
    }
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const generateCV = async () => {
    if (!formData.name || !formData.email || !formData.university || !formData.major) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Name, Email, University, Major)');
      return;
    }

    setIsGenerating(true);
    setStep('generating');

    try {
      const cvData = await aiService.generateCV(formData);
      setGeneratedCV(cvData);
      setStep('preview');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate CV. Please try again.');
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCV = () => {
    if (!generatedCV) return;
    
    const htmlContent = aiService.generateCVHTML(generatedCV);
    
    Alert.alert(
      'CV Generated! 📄',
      'Your professional CV has been generated successfully. In a real app, this would be downloaded as a PDF file.',
      [
        { text: 'Generate Another', onPress: () => setStep('input') },
        { text: 'Close', onPress: onClose }
      ]
    );
  };

  const renderInputForm = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={24} color="#2563EB" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="your.email@example.com"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            placeholder="+216 XX XXX XXX"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <GraduationCap size={24} color="#2563EB" />
          <Text style={styles.sectionTitle}>Education</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>University *</Text>
          <TextInput
            style={styles.input}
            value={formData.university}
            onChangeText={(text) => setFormData(prev => ({ ...prev, university: text }))}
            placeholder="e.g., ESPRIT, INSAT, ENIT"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Major/Field of Study *</Text>
          <TextInput
            style={styles.input}
            value={formData.major}
            onChangeText={(text) => setFormData(prev => ({ ...prev, major: text }))}
            placeholder="e.g., Computer Science, Software Engineering"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award size={24} color="#2563EB" />
          <Text style={styles.sectionTitle}>Skills</Text>
        </View>
        
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addInput}
            value={newSkill}
            onChangeText={setNewSkill}
            placeholder="Add a skill (e.g., JavaScript, Python)"
            onSubmitEditing={addSkill}
          />
          <TouchableOpacity style={styles.addButton} onPress={addSkill}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {formData.skills.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
              <TouchableOpacity onPress={() => removeSkill(index)}>
                <X size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Briefcase size={24} color="#2563EB" />
          <Text style={styles.sectionTitle}>Experience</Text>
        </View>
        
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addInput}
            value={newExperience}
            onChangeText={setNewExperience}
            placeholder="Add experience (e.g., Intern at Company X)"
            onSubmitEditing={addExperience}
          />
          <TouchableOpacity style={styles.addButton} onPress={addExperience}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {formData.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.experienceText}>{exp}</Text>
              <TouchableOpacity onPress={() => removeExperience(index)}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FileText size={24} color="#2563EB" />
          <Text style={styles.sectionTitle}>Projects (Optional)</Text>
        </View>
        
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addInput}
            value={newProject}
            onChangeText={setNewProject}
            placeholder="Add project (e.g., E-commerce Website)"
            onSubmitEditing={addProject}
          />
          <TouchableOpacity style={styles.addButton} onPress={addProject}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {formData.projects.map((project, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.experienceText}>{project}</Text>
              <TouchableOpacity onPress={() => removeProject(index)}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generateCV}>
        <Sparkles size={20} color="#FFFFFF" />
        <Text style={styles.generateButtonText}>Generate Professional CV</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderGenerating = () => (
    <View style={styles.generatingContainer}>
      <Sparkles size={64} color="#2563EB" />
      <Text style={styles.generatingTitle}>AI is Creating Your CV...</Text>
      <Text style={styles.generatingSubtitle}>
        Analyzing your information and crafting a professional resume
      </Text>
      <View style={styles.generatingSteps}>
        <Text style={styles.stepText}>✓ Processing personal information</Text>
        <Text style={styles.stepText}>✓ Analyzing skills and experience</Text>
        <Text style={styles.stepText}>⏳ Generating professional summary</Text>
        <Text style={styles.stepText}>⏳ Formatting and optimizing layout</Text>
      </View>
    </View>
  );

  const renderPreview = () => {
    if (!generatedCV) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Your Professional CV</Text>
          <Text style={styles.previewSubtitle}>Review and download your AI-generated resume</Text>
        </View>

        <View style={styles.cvPreview}>
          <View style={styles.cvHeader}>
            <Text style={styles.cvName}>{generatedCV.personalInfo.name}</Text>
            <Text style={styles.cvContact}>
              {generatedCV.personalInfo.email} | {generatedCV.personalInfo.location}
            </Text>
            {generatedCV.personalInfo.linkedin && (
              <Text style={styles.cvContact}>LinkedIn: {generatedCV.personalInfo.linkedin}</Text>
            )}
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionTitle}>Professional Summary</Text>
            <Text style={styles.cvText}>{generatedCV.summary}</Text>
          </View>

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionTitle}>Education</Text>
            {generatedCV.education.map((edu, index) => (
              <View key={index} style={styles.cvItem}>
                <Text style={styles.cvItemTitle}>{edu.degree}</Text>
                <Text style={styles.cvItemSubtitle}>{edu.university}</Text>
                <Text style={styles.cvItemDate}>Expected: {edu.graduationYear}</Text>
              </View>
            ))}
          </View>

          {generatedCV.experience.length > 0 && (
            <View style={styles.cvSection}>
              <Text style={styles.cvSectionTitle}>Experience</Text>
              {generatedCV.experience.map((exp, index) => (
                <View key={index} style={styles.cvItem}>
                  <Text style={styles.cvItemTitle}>{exp.title}</Text>
                  <Text style={styles.cvItemSubtitle}>{exp.company}</Text>
                  <Text style={styles.cvItemDate}>{exp.duration}</Text>
                  <View style={styles.cvItemDescription}>
                    {exp.description.slice(0, 2).map((desc, i) => (
                      <Text key={i} style={styles.cvBullet}>• {desc}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.cvSection}>
            <Text style={styles.cvSectionTitle}>Skills</Text>
            <View style={styles.skillsPreview}>
              <View style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>Technical Skills</Text>
                <View style={styles.skillTags}>
                  {generatedCV.skills.technical.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {generatedCV.projects.length > 0 && (
            <View style={styles.cvSection}>
              <Text style={styles.cvSectionTitle}>Projects</Text>
              {generatedCV.projects.slice(0, 2).map((project, index) => (
                <View key={index} style={styles.cvItem}>
                  <Text style={styles.cvItemTitle}>{project.name}</Text>
                  <Text style={styles.cvText}>{project.description}</Text>
                  <Text style={styles.cvTech}>Technologies: {project.technologies.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.editButton} onPress={() => setStep('input')}>
            <Text style={styles.editButtonText}>Edit Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton} onPress={downloadCV}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {step === 'input' ? 'AI CV Generator' : step === 'generating' ? 'Generating...' : 'CV Preview'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {step === 'input' && renderInputForm()}
        {step === 'generating' && renderGenerating()}
        {step === 'preview' && renderPreview()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsList: {
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skillText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  experienceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    marginRight: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 20,
    marginVertical: 20,
  },
  generateButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  generatingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  generatingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  generatingSteps: {
    alignSelf: 'stretch',
    gap: 12,
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'center',
  },
  previewHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  previewTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  previewSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  cvPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  cvHeader: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    paddingBottom: 20,
    marginBottom: 24,
  },
  cvName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  cvContact: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  cvSection: {
    marginBottom: 24,
  },
  cvSectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    marginBottom: 16,
  },
  cvText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  cvItem: {
    marginBottom: 16,
  },
  cvItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  cvItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 2,
  },
  cvItemDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  cvItemDescription: {
    marginTop: 8,
  },
  cvBullet: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginBottom: 4,
  },
  skillsPreview: {
    gap: 16,
  },
  skillCategory: {
    marginBottom: 12,
  },
  skillCategoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillTagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cvTech: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  downloadButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});