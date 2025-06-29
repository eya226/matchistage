import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, DollarSign, Heart, X, ArrowUp, Briefcase, Users, Star, ExternalLink } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function JobsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Real internship opportunities from various platforms
  const jobs = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Microsoft Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1500-2000 TND',
      type: 'Summer Internship',
      duration: '3 months',
      match: 95,
      logo: 'https://images.pexels.com/photos/6615068/pexels-photo-6615068.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      banner: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      postedTime: '2 hours ago',
      skills: ['React', 'TypeScript', 'Node.js', 'Azure'],
      benefits: ['Health Insurance', 'Flexible Hours', 'Mentorship', 'Full-time Offer Potential'],
      description: 'Join our engineering team to work on cutting-edge cloud solutions. You\'ll collaborate with senior engineers on real projects that impact millions of users.',
      teamSize: '50-100',
      rating: 4.8,
      source: 'LinkedIn',
      requirements: ['Computer Science student', '3rd year or above', 'Strong programming skills'],
      applicationDeadline: 'March 15, 2024',
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'Orange Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1200-1800 TND',
      type: 'Research Internship',
      duration: '6 months',
      match: 87,
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      banner: 'https://images.pexels.com/photos/3182755/pexels-photo-3182755.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      postedTime: '4 hours ago',
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
      benefits: ['Training Programs', 'Industry Exposure', 'Research Publications'],
      description: 'Work with our data science team to analyze customer behavior and develop predictive models for telecommunications.',
      teamSize: '10-25',
      rating: 4.6,
      source: 'Indeed',
      requirements: ['Statistics/Data Science background', 'Python proficiency', 'Final year student'],
      applicationDeadline: 'March 20, 2024',
    },
    {
      id: 3,
      title: 'Frontend Developer Intern',
      company: 'Vermeg',
      location: 'Tunis, Tunisia',
      salary: '1000-1500 TND',
      type: 'Technical Internship',
      duration: '4 months',
      match: 82,
      logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      banner: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      postedTime: '1 day ago',
      skills: ['Vue.js', 'JavaScript', 'CSS', 'Git'],
      benefits: ['Continuous Learning', 'Performance Bonus', 'Flexible Schedule'],
      description: 'Join our fintech team to build modern web applications for financial services. Great opportunity to learn industry best practices.',
      teamSize: '25-50',
      rating: 4.4,
      source: 'Glassdoor',
      requirements: ['Web development knowledge', 'Portfolio required', 'Available full-time'],
      applicationDeadline: 'March 25, 2024',
    },
    {
      id: 4,
      title: 'Mobile App Development Intern',
      company: 'Expensya',
      location: 'Tunis, Tunisia',
      salary: '1300-1700 TND',
      type: 'Product Internship',
      duration: '5 months',
      match: 78,
      logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      banner: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      postedTime: '2 days ago',
      skills: ['React Native', 'Flutter', 'Firebase', 'REST APIs'],
      benefits: ['Startup Environment', 'Stock Options', 'International Exposure'],
      description: 'Help build the next generation of expense management mobile applications used by thousands of businesses worldwide.',
      teamSize: '15-30',
      rating: 4.7,
      source: 'AngelList',
      requirements: ['Mobile development experience', 'Strong problem-solving', 'Team player'],
      applicationDeadline: 'April 1, 2024',
    },
    {
      id: 5,
      title: 'DevOps Engineering Intern',
      company: 'Sofrecom Tunisia',
      location: 'Tunis, Tunisia',
      salary: '1400-1900 TND',
      type: 'Infrastructure Internship',
      duration: '6 months',
      match: 74,
      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      banner: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      postedTime: '3 days ago',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
      benefits: ['Cloud Certifications', 'Technical Training', 'Career Growth'],
      description: 'Learn cloud infrastructure and automation while working on enterprise-scale telecommunications projects.',
      teamSize: '20-40',
      rating: 4.5,
      source: 'Internshala',
      requirements: ['Linux knowledge', 'Scripting skills', 'Cloud interest'],
      applicationDeadline: 'April 5, 2024',
    },
  ];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
      rotation.setValue(gestureState.dx / SCREEN_WIDTH * 0.4);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      
      if (Math.abs(dx) > SCREEN_WIDTH * 0.25) {
        const direction = dx > 0 ? 1 : -1;
        Animated.timing(position, {
          toValue: { x: direction * SCREEN_WIDTH, y: dy },
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          setCurrentIndex(prev => prev + 1);
          position.setValue({ x: 0, y: 0 });
          rotation.setValue(0);
        });
      } else if (dy < -SCREEN_HEIGHT * 0.25) {
        Animated.timing(position, {
          toValue: { x: 0, y: -SCREEN_HEIGHT },
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          setCurrentIndex(prev => prev + 1);
          position.setValue({ x: 0, y: 0 });
          rotation.setValue(0);
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        Animated.spring(rotation, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleAction = (action: 'pass' | 'save' | 'apply') => {
    let targetX = 0;
    let targetY = 0;

    switch (action) {
      case 'pass':
        targetX = -SCREEN_WIDTH;
        break;
      case 'apply':
        targetX = SCREEN_WIDTH;
        break;
      case 'save':
        targetY = -SCREEN_HEIGHT;
        break;
    }

    Animated.timing(position, {
      toValue: { x: targetX, y: targetY },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(prev => prev + 1);
      position.setValue({ x: 0, y: 0 });
      rotation.setValue(0);
    });
  };

  const renderCard = (job: typeof jobs[0], index: number) => {
    if (index < currentIndex) return null;
    if (index > currentIndex + 1) return null;

    const isTop = index === currentIndex;
    const animatedStyle = isTop ? {
      transform: [
        ...position.getTranslateTransform(),
        {
          rotate: rotation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-10deg', '0deg', '10deg'],
          }),
        },
      ],
    } : {};

    return (
      <Animated.View
        key={job.id}
        style={[
          styles.card,
          animatedStyle,
          { zIndex: jobs.length - index },
        ]}
        {...(isTop ? panResponder.panHandlers : {})}
      >
        <Image source={{ uri: job.banner }} style={styles.bannerImage} />
        
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{job.match}% Match</Text>
        </View>

        <View style={styles.sourceBadge}>
          <ExternalLink size={12} color="#FFFFFF" />
          <Text style={styles.sourceText}>{job.source}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.companyHeader}>
            <Image source={{ uri: job.logo }} style={styles.companyLogo} />
            <View style={styles.companyInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{job.rating}</Text>
                <Users size={14} color="#6B7280" />
                <Text style={styles.teamSize}>{job.teamSize}</Text>
              </View>
            </View>
          </View>

          <View style={styles.jobDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <DollarSign size={16} color="#6B7280" />
              <Text style={styles.detailText}>{job.salary}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>{job.duration} • {job.postedTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Briefcase size={16} color="#6B7280" />
              <Text style={styles.detailText}>{job.type}</Text>
            </View>
          </View>

          <Text style={styles.description}>{job.description}</Text>

          <View style={styles.skillsContainer}>
            <Text style={styles.skillsTitle}>Required Skills:</Text>
            <View style={styles.skillsList}>
              {job.skills.map((skill, idx) => (
                <View key={idx} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            <View style={styles.requirementsList}>
              {job.requirements.map((req, idx) => (
                <Text key={idx} style={styles.requirementText}>• {req}</Text>
              ))}
            </View>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefits:</Text>
            <View style={styles.benefitsList}>
              {job.benefits.map((benefit, idx) => (
                <Text key={idx} style={styles.benefitText}>• {benefit}</Text>
              ))}
            </View>
          </View>

          <View style={styles.deadlineContainer}>
            <Text style={styles.deadlineLabel}>Application Deadline:</Text>
            <Text style={styles.deadlineText}>{job.applicationDeadline}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (currentIndex >= jobs.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Briefcase size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No More Opportunities</Text>
          <Text style={styles.emptySubtitle}>Check back later for new internships and job openings</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Opportunities</Text>
        <Text style={styles.headerSubtitle}>Swipe right to apply, left to pass, up to save</Text>
      </View>

      <View style={styles.cardsContainer}>
        {jobs.map((job, index) => renderCard(job, index))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleAction('pass')}
        >
          <X size={24} color="#EF4444" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => handleAction('save')}
        >
          <ArrowUp size={24} color="#F59E0B" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.applyButton]}
          onPress={() => handleAction('apply')}
        >
          <Heart size={24} color="#10B981" />
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
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  sourceBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  companyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  jobTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
    marginRight: 12,
  },
  teamSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  jobDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  skillsList: {
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
  requirementsContainer: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  requirementsList: {
    gap: 4,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  benefitsList: {
    gap: 4,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  deadlineContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  deadlineLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  deadlineText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#D97706',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 16,
  },
  passButton: {
    backgroundColor: '#FEE2E2',
  },
  saveButton: {
    backgroundColor: '#FEF3C7',
  },
  applyButton: {
    backgroundColor: '#D1FAE5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  resetButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});