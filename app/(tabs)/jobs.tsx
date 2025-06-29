import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, DollarSign, Heart, X, ArrowUp, Briefcase, Users, Star, ExternalLink, Bookmark, Filter, Wifi, WifiOff } from 'lucide-react-native';
import { dataService, Job } from '@/services/dataService';
import { storageService } from '@/services/storageService';
import QuickApplyModal from '@/components/QuickApplyModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function JobsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [lowDataMode, setLowDataMode] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadJobs();
    loadUserPreferences();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      let jobsData: Job[];
      
      if (isOnline) {
        jobsData = await dataService.getJobs();
        // Save for offline use
        await storageService.saveJobsForOffline(jobsData);
      } else {
        // Load from offline storage
        jobsData = await storageService.getOfflineJobs();
      }
      
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
      // Try to load offline data as fallback
      const offlineJobs = await storageService.getOfflineJobs();
      setJobs(offlineJobs);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    const preferences = await storageService.getUserPreferences();
    setLowDataMode(preferences.dataUsage === 'low');
  };

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
        const action = direction > 0 ? 'apply' : 'pass';
        handleSwipeAction(action);
      } else if (dy < -SCREEN_HEIGHT * 0.25) {
        handleSwipeAction('save');
      } else {
        // Snap back to center
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

  const handleSwipeAction = (action: 'pass' | 'save' | 'apply') => {
    const currentJob = jobs[currentIndex];
    if (!currentJob) return;

    let targetX = 0;
    let targetY = 0;

    switch (action) {
      case 'pass':
        targetX = -SCREEN_WIDTH;
        break;
      case 'apply':
        targetX = SCREEN_WIDTH;
        // Show quick apply modal
        setSelectedJob(currentJob);
        setShowQuickApply(true);
        break;
      case 'save':
        targetY = -SCREEN_HEIGHT;
        handleBookmark(currentJob.id);
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

  const handleAction = (action: 'pass' | 'save' | 'apply') => {
    handleSwipeAction(action);
  };

  const handleBookmark = async (jobId: number) => {
    try {
      await dataService.bookmarkJob(jobId);
      await storageService.addBookmark(jobId);
      Alert.alert('Saved!', 'Job saved to your bookmarks');
    } catch (error) {
      console.error('Error bookmarking job:', error);
    }
  };

  const handleQuickApply = async (applicationData: any) => {
    try {
      await dataService.submitApplication({
        jobId: applicationData.jobId,
        jobTitle: selectedJob?.title || '',
        company: selectedJob?.company || '',
        appliedAt: applicationData.appliedAt,
        status: 'pending',
        coverLetter: applicationData.coverLetter,
      });
      
      Alert.alert('Success!', 'Your application has been submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const renderCard = (job: Job, index: number) => {
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
        {/* Banner Image - Only load if not in low data mode */}
        {!lowDataMode && (
          <Image source={{ uri: job.banner }} style={styles.bannerImage} />
        )}
        
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{job.match}% Match</Text>
        </View>

        <View style={styles.sourceBadge}>
          <ExternalLink size={12} color="#FFFFFF" />
          <Text style={styles.sourceText}>{job.source}</Text>
        </View>

        {job.isBookmarked && (
          <View style={styles.bookmarkBadge}>
            <Bookmark size={12} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Briefcase size={48} color="#D1D5DB" />
          <Text style={styles.loadingTitle}>Loading Opportunities...</Text>
          <Text style={styles.loadingSubtitle}>Finding the best matches for you</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Briefcase size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No More Opportunities</Text>
          <Text style={styles.emptySubtitle}>
            {isOnline 
              ? "Check back later for new internships and job openings"
              : "Connect to internet to load more opportunities"
            }
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              setCurrentIndex(0);
              if (!isOnline) loadJobs();
            }}
          >
            <Text style={styles.resetButtonText}>
              {isOnline ? 'Start Over' : 'Retry Loading'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover Opportunities</Text>
          <Text style={styles.headerSubtitle}>
            Swipe right to apply, left to pass, up to save
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setLowDataMode(!lowDataMode)}
          >
            {isOnline ? (
              lowDataMode ? <WifiOff size={20} color="#6B7280" /> : <Wifi size={20} color="#6B7280" />
            ) : (
              <WifiOff size={20} color="#EF4444" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <WifiOff size={16} color="#EF4444" />
          <Text style={styles.offlineText}>Offline Mode - Showing saved jobs</Text>
        </View>
      )}

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

      {/* Quick Apply Modal */}
      {selectedJob && (
        <QuickApplyModal
          visible={showQuickApply}
          onClose={() => {
            setShowQuickApply(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onApply={handleQuickApply}
        />
      )}
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
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    gap: 8,
  },
  offlineText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
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
  bookmarkBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
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