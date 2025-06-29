import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit3, MapPin, Calendar, Award, TrendingUp, Settings, Star, Download, Share, Eye, Languages, Shield, Plus, User } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  // New user profile with minimal data
  const userProfile = {
    name: 'New User',
    title: 'Add your title',
    location: 'Add your location',
    avatar: null,
    coverImage: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    joinDate: 'Joined today',
    completionRate: 15,
    views: 0,
    connections: 0,
  };

  const renderProfileCompletion = () => (
    <View style={styles.completionCard}>
      <View style={styles.completionHeader}>
        <Text style={styles.completionTitle}>Complete Your Profile</Text>
        <Text style={styles.completionPercentage}>{userProfile.completionRate}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${userProfile.completionRate}%` }]} />
      </View>
      <Text style={styles.completionDescription}>
        A complete profile gets 5x more views and better job matches
      </Text>
      
      <View style={styles.completionSteps}>
        <TouchableOpacity style={styles.stepItem}>
          <View style={styles.stepIcon}>
            <User size={16} color="#2563EB" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Add Profile Photo</Text>
            <Text style={styles.stepDescription}>Upload a professional photo</Text>
          </View>
          <Plus size={16} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.stepItem}>
          <View style={styles.stepIcon}>
            <Award size={16} color="#2563EB" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Add Skills</Text>
            <Text style={styles.stepDescription}>List your technical skills</Text>
          </View>
          <Plus size={16} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.stepItem}>
          <View style={styles.stepIcon}>
            <TrendingUp size={16} color="#2563EB" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Add Experience</Text>
            <Text style={styles.stepDescription}>Include projects and internships</Text>
          </View>
          <Plus size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptySkills = () => (
    <View style={styles.emptySection}>
      <Award size={48} color="#D1D5DB" />
      <Text style={styles.emptySectionTitle}>No Skills Added</Text>
      <Text style={styles.emptySectionDescription}>
        Add your technical skills to get better job matches and showcase your expertise
      </Text>
      <TouchableOpacity style={styles.addButton}>
        <Plus size={16} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Skills</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyAchievements = () => (
    <View style={styles.emptySection}>
      <Star size={48} color="#D1D5DB" />
      <Text style={styles.emptySectionTitle}>No Achievements Yet</Text>
      <Text style={styles.emptySectionDescription}>
        Start applying to jobs and completing profile sections to earn achievements
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover & Avatar */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: userProfile.coverImage }} style={styles.coverImage} />
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="#6B7280" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Plus size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.editCoverButton}>
            <Edit3 size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameSection}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addInfoButton}>
            <Text style={styles.addInfoText}>+ Add your professional title</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addInfoButton}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.addInfoText}>+ Add your location</Text>
          </TouchableOpacity>
          <View style={styles.joinInfo}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.joinDate}>{userProfile.joinDate}</Text>
          </View>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Eye size={20} color="#2563EB" />
            <Text style={styles.statNumber}>{userProfile.views}</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={20} color="#10B981" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={styles.statNumber}>{userProfile.completionRate}%</Text>
            <Text style={styles.statLabel}>Profile Complete</Text>
          </View>
        </View>

        {/* Profile Completion */}
        <View style={styles.section}>
          {renderProfileCompletion()}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={16} color="#2563EB" />
            <Text style={styles.actionText}>Download Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={16} color="#2563EB" />
            <Text style={styles.actionText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
            <Edit3 size={16} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.primaryActionText]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          {renderEmptySkills()}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements & Badges</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {renderEmptyAchievements()}
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

            <TouchableOpacity style={styles.settingButton}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.settingButtonText}>Privacy & Security</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Download size={20} color="#6B7280" />
              <Text style={styles.settingButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    marginBottom: 12,
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
  addInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  addInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  joinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  completionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
});