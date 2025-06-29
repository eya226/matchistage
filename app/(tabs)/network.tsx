import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Users, UserPlus, Search, Filter, Plus, Briefcase } from 'lucide-react-native';

export default function NetworkScreen() {
  const [selectedTab, setSelectedTab] = useState('connections');
  const [searchText, setSearchText] = useState('');

  const tabs = [
    { id: 'connections', label: 'Connections', count: 0 },
    { id: 'suggestions', label: 'Suggestions', count: 0 },
    { id: 'mentors', label: 'Mentors', count: 0 },
  ];

  const renderEmptyConnections = () => (
    <View style={styles.emptyContainer}>
      <Users size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Connections Yet</Text>
      <Text style={styles.emptyDescription}>
        Start building your professional network by connecting with industry professionals, 
        fellow students, and potential mentors.
      </Text>
      <TouchableOpacity style={styles.actionButton}>
        <UserPlus size={20} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>Find People</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptySuggestions = () => (
    <View style={styles.emptyContainer}>
      <UserPlus size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Suggestions Available</Text>
      <Text style={styles.emptyDescription}>
        Complete your profile and add your skills to get personalized connection suggestions 
        based on your interests and career goals.
      </Text>
      <TouchableOpacity style={styles.actionButton}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>Complete Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyMentors = () => (
    <View style={styles.emptyContainer}>
      <Briefcase size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Find Your Mentor</Text>
      <Text style={styles.emptyDescription}>
        Connect with experienced professionals who can guide your career journey. 
        Mentors can provide valuable insights, advice, and industry connections.
      </Text>
      <TouchableOpacity style={styles.actionButton}>
        <Search size={20} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>Browse Mentors</Text>
      </TouchableOpacity>
      
      <View style={styles.mentorBenefits}>
        <Text style={styles.benefitsTitle}>Benefits of Having a Mentor:</Text>
        <View style={styles.benefitsList}>
          <Text style={styles.benefitText}>• Career guidance and advice</Text>
          <Text style={styles.benefitText}>• Industry insights and trends</Text>
          <Text style={styles.benefitText}>• Professional network expansion</Text>
          <Text style={styles.benefitText}>• Skill development recommendations</Text>
          <Text style={styles.benefitText}>• Interview and job search tips</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'connections':
        return renderEmptyConnections();
      case 'suggestions':
        return renderEmptySuggestions();
      case 'mentors':
        return renderEmptyMentors();
      default:
        return renderEmptyConnections();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search professionals..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText,
            ]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#EBF4FF',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  mentorBenefits: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});