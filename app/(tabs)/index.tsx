import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Briefcase, Target, Award, Clock, MapPin, Bell, Plus, ArrowRight, Eye, Settings, User, CreditCard as Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import { dataService, Job } from '@/services/dataService';
import ProgressBar from '@/components/ProgressBar';
import Badge from '@/components/Badge';
import MatchIndicator from '@/components/MatchIndicator';

export default function HomeScreen() {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    profileViews: 127,
    responseRate: 0,
  });
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState([
    { id: 1, title: 'New Job Match', message: 'Frontend Developer at Vermeg - 95% match!', time: '2 hours ago', type: 'match' },
    { id: 2, title: 'Application Update', message: 'Microsoft Tunisia reviewed your application', time: '1 day ago', type: 'application' },
    { id: 3, title: 'Network Update', message: 'Sarah Mansouri wants to connect', time: '2 days ago', type: 'network' },
    { id: 4, title: 'Skill Achievement', message: 'You completed JavaScript Advanced course!', time: '3 days ago', type: 'achievement' },
    { id: 5, title: 'Interview Invitation', message: 'Orange Tunisia invited you for an interview', time: '1 week ago', type: 'interview' }
  ]);

  const loadData = async () => {
    try {
      const [jobs, analyticsData, profile] = await Promise.all([
        dataService.getJobs(),
        dataService.getAnalytics(),
        dataService.getUserProfile(),
      ]);
      
      // Get top 3 recommended jobs
      setRecommendedJobs(jobs.slice(0, 3));
      setAnalytics(analyticsData);
      setProfileCompletion(profile.profileCompletion);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Navigation handlers
  const handleCompleteProfile = () => {
    if (profileCompletion < 100) {
      router.push('/profile-setup');
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleStartExploring = () => {
    router.push('/(tabs)/jobs');
  };

  const handleStartNetworking = () => {
    router.push('/(tabs)/network');
  };

  const handleViewAllJobs = () => {
    router.push('/(tabs)/jobs');
  };

  const handleViewAllAchievements = () => {
    Alert.alert(
      'Achievements & Badges',
      'Your achievement collection:\n\n🏆 Profile Creator - First step completed\n⭐ Skill Builder - 6 skills added\n🎯 Job Hunter - 3 applications submitted\n🤝 Networker - 5 connections made\n📚 Learner - 15 lessons completed',
      [
        { text: 'View Skills Progress', onPress: () => router.push('/(tabs)/skills') },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleDiscoverJobs = () => {
    router.push('/(tabs)/jobs');
  };

  const handleUpdateProfile = () => {
    router.push('/(tabs)/profile');
  };

  const handleJobPress = (job: Job) => {
    Alert.alert(
      job.title,
      `${job.company} - ${job.location}\n\nMatch: ${job.match}%\nSalary: ${job.salary}\nType: ${job.type}\n\n${job.description.substring(0, 150)}...\n\nWould you like to apply?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => router.push('/(tabs)/jobs') },
        { text: 'Quick Apply', onPress: () => handleQuickApply(job) }
      ]
    );
  };

  const handleQuickApply = async (job: Job) => {
    try {
      await dataService.submitApplication({
        jobId: job.id.toString(),
        jobTitle: job.title,
        company: job.company,
        appliedAt: new Date().toISOString(),
        status: 'pending',
        coverLetter: `I am very interested in the ${job.title} position at ${job.company}. With my background in ${job.skills.slice(0, 3).join(', ')}, I believe I would be a great fit for this role.`,
        source: job.source,
      });
      
      Alert.alert(
        'Application Submitted! 🎉',
        `Your application for ${job.title} at ${job.company} has been submitted successfully.\n\nNext steps:\n• Your application will be reviewed within 3-5 business days\n• You'll receive email updates on your application status\n• Prepare for potential interview questions`,
        [
          { text: 'View Applications', onPress: () => router.push('/(tabs)/applications') },
          { text: 'Continue Browsing', onPress: () => router.push('/(tabs)/jobs') },
          { text: 'OK', style: 'default' }
        ]
      );
      
      // Refresh data to update analytics
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const handleNotifications = () => {
    const unreadCount = notifications.length;
    const notificationsList = notifications.map(notif => 
      `${getNotificationIcon(notif.type)} ${notif.title}\n   ${notif.message}\n   ${notif.time}`
    ).join('\n\n');

    Alert.alert(
      `Notifications (${unreadCount})`,
      notificationsList,
      [
        { text: 'Mark All as Read', onPress: () => Alert.alert('Success', 'All notifications marked as read') },
        { text: 'Settings', onPress: () => router.push('/(tabs)/profile') },
        { text: 'Close', style: 'default' }
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return '🎯';
      case 'application': return '📋';
      case 'network': return '🤝';
      case 'achievement': return '🏆';
      case 'interview': return '💼';
      default: return '📢';
    }
  };

  const stats = [
    { 
      label: 'Active Applications', 
      value: analytics.totalApplications.toString(), 
      icon: Briefcase, 
      color: '#2563EB',
      change: '+2 this week',
      onPress: () => router.push('/(tabs)/applications')
    },
    { 
      label: 'Profile Views', 
      value: analytics.profileViews.toString(), 
      icon: Eye, 
      color: '#10B981',
      change: '+15 this week',
      onPress: () => router.push('/(tabs)/profile')
    },
    { 
      label: 'Match Rate', 
      value: '85%', 
      icon: Target, 
      color: '#F59E0B',
      change: '+5% this month',
      onPress: () => router.push('/(tabs)/jobs')
    },
    { 
      label: 'Response Rate', 
      value: analytics.responseRate > 0 ? `${Math.round(analytics.responseRate)}%` : '12%', 
      icon: Clock, 
      color: '#EF4444',
      change: 'Improving',
      onPress: () => router.push('/(tabs)/applications')
    },
  ];

  const quickActions = [
    {
      title: 'Complete Your Profile',
      description: profileCompletion >= 90 ? 'Your profile looks great! Keep it updated.' : 'Add your skills and experience to get better matches',
      progress: profileCompletion,
      action: profileCompletion >= 90 ? 'Update Profile' : 'Complete Now',
      color: '#2563EB',
      icon: Target,
      onPress: handleCompleteProfile,
    },
    {
      title: 'Discover New Opportunities',
      description: 'Browse through curated internships matching your skills',
      progress: 0,
      action: 'Start Exploring',
      color: '#10B981',
      icon: TrendingUp,
      onPress: handleStartExploring,
    },
    {
      title: 'Build Your Network',
      description: 'Connect with industry professionals and mentors',
      progress: 0,
      action: 'Start Networking',
      color: '#F59E0B',
      icon: Award,
      onPress: handleStartNetworking,
    },
  ];

  const achievements = [
    { type: 'achievement' as const, title: 'First Step', description: 'Profile created', earned: true },
    { type: 'skill' as const, title: 'Skill Builder', description: 'Add 5 skills', earned: profileCompletion >= 70 },
    { type: 'milestone' as const, title: 'Applicant', description: 'First application', earned: analytics.totalApplications > 0 },
    { type: 'social' as const, title: 'Networker', description: 'Make connections', earned: false },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back, Eya! 👋</Text>
            <Text style={styles.subtitle}>Ready to find your next opportunity?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
            <Bell size={20} color="#6B7280" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notifications.length}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard} onPress={stat.onPress}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Completion */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.completionCard} onPress={handleCompleteProfile}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>Profile Strength</Text>
              <MatchIndicator percentage={profileCompletion} size={50} />
            </View>
            <ProgressBar 
              progress={profileCompletion} 
              color="#2563EB"
              showPercentage={false}
            />
            <Text style={styles.completionDescription}>
              {profileCompletion >= 90 
                ? "Excellent! Your profile is complete and optimized for recruiters."
                : "Complete your profile to get 5x more views and better job matches"
              }
            </Text>
            <View style={styles.completionButton}>
              <Text style={styles.completionButtonText}>
                {profileCompletion >= 90 ? 'Update Profile' : 'Complete Profile'}
              </Text>
              <ArrowRight size={16} color="#2563EB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard} onPress={action.onPress}>
              <View style={styles.actionHeader}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={20} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </View>
              {action.progress > 0 && (
                <View style={styles.actionProgress}>
                  <ProgressBar 
                    progress={action.progress} 
                    color={action.color}
                    height={6}
                    showPercentage={true}
                  />
                </View>
              )}
              <View style={[styles.actionButton, { backgroundColor: action.color }]}>
                <Text style={styles.actionButtonText}>{action.action}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={handleViewAllJobs}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recommendedJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => handleJobPress(job)}>
              <View style={styles.jobHeader}>
                <Image source={{ uri: job.logo }} style={styles.companyLogo} />
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.companyName}>{job.company}</Text>
                  <View style={styles.jobMeta}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.jobLocation}>{job.location}</Text>
                    <Text style={styles.jobType}>• {job.type}</Text>
                  </View>
                </View>
                <MatchIndicator percentage={job.match} size={40} />
              </View>
              
              <View style={styles.jobSkills}>
                {job.skills.slice(0, 3).map((skill, idx) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
                {job.skills.length > 3 && (
                  <Text style={styles.moreSkills}>+{job.skills.length - 3}</Text>
                )}
              </View>

              <View style={styles.jobActions}>
                <View style={styles.quickApplyButton}>
                  <Text style={styles.quickApplyText}>Tap to Apply</Text>
                </View>
                <Text style={styles.postedTime}>{job.postedTime}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Achievements</Text>
            <TouchableOpacity onPress={handleViewAllAchievements}>
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDiscoverJobs}>
            <Text style={styles.primaryButtonText}>Discover Jobs</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleUpdateProfile}>
            <Text style={styles.secondaryButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  statChange: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  completionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingVertical: 10,
  },
  completionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginRight: 6,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionProgress: {
    marginBottom: 12,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  jobLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  jobType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  jobSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: '#EBF4FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  moreSkills: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    alignSelf: 'center',
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickApplyButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickApplyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  postedTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
});