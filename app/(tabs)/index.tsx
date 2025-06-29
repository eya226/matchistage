import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Briefcase, Target, Award, Clock, MapPin, Bell } from 'lucide-react-native';

export default function HomeScreen() {
  const stats = [
    { label: 'Active Applications', value: '0', icon: Briefcase, color: '#2563EB' },
    { label: 'Skill Match', value: '0%', icon: Target, color: '#10B981' },
    { label: 'Achievements', value: '0', icon: Award, color: '#F59E0B' },
    { label: 'Response Rate', value: 'N/A', icon: Clock, color: '#EF4444' },
  ];

  const quickActions = [
    {
      title: 'Complete Your Profile',
      description: 'Add your skills and experience to get better matches',
      progress: 25,
      action: 'Complete Now',
      color: '#2563EB',
    },
    {
      title: 'Discover Internships',
      description: 'Start swiping through curated opportunities',
      progress: 0,
      action: 'Start Exploring',
      color: '#10B981',
    },
    {
      title: 'Build Your Network',
      description: 'Connect with industry professionals',
      progress: 0,
      action: 'Start Networking',
      color: '#F59E0B',
    },
  ];

  const featuredOpportunities = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp Tunisia',
      location: 'Tunis, Tunisia',
      type: 'Internship',
      logo: 'https://images.pexels.com/photos/6615068/pexels-photo-6615068.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      featured: true,
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'Innovation Labs',
      location: 'Sfax, Tunisia',
      type: 'Internship',
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      featured: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to MatchiStage! 👋</Text>
            <Text style={styles.subtitle}>Let's start building your career</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Get Started</Text>
          </View>
          
          {quickActions.map((action, index) => (
            <View key={index} style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${action.progress}%`, backgroundColor: action.color }]} />
                  </View>
                  <Text style={styles.progressText}>{action.progress}% complete</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: action.color }]}>
                <Text style={styles.actionButtonText}>{action.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Featured Opportunities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Opportunities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {featuredOpportunities.map((opportunity) => (
            <TouchableOpacity key={opportunity.id} style={styles.opportunityCard}>
              <Image source={{ uri: opportunity.logo }} style={styles.companyLogo} />
              <View style={styles.opportunityInfo}>
                <View style={styles.opportunityHeader}>
                  <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                </View>
                <Text style={styles.companyName}>{opportunity.company}</Text>
                <View style={styles.opportunityMeta}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.opportunityLocation}>{opportunity.location}</Text>
                  <Text style={styles.opportunityType}>• {opportunity.type}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Career Resources</Text>
            <TouchableOpacity>
              <TrendingUp size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.resourcesGrid}>
            <TouchableOpacity style={styles.resourceCard}>
              <Text style={styles.resourceIcon}>📝</Text>
              <Text style={styles.resourceTitle}>Resume Tips</Text>
              <Text style={styles.resourceDescription}>Learn how to write a compelling resume</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard}>
              <Text style={styles.resourceIcon}>💼</Text>
              <Text style={styles.resourceTitle}>Interview Prep</Text>
              <Text style={styles.resourceDescription}>Ace your next interview with confidence</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Start Job Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Complete Profile</Text>
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
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
  actionContent: {
    marginBottom: 16,
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
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
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
  opportunityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  opportunityInfo: {
    flex: 1,
  },
  opportunityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  opportunityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  opportunityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opportunityLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  opportunityType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  resourcesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resourceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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