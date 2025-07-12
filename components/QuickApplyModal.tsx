import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { X, FileText, Send, Clock, CircleCheck as CheckCircle, Sparkles, Upload, File, Trash2 } from 'lucide-react-native';
import { aiService } from '@/services/aiService';
import { userDataService } from '@/services/userDataService';

interface QuickApplyModalProps {
  visible: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    skills?: string[];
    description?: string;
  };
  onApply: (applicationData: any) => void;
}

export default function QuickApplyModal({ visible, onClose, job, onApply }: QuickApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [uploadedResume, setUploadedResume] = useState<{name: string; size: string} | null>(null);

  const generateAICoverLetter = async () => {
    setIsGeneratingCoverLetter(true);
    
    try {
      // Get user data for CV context
      const userData = userDataService.getCurrentUserData();
      if (!userData) {
        Alert.alert('Error', 'Please complete your profile first');
        setIsGeneratingCoverLetter(false);
        return;
      }

      // Create mock CV data from user profile
      const cvData = {
        personalInfo: {
          name: userData.profileData.name,
          email: userData.profileData.email,
          location: userData.profileData.location,
        },
        summary: `Motivated ${userData.profileData.major} student with strong foundation in ${userData.profileData.skills.slice(0, 3).join(', ')}.`,
        education: [{
          degree: `Bachelor's in ${userData.profileData.major}`,
          university: userData.profileData.university,
          graduationYear: '2025',
        }],
        experience: userData.profileData.experience.map(exp => ({
          title: exp.split(' at ')[0] || 'Developer',
          company: exp.split(' at ')[1]?.split(' (')[0] || 'Company',
          duration: '3 months',
          description: ['Developed software solutions', 'Collaborated with team members']
        })),
        skills: {
          technical: userData.profileData.skills,
          soft: ['Problem Solving', 'Communication', 'Team Work']
        },
        projects: [],
        achievements: []
      };

      // Create job description object
      const jobDescription = {
        title: job.title,
        company: job.company,
        requirements: job.skills || [],
        skills: job.skills || [],
        description: job.description || ''
      };

      // Generate cover letter using AI service
      const generatedLetter = await aiService.generateCoverLetter(cvData, jobDescription);
      setCoverLetter(generatedLetter);
      
      Alert.alert(
        'Cover Letter Generated! ✨',
        'AI has generated a personalized cover letter based on your profile and the job requirements. You can edit it before submitting.',
        [{ text: 'Great!' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate cover letter. Please try again.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleResumeUpload = () => {
    Alert.alert(
      'Upload Resume',
      'Choose how to upload your resume:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose from Files', onPress: () => simulateFileUpload() },
        { text: 'Take Photo', onPress: () => simulatePhotoUpload() },
      ]
    );
  };

  const simulateFileUpload = () => {
    // Simulate file upload
    setTimeout(() => {
      setUploadedResume({
        name: 'Eya_Hamdi_Resume.pdf',
        size: '245 KB'
      });
      Alert.alert('Success', 'Resume uploaded successfully!');
    }, 1000);
  };

  const simulatePhotoUpload = () => {
    // Simulate photo upload
    setTimeout(() => {
      setUploadedResume({
        name: 'Resume_Photo.jpg',
        size: '1.2 MB'
      });
      Alert.alert('Success', 'Resume photo uploaded successfully!');
    }, 1000);
  };

  const removeResume = () => {
    Alert.alert(
      'Remove Resume',
      'Are you sure you want to remove the uploaded resume?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setUploadedResume(null) }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      Alert.alert('Error', 'Please write a cover letter or generate one using AI');
      return;
    }

    if (!uploadedResume) {
      Alert.alert(
        'No Resume Attached',
        'You haven\'t uploaded a resume. Do you want to continue without one?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => submitApplication() }
        ]
      );
      return;
    }

    submitApplication();
  };

  const submitApplication = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const applicationData = {
        jobId: job.id,
        coverLetter: coverLetter.trim(),
        appliedAt: new Date().toISOString(),
        status: 'pending',
        resumeAttached: !!uploadedResume,
        resumeName: uploadedResume?.name || null,
      };
      
      onApply(applicationData);
      setStep('success');
      setIsSubmitting(false);
      
      // Auto close after success
      setTimeout(() => {
        setStep('form');
        setCoverLetter('');
        setUploadedResume(null);
        onClose();
      }, 3000);
    }, 1500);
  };

  const renderForm = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.companyName}>{job.company}</Text>
        <Text style={styles.location}>{job.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Application</Text>
        <Text style={styles.sectionDescription}>
          Upload your resume and write a personalized cover letter to stand out.
        </Text>
      </View>

      {/* Resume Upload Section */}
      <View style={styles.resumeSection}>
        <View style={styles.resumeHeader}>
          <Text style={styles.resumeTitle}>Resume *</Text>
          {!uploadedResume && (
            <TouchableOpacity style={styles.uploadButton} onPress={handleResumeUpload}>
              <Upload size={16} color="#2563EB" />
              <Text style={styles.uploadButtonText}>Upload Resume</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {uploadedResume ? (
          <View style={styles.uploadedFile}>
            <View style={styles.fileInfo}>
              <File size={20} color="#10B981" />
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{uploadedResume.name}</Text>
                <Text style={styles.fileSize}>{uploadedResume.size}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={removeResume}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Upload size={32} color="#D1D5DB" />
            <Text style={styles.uploadPlaceholderText}>No resume uploaded</Text>
            <Text style={styles.uploadPlaceholderSubtext}>PDF, DOC, or image files accepted</Text>
          </View>
        )}
      </View>

      {/* Cover Letter Section */}
      <View style={styles.inputContainer}>
        <View style={styles.coverLetterHeader}>
          <Text style={styles.inputLabel}>Cover Letter *</Text>
          <TouchableOpacity 
            style={styles.aiButton} 
            onPress={generateAICoverLetter}
            disabled={isGeneratingCoverLetter}
          >
            <Sparkles size={16} color="#8B5CF6" />
            <Text style={styles.aiButtonText}>
              {isGeneratingCoverLetter ? 'Generating...' : 'AI Generate'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.textArea}
          placeholder="Write a personalized message explaining why you're interested in this position..."
          value={coverLetter}
          onChangeText={setCoverLetter}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />
        <View style={styles.characterCountContainer}>
          <Text style={styles.characterCount}>{coverLetter.length}/1000</Text>
          {coverLetter.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setCoverLetter('')}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* AI Tips */}
      {isGeneratingCoverLetter && (
        <View style={styles.aiTips}>
          <Sparkles size={16} color="#8B5CF6" />
          <Text style={styles.aiTipsText}>
            AI is analyzing the job requirements and crafting a personalized cover letter...
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Clock size={16} color="#FFFFFF" />
          ) : (
            <Send size={16} color="#FFFFFF" />
          )}
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <CheckCircle size={64} color="#10B981" />
      <Text style={styles.successTitle}>Application Submitted!</Text>
      <Text style={styles.successMessage}>
        Your application for {job.title} at {job.company} has been successfully submitted.
      </Text>
      {uploadedResume && (
        <Text style={styles.successNote}>
          ✓ Resume attached: {uploadedResume.name}
        </Text>
      )}
      <Text style={styles.successNote}>
        You'll receive updates on your application status via notifications.
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {step === 'form' ? 'Quick Apply' : 'Success!'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {step === 'form' ? renderForm() : renderSuccess()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  jobInfo: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  resumeSection: {
    marginBottom: 24,
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  uploadButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 6,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 32,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
    marginTop: 8,
  },
  uploadPlaceholderSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  coverLetterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  aiButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 6,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 160,
  },
  characterCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  aiTips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  aiTipsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B5CF6',
    marginLeft: 8,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  successNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
});