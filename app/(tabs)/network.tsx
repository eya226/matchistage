import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Users, UserPlus, Search, Filter, Plus, Briefcase, MapPin, Star, Award, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';

interface NetworkUser {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  mutualConnections: number;
  skills: string[];
  isConnected: boolean;
  connectionType: 'student' | 'professional' | 'recruiter' | 'mentor';
  university?: string;
  experience: string;
}

export default function NetworkScreen() {
  const [selectedTab, setSelectedTab] = useState('suggestions');
  const [searchText, setSearchText] = useState('');
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [connections, setConnections] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock network data
  const mockNetworkUsers: NetworkUser[] = [
    {
      id: 1,
      name: 'Ahmed Ben Ali',
      title: 'Software Engineer',
      company: 'Microsoft Tunisia',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 5,
      skills: ['React', 'Node.js', 'Azure'],
      isConnected: false,
      connectionType: 'professional',
      experience: '3 years',
    },
    {
      id: 2,
      name: 'Fatma Trabelsi',
      title: 'Data Scientist',
      company: 'Orange Tunisia',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 3,
      skills: ['Python', 'Machine Learning', 'SQL'],
      isConnected: false,
      connectionType: 'professional',
      experience: '4 years',
    },
    {
      id: 3,
      name: 'Mohamed Gharbi',
      title: 'Computer Science Student',
      company: 'ESPRIT',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 8,
      skills: ['JavaScript', 'React', 'Python'],
      isConnected: false,
      connectionType: 'student',
      university: 'ESPRIT',
      experience: 'Student',
    },
    {
      id: 4,
      name: 'Sarah Mansouri',
      title: 'Senior Recruiter',
      company: 'Vermeg',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 12,
      skills: ['Talent Acquisition', 'HR', 'Recruitment'],
      isConnected: false,
      connectionType: 'recruiter',
      experience: '6 years',
    },
    {
      id: 5,
      name: 'Dr. Karim Bouaziz',
      title: 'Tech Lead & Mentor',
      company: 'Instadeep',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 2,
      skills: ['AI/ML', 'Leadership', 'Mentoring'],
      isConnected: false,
      connectionType: 'mentor',
      experience: '10+ years',
    },
    {
      id: 6,
      name: 'Ines Khelifi',
      title: 'UX/UI Designer',
      company: 'Tunisie Telecom',
      location: 'Tunis, Tunisia',
      avatar: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualConnections: 4,
      skills: ['Figma', 'User Research', 'Prototyping'],
      isConnected: false,
      connectionType: 'professional',
      experience: '2 years',
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNetworkUsers(mockNetworkUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleConnect = async (userId: number) => {
    try {
      const user = networkUsers.find(u => u.id === userId);
      if (user) {
        // Update user connection status
        setNetworkUsers(prev => 
          prev.map(u => u.id === userId ? { ...u, isConnected: true } : u)
        );
        
        // Add to connections
        setConnections(prev => [...prev, { ...user, isConnected: true }]);
        
        Alert.alert('Success', `Connection request sent to ${user.name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send connection request');
    }
  };

  const handleMessage = (userId: number) => {
    const user = networkUsers.find(u => u.id === userId);
    Alert.alert('Message', `Start conversation with ${user?.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Message', onPress: () => console.log('Message sent') }
    ]);
  };

  const handleFindMoreConnections = () => {
    Alert.alert(
      'Find More Connections',
      'Discover more professionals in your field:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Browse Students', onPress: () => setSelectedTab('students') },
        { text: 'Find Professionals', onPress: () => setSelectedTab('professionals') },
        { text: 'Connect with Recruiters', onPress: () => setSelectedTab('recruiters') },
        { text: 'Find Mentors', onPress: () => setSelectedTab('mentors') },
      ]
    );
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      Alert.alert('Search Results', `Searching for "${searchText}"...`);
    }
  };

  const handleFilter = () => {
    Alert.alert(
      'Filter Connections',
      'Filter by:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Location', onPress: () => console.log('Filter by location') },
        { text: 'Company', onPress: () => console.log('Filter by company') },
        { text: 'Skills', onPress: () => console.log('Filter by skills') },
        { text: 'Experience Level', onPress: () => console.log('Filter by experience') },
      ]
    );
  };

  const getFilteredUsers = () => {
    let filtered = networkUsers;
    
    switch (selectedTab) {
      case 'connections':
        filtered = connections;
        break;
      case 'students':
        filtered = networkUsers.filter(u => u.connectionType === 'student');
        break;
      case 'professionals':
        filtered = networkUsers.filter(u => u.connectionType === 'professional');
        break;
      case 'recruiters':
        filtered = networkUsers.filter(u => u.connectionType === 'recruiter');
        break;
      case 'mentors':
        filtered = networkUsers.filter(u => u.connectionType === 'mentor');
        break;
      default:
        filtered = networkUsers.filter(u => !u.isConnected);
    }

    if (searchText) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.title.toLowerCase().includes(searchText.toLowerCase()) ||
        user.company.toLowerCase().includes(searchText.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const tabs = [
    { id: 'suggestions', label: 'Suggestions', count: networkUsers.filter(u => !u.isConnected).length },
    { id: 'connections', label: 'Connections', count: connections.length },
    { id: 'students', label: 'Students', count: networkUsers.filter(u => u.connectionType === 'student').length },
    { id: 'professionals', label: 'Professionals', count: networkUsers.filter(u => u.connectionType === 'professional').length },
    { id: 'recruiters', label: 'Recruiters', count: networkUsers.filter(u => u.connectionType === 'recruiter').length },
    { id: 'mentors', label: 'Mentors', count: networkUsers.filter(u => u.connectionType === 'mentor').length },
  ];

  const getConnectionTypeIcon = (type: NetworkUser['connectionType']) => {
    switch (type) {
      case 'student': return Award;
      case 'professional': return Briefcase;
      case 'recruiter': return Users;
      case 'mentor': return TrendingUp;
      default: return Users;
    }
  };

  const getConnectionTypeColor = (type: NetworkUser['connectionType']) => {
    switch (type) {
      case 'student': return '#F59E0B';
      case 'professional': return '#2563EB';
      case 'recruiter': return '#10B981';
      case 'mentor': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const renderUserCard = (user: NetworkUser) => {
    const TypeIcon = getConnectionTypeIcon(user.connectionType);
    const typeColor = getConnectionTypeColor(user.connectionType);

    return (
      <View key={user.id} style={styles.userCard}>
        <View style={styles.userHeader}>
          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userTitle}>{user.title}</Text>
            <Text style={styles.userCompany}>{user.company}</Text>
            <View style={styles.userLocation}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          </View>
          <View style={[styles.typeIndicator, { backgroundColor: `${typeColor}15` }]}>
            <TypeIcon size={16} color={typeColor} />
          </View>
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.experienceText}>{user.experience} experience</Text>
          {user.mutualConnections > 0 && (
            <View style={styles.mutualConnections}>
              <Users size={12} color="#6B7280" />
              <Text style={styles.mutualText}>{user.mutualConnections} mutual connections</Text>
            </View>
          )}
        </View>

        <View style={styles.skillsContainer}>
          {user.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {user.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{user.skills.length - 3}</Text>
          )}
        </View>

        <View style={styles.userActions}>
          {user.isConnected ? (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.messageButton]}
                onPress={() => handleMessage(user.id)}
              >
                <MessageCircle size={16} color="#2563EB" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              <Text style={styles.connectedText}>Connected</Text>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.connectButton]}
                onPress={() => handleConnect(user.id)}
              >
                <UserPlus size={16} color="#FFFFFF" />
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.messageButton]}
                onPress={() => handleMessage(user.id)}
              >
                <MessageCircle size={16} color="#2563EB" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    let icon, title, description, actionText;

    switch (selectedTab) {
      case 'connections':
        icon = <Users size={64} color="#D1D5DB" />;
        title = 'No Connections Yet';
        description = 'Start building your professional network by connecting with industry professionals, fellow students, and potential mentors.';
        actionText = 'Find People';
        break;
      case 'mentors':
        icon = <TrendingUp size={64} color="#D1D5DB" />;
        title = 'Find Your Mentor';
        description = 'Connect with experienced professionals who can guide your career journey and provide valuable insights.';
        actionText = 'Browse Mentors';
        break;
      default:
        icon = <UserPlus size={64} color="#D1D5DB" />;
        title = 'No Suggestions Available';
        description = 'Complete your profile and add your skills to get personalized connection suggestions based on your interests and career goals.';
        actionText = 'Complete Profile';
    }

    return (
      <View style={styles.emptyContainer}>
        {icon}
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDescription}>{description}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleFindMoreConnections}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
        
        {selectedTab === 'mentors' && (
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
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading network...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network</Text>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
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
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.usersContainer}>
            {filteredUsers.map(renderUserCard)}
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  usersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  userTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  userLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  typeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginBottom: 12,
  },
  experienceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  mutualConnections: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutualText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
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
  userActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  connectButton: {
    backgroundColor: '#2563EB',
    flex: 1,
    justifyContent: 'center',
  },
  connectButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  messageButton: {
    backgroundColor: '#EBF4FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  messageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 6,
  },
  connectedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
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
    marginTop: 40,
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