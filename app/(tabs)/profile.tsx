import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit3, MapPin, Calendar, Award, TrendingUp, Settings, Star, Download, Share, Eye, Languages, Shield, Plus, User, ExternalLink, Github, Linkedin, Globe, X, Save } from 'lucide-react-native';
import { dataService, UserProfile } from '@/services/dataService';
import ProgressBar from '@/components/ProgressBar';
import Badge from '@/components/Badge';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');

  const loadProfileData = async () => {
    try {
      const [profile, analyticsData] = await Promise.all([
        dataService.getUserProfile(),
        dataService.getAnalytics()
      ]);
      setUserProfile(profile);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleEditProfile = (field?: string) => {
    if (field && userProfile) {
      setEditField(field);
      setEditValue(userProfile[field as keyof UserProfile]?.toString() || '');
      setEditModalVisible(true);
    } else {
      Alert.alert(
        'Edit Profile',
        'Choose what to edit:',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Basic Info', onPress: () => handleEditProfile('bio') },
          { text: 'Skills', onPress: () => handleEditSkills() },
          { text: 'Experience', onPress: () => handleEditExperience() },
          { text: 'Links', onPress: () => handleEditProfile('linkedinUrl') },
        ]
      );
    }
  };

  const handleEditSkills = () => {
    Alert.alert(
      'Edit Skills',
      'Add your technical skills (comma separated):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            const newSkills = ['JavaScript', 'React', 'Python', 'SQL', 'Git', 'Node.js', 'TypeScript', 'MongoDB'];
            updateProfile({ skills: newSkills });
          }
        }
      ]
    );
  };

  const handleEditExperience = () => {
    Alert.alert(
      'Edit Experience',
      'Your experience has been updated with new projects and internships.',
      [{ text: 'OK' }]
    );
    const newExperience = [
      'Frontend Developer Intern at Local Startup (Summer 2023)',
      'Web Development Freelancer (2022-2023)',
      'University Programming Tutor (2023-Present)',
      'React.js Project - E-commerce Platform (2023)',
      'Python Data Analysis Project (2023)'
    ];
    updateProfile({ experience: newExperience });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    try {
      const updatedProfile = await dataService.updateUserProfile(updates);
      setUserProfile(updatedProfile);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSaveEdit = () => {
    if (editField && editValue && userProfile) {
      updateProfile({ [editField]: editValue });
      setEditModalVisible(false);
      setEditField('');
      setEditValue('');
    }
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Profile link copied to clipboard!\n\nhttps://matchistage.app/profile/eya-hamdi');
  };

  const handleDownloadResume = () => {
    Alert.alert('Download Resume', 'Resume download started...\n\nEya_Hamdi_Resume.pdf');
  };

  if (loading || !userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const achievements = [
    { type: 'achievement' as const, title: 'Profile Complete', description: '85% completed', earned: true },
    { type: 'skill' as const, title: 'Skill Master', description: '6 skills added', earned: true },
    { type: 'milestone' as const, title: 'First Application', description: 'Applied to first job', earned: analytics?.totalApplications > 0 },
    { type: 'social' as const, title: 'Networker', description: 'Connect with others', earned: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover & Avatar */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: userProfile.coverImage }} style={styles.coverImage} />
          <View style={styles.avatarContainer}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#6B7280" />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton} onPress={() => Alert.alert('Edit Avatar', 'Avatar updated!')}>
              <Edit3 size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editCoverButton} onPress={() => handleEditProfile()}>
            <Edit3 size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameSection}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditProfile('name')}>
              <Edit3 size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          {userProfile.title ? (
            <Text style={styles.userTitle}>{userProfile.title}</Text>
          ) : (
            <TouchableOpacity style={styles.addInfoButton} onPress={() => handleEditProfile('title')}>
              <Text style={styles.addInfoText}>+ Add your professional title</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>{userProfile.location}</Text>
          </View>
          
          <View style={styles.universityContainer}>
            <Text style={styles.universityText}>{userProfile.major} at {userProfile.university}</Text>
          </View>

          {userProfile.bio ? (
            <Text style={styles.bio}>{userProfile.bio}</Text>
          ) : (
            <TouchableOpacity style={styles.addInfoButton} onPress={() => handleEditProfile('bio')}>
              <Text style={styles.addInfoText}>+ Add a bio to tell your story</Text>
            </TouchableOpacity>
          )}

          {/* Social Links */}
          <View style={styles.socialLinks}>
            {userProfile.linkedinUrl && (
              <TouchableOpacity style={styles.socialLink}>
                <Linkedin size={16} color="#0A66C2" />
                <Text style={styles.socialLinkText}>LinkedIn</Text>
              </TouchableOpacity>
            )}
            {userProfile.githubUrl && (
              <TouchableOpacity style={styles.socialLink}>
                <Github size={16} color="#333" />
                <Text style={styles.socialLinkText}>GitHub</Text>
              </TouchableOpacity>
            )}
            {userProfile.portfolioUrl && (
              <TouchableOpacity style={styles.socialLink}>
                <Globe size={16} color="#2563EB" />
                <Text style={styles.socialLinkText}>Portfolio</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.addSocialLink} onPress={() => handleEditProfile('linkedinUrl')}>
              <Plus size={16} color="#6B7280" />
              <Text style={styles.addSocialText}>Add Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.joinInfo}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.joinDate}>Member since 2024</Text>
          </View>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Eye size={20} color="#2563EB" />
            <Text style={styles.statNumber}>{analytics?.profileViews || 127}</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={20} color="#10B981" />
            <Text style={styles.statNumber}>{achievements.filter(a => a.earned).length}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{userProfile.profileCompletion}%</Text>
            <Text style={styles.statLabel}>Profile Complete</Text>
          </View>
        </View>

        {/* Profile Completion */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.completionCard} onPress={() => handleEditProfile()}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>Profile Strength</Text>
              <Text style={styles.completionPercentage}>{userProfile.profileCompletion}%</Text>
            </View>
            <ProgressBar 
              progress={userProfile.profileCompletion} 
              color="#2563EB"
              height={8}
              showPercentage={false}
            />
            <Text style={styles.completionDescription}>
              {userProfile.profileCompletion >= 90 
                ? "Excellent! Your profile is almost complete."
                : userProfile.profileCompletion >= 70
                ? "Good progress! Add more details to improve visibility."
                : "Complete your profile to get 5x more views and better job matches"
              }
            </Text>
            
            <View style={styles.completionSteps}>
              {!userProfile.bio && (
                <TouchableOpacity style={styles.stepItem} onPress={() => handleEditProfile('bio')}>
                  <View style={styles.stepIcon}>
                    <User size={16} color="#2563EB" />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Add Bio</Text>
                    <Text style={styles.stepDescription}>Write a compelling bio</Text>
                  </View>
                  <Plus size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
              
              {userProfile.skills.length < 8 && (
                <TouchableOpacity style={styles.stepItem} onPress={handleEditSkills}>
                  <View style={styles.stepIcon}>
                    <Award size={16} color="#2563EB" />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Add More Skills</Text>
                    <Text style={styles.stepDescription}>Add {8 - userProfile.skills.length} more skills</Text>
                  </View>
                  <Plus size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
              
              {!userProfile.portfolioUrl && (
                <TouchableOpacity style={styles.stepItem} onPress={() => handleEditProfile('portfolioUrl')}>
                  <View style={styles.stepIcon}>
                    <Globe size={16} color="#2563EB" />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Add Portfolio</Text>
                    <Text style={styles.stepDescription}>Showcase your work</Text>
                  </View>
                  <Plus size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadResume}>
            <Download size={16} color="#2563EB" />
            <Text style={styles.actionText}>Download Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
            <Share size={16} color="#2563EB" />
            <Text style={styles.actionText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction]} onPress={() => handleEditProfile()}>
            <Edit3 size={16} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.primaryActionText]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <TouchableOpacity onPress={handleEditSkills}>
              <Text style={styles.seeAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          {userProfile.skills.length > 0 ? (
            <View style={styles.skillsContainer}>
              {userProfile.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Award size={48} color="#D1D5DB" />
              <Text style={styles.emptySectionTitle}>No Skills Added</Text>
              <Text style={styles.emptySectionDescription}>
                Add your technical skills to get better job matches
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleEditSkills}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Skills</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Experience Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <TouchableOpacity onPress={handleEditExperience}>
              <Text style={styles.seeAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          {userProfile.experience.length > 0 ? (
            <View style={styles.experienceContainer}>
              {userProfile.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.experienceText}>{exp}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <TrendingUp size={48} color="#D1D5DB" />
              <Text style={styles.emptySectionTitle}>No Experience Added</Text>
              <Text style={styles.emptySectionDescription}>
                Add your work experience and projects
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={handleEditExperience}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Experience</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements & Badges</Text>
            <TouchableOpacity onPress={() => Alert.alert('Achievements', 'All achievements displayed!')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <Badge
                key={index}
                type={achievement.type}
                title={achievement.title}
                description={achievement.description}
                earned={achievement.earned}
                size="medium"
              />
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <Settings size={20} color="#6B7280" />
          </View>
          
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Job Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts for matching opportunities</Text>
              </View>
              <Switch 
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Profile Visibility</Text>
                <Text style={styles.settingDescription}>Allow companies to view your profile</Text>
              </View>
              <Switch 
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              />
            </View>

            <TouchableOpacity style={styles.settingButton} onPress={() => Alert.alert('Privacy', 'Privacy settings opened')}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.settingButtonText}>Privacy & Security</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton} onPress={() => Alert.alert('Export', 'Data export started')}>
              <Download size={20} color="#6B7280" />
              <Text style={styles.settingButtonText}>Export Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton} onPress={() => Alert.alert('Language', 'Language: English (US)')}>
              <Languages size={20} color="#6B7280" />
              <Text style={styles.settingButtonText}>Language Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter your ${editField}`}
              multiline={editField === 'bio'}
              numberOfLines={editField === 'bio' ? 4 : 1}
            />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  profileHeader: {
    position: 'relative',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCoverButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  userTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  addInfoButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  addInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  universityContainer: {
    marginBottom: 12,
  },
  universityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  socialLinkText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 6,
  },
  addSocialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addSocialText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  joinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  completionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  completionPercentage: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  completionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 20,
  },
  completionSteps: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  stepDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryAction: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 6,
  },
  primaryActionText: {
    color: '#FFFFFF',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  experienceContainer: {
    gap: 12,
  },
  experienceItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  experienceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptySectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});