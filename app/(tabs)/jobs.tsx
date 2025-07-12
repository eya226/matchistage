import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, PanResponder, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, DollarSign, Heart, X, ArrowUp, Briefcase, Users, Star, ExternalLink, Bookmark, Filter, Wifi, WifiOff, Eye, Building, Calendar, Award } from 'lucide-react-native';
import { dataService, Job } from '@/services/dataService';
import { storageService } from '@/services/storageService';
import QuickApplyModal from '@/components/QuickApplyModal';
import JobDetailsModal from '@/components/JobDetailsModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;
const CARD_WIDTH = SCREEN_WIDTH - 40;

export default function JobsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [lowDataMode, setLowDataMode] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

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
        await storageService.saveJobsForOffline(jobsData);
      } else {
        jobsData = await storageService.getOfflineJobs();
      }
      
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
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
      
      // Rotation based on horizontal movement
      const rotationValue = gestureState.dx / SCREEN_WIDTH * 0.3;
      rotation.setValue(rotationValue);
      
      // Scale effect for vertical movement
      const scaleValue = 1 - Math.abs(gestureState.dy) / SCREEN_HEIGHT * 0.1;
      scale.setValue(Math.max(0.9, scaleValue));
      
      // Opacity for dramatic effect
      const opacityValue = 1 - Math.abs(gestureState.dx) / SCREEN_WIDTH * 0.3;
      opacity.setValue(Math.max(0.7, opacityValue));
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const threshold = SCREEN_WIDTH * 0.25;
      
      if (Math.abs(dx) > threshold) {
        const direction = dx > 0 ? 1 : -1;
        const action = direction > 0 ? 'apply' : 'pass';
        handleSwipeAction(action);
      } else if (dy < -SCREEN_HEIGHT * 0.2) {
        handleSwipeAction('save');
      } else {
        // Snap back with spring animation
        Animated.parallel([
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(rotation, {
            toValue: 0,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }),
        ]).start();
      }
    },
  });

  const handleSwipeAction = (action: 'pass' | 'save' | 'apply') => {
    const currentJob = jobs[currentIndex];
    if (!currentJob) return;

    let targetX = 0;
    let targetY = 0;
    let targetRotation = 0;

    switch (action) {
      case 'pass':
        targetX = -SCREEN_WIDTH * 1.5;
        targetRotation = -0.5;
        break;
      case 'apply':
        targetX = SCREEN_WIDTH * 1.5;
        targetRotation = 0.5;
        setSelectedJob(currentJob);
        setShowQuickApply(true);
        break;
      case 'save':
        targetY = -SCREEN_HEIGHT;
        handleBookmark(currentJob.id);
        break;
    }

    // Animate card out
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: targetX, y: targetY },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: targetRotation,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Reset animations and move to next card
      setCurrentIndex(prev => prev + 1);
      position.setValue({ x: 0, y: 0 });
      rotation.setValue(0);
      scale.setValue(1);
      opacity.setValue(1);
    });
  };

  const handleCardTap = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleBookmark = async (jobId: number) => {
    try {
      await dataService.bookmarkJob(jobId);
      await storageService.addBookmark(jobId);
      
      // Show success animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
      
      Alert.alert('Saved! 💾', 'Job saved to your bookmarks');
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
        source: selectedJob?.source || 'app',
      });
      
      Alert.alert('Success! 🎉', 'Your application has been submitted successfully');
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const renderCard = (job: Job, index: number) => {
    if (index < currentIndex) return null;
    if (index > currentIndex + 2) return null;

    const isTop = index === currentIndex;
    const isSecond = index === currentIndex + 1;
    const isThird = index === currentIndex + 2;

    let cardStyle = {};
    let zIndex = jobs.length - index;

    if (isTop) {
      cardStyle = {
        transform: [
          ...position.getTranslateTransform(),
          {
            rotate: rotation.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: ['-15deg', '0deg', '15deg'],
            }),
          },
          { scale },
        ],
        opacity,
        zIndex: zIndex + 10,
      };
    } else if (isSecond) {
      cardStyle = {
        transform: [{ scale: 0.95 }, { translateY: 10 }],
        opacity: 0.8,
        zIndex: zIndex + 5,
      };
    } else if (isThird) {
      cardStyle = {
        transform: [{ scale: 0.9 }, { translateY: 20 }],
        opacity: 0.6,
        zIndex: zIndex,
      };
    }

    return (
      <Animated.View
        key={job.id}
        style={[styles.card, cardStyle]}
        {...(isTop ? panResponder.panHandlers : {})}
      >
        <TouchableOpacity 
          style={styles.cardTouchable}
          onPress={() => handleCardTap(job)}
          activeOpacity={0.95}
        >
          {/* Banner Image */}
          {!lowDataMode && (
            <View style={styles.bannerContainer}>
              <Image source={{ uri: job.banner }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay} />
            </View>
          )}
          
          {/* Match Badge */}
          <View style={[styles.matchBadge, { backgroundColor: getMatchColor(job.match) }]}>
            <Text style={styles.matchText}>{job.match}% Match</Text>
          </View>

          {/* Source Badge */}
          <View style={styles.sourceBadge}>
            <ExternalLink size={12} color="#FFFFFF" />
            <Text style={styles.sourceText}>{job.source}</Text>
          </View>

          {/* Bookmark Badge */}
          {job.isBookmarked && (
            <View style={styles.bookmarkBadge}>
              <Bookmark size={12} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}

          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Company Header */}
            <View style={styles.companyHeader}>
              <Image source={{ uri: job.logo }} style={styles.companyLogo} />
              <View style={styles.companyInfo}>
                <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{job.rating.toFixed(1)}</Text>
                  <Users size={14} color="#6B7280" />
                  <Text style={styles.teamSize}>{job.teamSize}</Text>
                </View>
              </View>
            </View>

            {/* Job Details */}
            <View style={styles.jobDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{job.location}</Text>
                {job.remote && (
                  <View style={styles.remoteBadge}>
                    <Text style={styles.remoteText}>Remote</Text>
                  </View>
                )}
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

            {/* Description Preview */}
            <Text style={styles.description} numberOfLines={3}>
              {job.description}
            </Text>

            {/* Skills */}
            <View style={styles.skillsContainer}>
              <Text style={styles.skillsTitle}>Required Skills:</Text>
              <View style={styles.skillsList}>
                {job.skills.slice(0, 4).map((skill, idx) => (
                  <View key={idx} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
                {job.skills.length > 4 && (
                  <View style={styles.moreSkillsChip}>
                    <Text style={styles.moreSkillsText}>+{job.skills.length - 4}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Benefits Preview */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              <View style={styles.benefitsList}>
                {job.benefits.slice(0, 3).map((benefit, idx) => (
                  <Text key={idx} style={styles.benefitText}>• {benefit}</Text>
                ))}
              </View>
            </View>

            {/* Application Deadline */}
            <View style={styles.deadlineContainer}>
              <Calendar size={14} color="#EF4444" />
              <Text style={styles.deadlineText}>Apply by: {job.applicationDeadline}</Text>
            </View>

            {/* Tap to View More */}
            <View style={styles.tapHint}>
              <Eye size={16} color="#2563EB" />
              <Text style={styles.tapHintText}>Tap to view full details</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return '#10B981';
    if (match >= 75) return '#F59E0B';
    if (match >= 60) return '#EF4444';
    return '#6B7280';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={styles.loadingSpinner}>
            <Briefcase size={48} color="#2563EB" />
          </Animated.View>
          <Text style={styles.loadingTitle}>Finding Perfect Matches...</Text>
          <Text style={styles.loadingSubtitle}>Analyzing opportunities for you</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Award size={64} color="#10B981" />
          <Text style={styles.emptyTitle}>All Caught Up! 🎉</Text>
          <Text style={styles.emptySubtitle}>
            {isOnline 
              ? "You've reviewed all available opportunities. Check back later for new matches!"
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover Jobs</Text>
          <Text style={styles.headerSubtitle}>
            Swipe right to apply • left to pass • up to save
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

      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <WifiOff size={16} color="#EF4444" />
          <Text style={styles.offlineText}>Offline Mode - Showing saved jobs</Text>
        </View>
      )}

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {jobs.map((job, index) => renderCard(job, index))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipeAction('pass')}
        >
          <X size={24} color="#EF4444" />
          <Text style={styles.actionButtonText}>Pass</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => handleSwipeAction('save')}
        >
          <ArrowUp size={24} color="#F59E0B" />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.applyButton]}
          onPress={() => handleSwipeAction('apply')}
        >
          <Heart size={24} color="#10B981" />
          <Text style={styles.actionButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Job Details Modal */}
      <JobDetailsModal
        visible={showJobDetails}
        onClose={() => setShowJobDetails(false)}
        job={selectedJob}
        onApply={(job) => {
          setShowJobDetails(false);
          setSelectedJob(job);
          setShowQuickApply(true);
        }}
        onSave={(job) => handleBookmark(job.id)}
      />

      {/* Quick Apply Modal */}
      <QuickApplyModal
        visible={showQuickApply}
        onClose={() => {
          setShowQuickApply(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onApply={handleQuickApply}
      />
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
    fontSize: 12,
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
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 20,
  },
  bannerContainer: {
    position: 'relative',
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  sourceBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
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
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  teamSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
    flex: 1,
  },
  remoteBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  remoteText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  moreSkillsChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moreSkillsText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  deadlineText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 6,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 8,
  },
  tapHintText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    gap: 20,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
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