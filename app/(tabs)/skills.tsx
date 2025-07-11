import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Award, TrendingUp, Play, CircleCheck as CheckCircle, Lock, Star, Clock, Users, Zap, Brain, Code, Database, Palette, MessageSquare, ChartBar as BarChart3, Shield, Globe, Smartphone, Cpu, Search, Filter, BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import ProgressBar from '@/components/ProgressBar';
import { skillsLearningService, SkillPath, Lesson } from '@/services/skillsLearningService';
import { userDataService } from '@/services/userDataService';
import LessonModal from '@/components/LessonModal';

export default function SkillsScreen() {
  const [selectedTab, setSelectedTab] = useState('discover');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillPath | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalSkills: 0,
    completedSkills: 0,
    currentStreak: 7,
    totalXP: 1250,
    level: 3,
  });

  useEffect(() => {
    loadSkillsData();
  }, []);

  const loadSkillsData = async () => {
    try {
      setLoading(true);
      const skills = await skillsLearningService.getSkillPaths();
      setSkillPaths(skills);
      
      // Load user progress
      const userData = userDataService.getCurrentUserData();
      if (userData) {
        setUserProgress({
          totalSkills: skills.length,
          completedSkills: Object.keys(userData.skillsProgress).filter(
            skillId => userData.skillsProgress[skillId].progress >= 100
          ).length,
          currentStreak: userData.learningStats.currentStreak,
          totalXP: userData.learningStats.totalXP,
          level: userData.learningStats.level,
        });
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSkills = () => {
    let filtered = skillPaths;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const categories = [
    { id: 'all', name: 'All Skills', icon: Target, color: '#6B7280' },
    { id: 'programming', name: 'Programming', icon: Code, color: '#3B82F6' },
    { id: 'web', name: 'Web Dev', icon: Globe, color: '#10B981' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, color: '#8B5CF6' },
    { id: 'data', name: 'Data Science', icon: BarChart3, color: '#F59E0B' },
    { id: 'design', name: 'Design', icon: Palette, color: '#EC4899' },
    { id: 'devops', name: 'DevOps', icon: Cpu, color: '#06B6D4' },
  ];

  const tabs = [
    { id: 'discover', name: 'Discover', icon: Target },
    { id: 'learning', name: 'My Learning', icon: BookOpen },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
  ];

  const handleSkillPress = (skill: SkillPath) => {
    setSelectedSkill(skill);
    setShowSkillModal(true);
  };

  const handleLessonPress = async (skill: SkillPath, lesson: Lesson) => {
    // Check prerequisites
    if (lesson.prerequisites && lesson.prerequisites.length > 0) {
      const hasPrerequisites = lesson.prerequisites.every(prereqId => {
        const prereqLesson = skill.lessons.find(l => l.id === prereqId);
        return prereqLesson?.completed;
      });
      
      if (!hasPrerequisites) {
        Alert.alert(
          'Prerequisites Required',
          `Complete the previous lessons first: ${lesson.prerequisites.join(', ')}`,
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleLessonComplete = async (score: number) => {
    if (!selectedLesson || !selectedSkill) return;
    
    try {
      // Mark lesson as complete
      await skillsLearningService.completeLesson(selectedSkill.id, selectedLesson.id, score);
      
      // Update user progress
      const progress = await skillsLearningService.getUserProgress(selectedSkill.id);
      await userDataService.updateSkillProgress(
        selectedSkill.id,
        (progress.completedLessons / progress.totalLessons) * 100,
        progress.completedLessons
      );
      
      // Refresh data
      await loadSkillsData();
      
      Alert.alert(
        'Lesson Complete! 🎉',
        `You earned ${selectedLesson.xp} XP and scored ${score}%!\n\nKeep up the great work!`,
        [{ text: 'Continue' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    }
  };

  const handleEnrollInSkill = async (skill: SkillPath) => {
    try {
      await skillsLearningService.enrollInSkill(skill.id);
      Alert.alert(
        'Enrolled Successfully! 🎓',
        `You're now enrolled in ${skill.name}. Start with the first lesson to begin your learning journey.`,
        [
          { text: 'Start Learning', onPress: () => {
            setShowSkillModal(false);
            if (skill.lessons.length > 0) {
              handleLessonPress(skill, skill.lessons[0]);
            }
          }},
          { text: 'Later', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to enroll. Please try again.');
    }
  };

  const renderSkillCard = (skill: SkillPath) => {
    const userData = userDataService.getCurrentUserData();
    const skillProgress = userData?.skillsProgress[skill.id];
    const progress = skillProgress?.progress || 0;
    const completedLessons = skillProgress?.completedLessons || 0;
    
    return (
      <TouchableOpacity 
        key={skill.id} 
        style={styles.skillCard}
        onPress={() => handleSkillPress(skill)}
      >
        <View style={styles.skillHeader}>
          <View style={[styles.skillIcon, { backgroundColor: `${skill.color}15` }]}>
            <Text style={[styles.skillEmoji, { color: skill.color }]}>{skill.icon}</Text>
          </View>
          <View style={styles.skillInfo}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillCategory}>{skill.category}</Text>
            <View style={styles.skillMeta}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{skill.difficulty}</Text>
              </View>
              <Text style={styles.estimatedTime}>{skill.estimatedHours}h</Text>
            </View>
          </View>
          <View style={styles.skillStats}>
            <View style={styles.ratingContainer}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{skill.rating}</Text>
            </View>
            <Text style={styles.enrolledCount}>{skill.enrolledCount.toLocaleString()} enrolled</Text>
          </View>
        </View>
        
        <Text style={styles.skillDescription}>{skill.description}</Text>
        
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {completedLessons}/{skill.lessons.length} lessons
              </Text>
              <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
            </View>
            <ProgressBar 
              progress={progress} 
              color={skill.color}
              height={6}
              showPercentage={false}
            />
          </View>
        )}
        
        <View style={styles.skillActions}>
          {progress > 0 ? (
            <TouchableOpacity style={[styles.continueButton, { backgroundColor: skill.color }]}>
              <Play size={16} color="#FFFFFF" />
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Learning</Text>
            </TouchableOpacity>
          )}
          
          {skill.certificate && (
            <View style={styles.certificateBadge}>
              <Award size={12} color="#F59E0B" />
              <Text style={styles.certificateText}>Certificate</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkillModal = () => {
    if (!selectedSkill) return null;
    
    const userData = userDataService.getCurrentUserData();
    const skillProgress = userData?.skillsProgress[selectedSkill.id];
    const progress = skillProgress?.progress || 0;
    const completedLessons = skillProgress?.completedLessons || 0;
    
    return (
      <Modal
        visible={showSkillModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSkillModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedSkill.name}</Text>
            <TouchableOpacity onPress={() => setShowSkillModal(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.skillDetailHeader}>
              <View style={[styles.skillDetailIcon, { backgroundColor: `${selectedSkill.color}15` }]}>
                <Text style={[styles.skillDetailEmoji, { color: selectedSkill.color }]}>
                  {selectedSkill.icon}
                </Text>
              </View>
              <View style={styles.skillDetailInfo}>
                <Text style={styles.skillDetailName}>{selectedSkill.name}</Text>
                <Text style={styles.skillDetailDescription}>{selectedSkill.description}</Text>
                <View style={styles.skillDetailMeta}>
                  <Text style={styles.skillDetailMetaText}>
                    {selectedSkill.estimatedHours} hours • {selectedSkill.difficulty} • {selectedSkill.lessons.length} lessons
                  </Text>
                </View>
              </View>
            </View>
            
            {progress > 0 && (
              <View style={styles.progressSection}>
                <Text style={styles.progressSectionTitle}>Your Progress</Text>
                <View style={styles.progressStats}>
                  <Text style={styles.progressStatsText}>
                    {completedLessons} of {selectedSkill.lessons.length} lessons completed
                  </Text>
                  <Text style={styles.progressStatsPercentage}>{Math.round(progress)}%</Text>
                </View>
                <ProgressBar 
                  progress={progress} 
                  color={selectedSkill.color}
                  height={8}
                  showPercentage={false}
                />
              </View>
            )}
            
            <View style={styles.lessonsSection}>
              <Text style={styles.lessonsSectionTitle}>Lessons</Text>
              {selectedSkill.lessons.map((lesson, index) => {
                const isCompleted = lesson.completed;
                const isLocked = lesson.prerequisites && lesson.prerequisites.length > 0 && 
                  !lesson.prerequisites.every(prereqId => {
                    const prereqLesson = selectedSkill.lessons.find(l => l.id === prereqId);
                    return prereqLesson?.completed;
                  });
                
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[styles.lessonItem, isLocked && styles.lockedLesson]}
                    onPress={() => {
                      setShowSkillModal(false);
                      handleLessonPress(selectedSkill, lesson);
                    }}
                    disabled={isLocked}
                  >
                    <View style={styles.lessonNumber}>
                      {isCompleted ? (
                        <CheckCircle size={20} color="#10B981" />
                      ) : isLocked ? (
                        <Lock size={20} color="#9CA3AF" />
                      ) : (
                        <Text style={styles.lessonNumberText}>{index + 1}</Text>
                      )}
                    </View>
                    <View style={styles.lessonContent}>
                      <Text style={[styles.lessonTitle, isLocked && styles.lockedText]}>
                        {lesson.title}
                      </Text>
                      <Text style={[styles.lessonDescription, isLocked && styles.lockedText]}>
                        {lesson.description}
                      </Text>
                      <View style={styles.lessonMeta}>
                        <Text style={[styles.lessonDuration, isLocked && styles.lockedText]}>
                          {lesson.duration} min
                        </Text>
                        <Text style={[styles.lessonXP, isLocked && styles.lockedText]}>
                          {lesson.xp} XP
                        </Text>
                      </View>
                    </View>
                    <View style={styles.lessonAction}>
                      {isCompleted ? (
                        <Text style={styles.completedText}>✓</Text>
                      ) : !isLocked ? (
                        <Play size={16} color={selectedSkill.color} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {progress === 0 && (
              <TouchableOpacity 
                style={[styles.enrollButton, { backgroundColor: selectedSkill.color }]}
                onPress={() => handleEnrollInSkill(selectedSkill)}
              >
                <Text style={styles.enrollButtonText}>Enroll in Course</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderProgressTab = () => (
    <ScrollView style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <View style={styles.levelCard}>
          <Text style={styles.levelNumber}>{userProgress.level}</Text>
          <Text style={styles.levelText}>Level</Text>
        </View>
        <View style={styles.xpCard}>
          <Text style={styles.xpNumber}>{userProgress.totalXP}</Text>
          <Text style={styles.xpText}>Total XP</Text>
        </View>
        <View style={styles.streakCard}>
          <Text style={styles.streakNumber}>{userProgress.currentStreak}</Text>
          <Text style={styles.streakText}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementsList}>
          <View style={styles.achievementItem}>
            <Award size={20} color="#F59E0B" />
            <Text style={styles.achievementText}>Python Master - Completed 6 lessons</Text>
          </View>
          <View style={styles.achievementItem}>
            <Zap size={20} color="#10B981" />
            <Text style={styles.achievementText}>Week Warrior - 7 day learning streak</Text>
          </View>
          <View style={styles.achievementItem}>
            <Star size={20} color="#8B5CF6" />
            <Text style={styles.achievementText}>Quick Learner - Completed lesson in under 20 min</Text>
          </View>
        </View>
      </View>

      <View style={styles.skillsOverview}>
        <Text style={styles.sectionTitle}>Skills Overview</Text>
        <Text style={styles.overviewText}>
          {userProgress.completedSkills} of {userProgress.totalSkills} skills completed
        </Text>
        <ProgressBar 
          progress={(userProgress.completedSkills / userProgress.totalSkills) * 100}
          color="#2563EB"
          height={8}
          showPercentage={true}
        />
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading skills...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Skill Builder</Text>
        <TouchableOpacity style={styles.streakBadge}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.streakText}>{userProgress.currentStreak} day streak</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <tab.icon size={16} color={selectedTab === tab.id ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {selectedTab === 'discover' && (
        <ScrollView style={styles.content}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search skills..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.activeCategoryChip,
                  { borderColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon size={16} color={selectedCategory === category.id ? '#FFFFFF' : category.color} />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Skills Grid */}
          <View style={styles.skillsGrid}>
            {getFilteredSkills().map(renderSkillCard)}
          </View>
        </ScrollView>
      )}

      {selectedTab === 'learning' && (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <View style={styles.skillsGrid}>
            {skillPaths
              .filter(skill => {
                const userData = userDataService.getCurrentUserData();
                const skillProgress = userData?.skillsProgress[skill.id];
                return skillProgress && skillProgress.progress > 0 && skillProgress.progress < 100;
              })
              .map(renderSkillCard)}
          </View>
        </ScrollView>
      )}

      {selectedTab === 'progress' && renderProgressTab()}

      {/* Skill Detail Modal */}
      {renderSkillModal()}

      {/* Lesson Modal */}
      <LessonModal
        visible={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
      />
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
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  skillsGrid: {
    paddingBottom: 20,
  },
  skillCard: {
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
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skillEmoji: {
    fontSize: 24,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  skillCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  skillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  difficultyBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  estimatedTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  skillStats: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  enrolledCount: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  skillDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  skillActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  continueButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  startButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  startButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  certificateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  certificateText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
    marginLeft: 4,
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
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  skillDetailHeader: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  skillDetailIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  skillDetailEmoji: {
    fontSize: 32,
  },
  skillDetailInfo: {
    flex: 1,
  },
  skillDetailName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  skillDetailDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  skillDetailMeta: {
    marginTop: 4,
  },
  skillDetailMetaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  progressSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStatsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressStatsPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  lessonsSection: {
    paddingVertical: 20,
  },
  lessonsSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  lockedLesson: {
    opacity: 0.5,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  lessonDuration: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  lessonXP: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  lessonAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: '#10B981',
  },
  enrollButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  enrollButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  levelCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  levelNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  xpCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  xpNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  streakNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  achievementsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  skillsOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  overviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 12,
  },
});