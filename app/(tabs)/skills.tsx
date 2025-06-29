import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Award, TrendingUp, Play, CircleCheck as CheckCircle, Lock, Star, Clock, Users, Zap, Brain, Code, Database, Palette, MessageSquare, ChartBar as BarChart3, Shield, Globe, Smartphone, Cpu } from 'lucide-react-native';
import { router } from 'expo-router';
import ProgressBar from '@/components/ProgressBar';

interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'data' | 'design' | 'soft' | 'devops' | 'ai';
  icon: any;
  color: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  lessons: number;
  completedLessons: number;
  estimatedTime: string;
  description: string;
  unlocked: boolean;
  prerequisites?: string[];
}

interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
  sampleAnswer?: string;
}

export default function SkillsScreen() {
  const [selectedTab, setSelectedTab] = useState('skills');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [userProgress, setUserProgress] = useState({
    totalSkills: 0,
    completedSkills: 0,
    currentStreak: 7,
    totalXP: 1250,
    level: 3,
  });

  useEffect(() => {
    loadSkillsData();
    loadInterviewQuestions();
  }, []);

  const loadSkillsData = () => {
    const skillsData: Skill[] = [
      // Frontend Skills
      {
        id: 'react',
        name: 'React.js',
        category: 'frontend',
        icon: Code,
        color: '#61DAFB',
        level: 'intermediate',
        progress: 75,
        lessons: 24,
        completedLessons: 18,
        estimatedTime: '6 hours',
        description: 'Master React components, hooks, and state management',
        unlocked: true,
      },
      {
        id: 'javascript',
        name: 'JavaScript ES6+',
        category: 'frontend',
        icon: Code,
        color: '#F7DF1E',
        level: 'intermediate',
        progress: 85,
        lessons: 30,
        completedLessons: 25,
        estimatedTime: '8 hours',
        description: 'Advanced JavaScript concepts and modern syntax',
        unlocked: true,
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        category: 'frontend',
        icon: Code,
        color: '#3178C6',
        level: 'beginner',
        progress: 30,
        lessons: 20,
        completedLessons: 6,
        estimatedTime: '5 hours',
        description: 'Type-safe JavaScript development',
        unlocked: true,
        prerequisites: ['javascript'],
      },
      {
        id: 'vue',
        name: 'Vue.js',
        category: 'frontend',
        icon: Code,
        color: '#4FC08D',
        level: 'beginner',
        progress: 0,
        lessons: 18,
        completedLessons: 0,
        estimatedTime: '4 hours',
        description: 'Progressive JavaScript framework',
        unlocked: false,
        prerequisites: ['javascript'],
      },

      // Backend Skills
      {
        id: 'nodejs',
        name: 'Node.js',
        category: 'backend',
        icon: Database,
        color: '#339933',
        level: 'intermediate',
        progress: 60,
        lessons: 22,
        completedLessons: 13,
        estimatedTime: '7 hours',
        description: 'Server-side JavaScript development',
        unlocked: true,
      },
      {
        id: 'python',
        name: 'Python',
        category: 'backend',
        icon: Database,
        color: '#3776AB',
        level: 'advanced',
        progress: 90,
        lessons: 35,
        completedLessons: 31,
        estimatedTime: '10 hours',
        description: 'Versatile programming language',
        unlocked: true,
      },
      {
        id: 'sql',
        name: 'SQL & Databases',
        category: 'backend',
        icon: Database,
        color: '#336791',
        level: 'intermediate',
        progress: 70,
        lessons: 25,
        completedLessons: 17,
        estimatedTime: '6 hours',
        description: 'Database design and querying',
        unlocked: true,
      },

      // Mobile Skills
      {
        id: 'react-native',
        name: 'React Native',
        category: 'mobile',
        icon: Smartphone,
        color: '#61DAFB',
        level: 'beginner',
        progress: 40,
        lessons: 20,
        completedLessons: 8,
        estimatedTime: '5 hours',
        description: 'Cross-platform mobile development',
        unlocked: true,
        prerequisites: ['react'],
      },
      {
        id: 'flutter',
        name: 'Flutter',
        category: 'mobile',
        icon: Smartphone,
        color: '#02569B',
        level: 'beginner',
        progress: 0,
        lessons: 18,
        completedLessons: 0,
        estimatedTime: '4 hours',
        description: 'Google\'s UI toolkit for mobile',
        unlocked: false,
      },

      // Data Science
      {
        id: 'machine-learning',
        name: 'Machine Learning',
        category: 'ai',
        icon: Brain,
        color: '#FF6B6B',
        level: 'beginner',
        progress: 25,
        lessons: 30,
        completedLessons: 7,
        estimatedTime: '12 hours',
        description: 'AI and ML fundamentals',
        unlocked: true,
        prerequisites: ['python'],
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        category: 'data',
        icon: BarChart3,
        level: 'intermediate',
        color: '#4ECDC4',
        progress: 55,
        lessons: 28,
        completedLessons: 15,
        estimatedTime: '8 hours',
        description: 'Statistical analysis and visualization',
        unlocked: true,
      },

      // Design Skills
      {
        id: 'ui-ux',
        name: 'UI/UX Design',
        category: 'design',
        icon: Palette,
        color: '#FF69B4',
        level: 'beginner',
        progress: 35,
        lessons: 22,
        completedLessons: 8,
        estimatedTime: '6 hours',
        description: 'User interface and experience design',
        unlocked: true,
      },

      // DevOps
      {
        id: 'docker',
        name: 'Docker',
        category: 'devops',
        icon: Cpu,
        color: '#2496ED',
        level: 'beginner',
        progress: 20,
        lessons: 15,
        completedLessons: 3,
        estimatedTime: '4 hours',
        description: 'Containerization technology',
        unlocked: true,
      },
      {
        id: 'aws',
        name: 'AWS Cloud',
        category: 'devops',
        icon: Globe,
        color: '#FF9900',
        level: 'beginner',
        progress: 0,
        lessons: 25,
        completedLessons: 0,
        estimatedTime: '8 hours',
        description: 'Amazon Web Services',
        unlocked: false,
        prerequisites: ['docker'],
      },

      // Soft Skills
      {
        id: 'communication',
        name: 'Communication',
        category: 'soft',
        icon: MessageSquare,
        color: '#9B59B6',
        level: 'intermediate',
        progress: 80,
        lessons: 15,
        completedLessons: 12,
        estimatedTime: '3 hours',
        description: 'Professional communication skills',
        unlocked: true,
      },
      {
        id: 'leadership',
        name: 'Leadership',
        category: 'soft',
        icon: Users,
        color: '#E74C3C',
        level: 'beginner',
        progress: 45,
        lessons: 18,
        completedLessons: 8,
        estimatedTime: '4 hours',
        description: 'Team leadership and management',
        unlocked: true,
      },
    ];

    setSkills(skillsData);
    setUserProgress({
      totalSkills: skillsData.length,
      completedSkills: skillsData.filter(s => s.progress === 100).length,
      currentStreak: 7,
      totalXP: 1250,
      level: 3,
    });
  };

  const loadInterviewQuestions = () => {
    const questions: InterviewQuestion[] = [
      {
        id: '1',
        question: 'Tell me about yourself and your background in software development.',
        category: 'behavioral',
        difficulty: 'easy',
        tips: [
          'Keep it concise (2-3 minutes)',
          'Focus on relevant experience',
          'Mention your passion for technology',
          'End with why you\'re interested in this role'
        ],
        sampleAnswer: 'I\'m a computer science student at ESPRIT with a passion for full-stack development. I\'ve completed several projects including an e-commerce platform using React and Node.js, and I\'ve been working as a programming tutor. I\'m particularly interested in this internship because...'
      },
      {
        id: '2',
        question: 'Explain the difference between let, const, and var in JavaScript.',
        category: 'technical',
        difficulty: 'medium',
        tips: [
          'Explain scope differences',
          'Mention hoisting behavior',
          'Give practical examples',
          'Discuss when to use each'
        ],
      },
      {
        id: '3',
        question: 'How would you handle a situation where you disagree with your team lead?',
        category: 'situational',
        difficulty: 'medium',
        tips: [
          'Show respect for authority',
          'Emphasize communication',
          'Mention data-driven decisions',
          'Show willingness to compromise'
        ],
      },
      {
        id: '4',
        question: 'What is the difference between SQL and NoSQL databases?',
        category: 'technical',
        difficulty: 'medium',
        tips: [
          'Explain structure differences',
          'Mention use cases for each',
          'Discuss scalability',
          'Give examples of each type'
        ],
      },
      {
        id: '5',
        question: 'Describe a challenging project you worked on and how you overcame obstacles.',
        category: 'behavioral',
        difficulty: 'hard',
        tips: [
          'Use the STAR method',
          'Be specific about challenges',
          'Highlight problem-solving skills',
          'Mention lessons learned'
        ],
      },
    ];

    setInterviewQuestions(questions);
  };

  const getFilteredSkills = () => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(skill => skill.category === selectedCategory);
  };

  const categories = [
    { id: 'all', name: 'All Skills', icon: Target, color: '#6B7280' },
    { id: 'frontend', name: 'Frontend', icon: Code, color: '#3B82F6' },
    { id: 'backend', name: 'Backend', icon: Database, color: '#10B981' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, color: '#8B5CF6' },
    { id: 'data', name: 'Data', icon: BarChart3, color: '#F59E0B' },
    { id: 'ai', name: 'AI/ML', icon: Brain, color: '#EF4444' },
    { id: 'design', name: 'Design', icon: Palette, color: '#EC4899' },
    { id: 'devops', name: 'DevOps', icon: Cpu, color: '#06B6D4' },
    { id: 'soft', name: 'Soft Skills', icon: MessageSquare, color: '#84CC16' },
  ];

  const tabs = [
    { id: 'skills', name: 'Skill Builder', icon: Target },
    { id: 'interview', name: 'Interview Prep', icon: MessageSquare },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
  ];

  const handleStartSkill = (skill: Skill) => {
    if (!skill.unlocked) {
      Alert.alert(
        'Skill Locked',
        `Complete ${skill.prerequisites?.join(', ')} first to unlock ${skill.name}`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `Start ${skill.name}`,
      `Continue your ${skill.name} journey?\n\nProgress: ${skill.progress}%\nLessons: ${skill.completedLessons}/${skill.lessons}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue Learning', onPress: () => startLearning(skill) }
      ]
    );
  };

  const startLearning = (skill: Skill) => {
    // Simulate learning progress
    const updatedSkills = skills.map(s => {
      if (s.id === skill.id) {
        const newProgress = Math.min(100, s.progress + 10);
        const newCompletedLessons = Math.min(s.lessons, s.completedLessons + 1);
        return { ...s, progress: newProgress, completedLessons: newCompletedLessons };
      }
      return s;
    });

    setSkills(updatedSkills);
    
    Alert.alert(
      'Great Progress!',
      `You've completed another lesson in ${skill.name}!\n\n+50 XP earned\n+1 lesson completed`,
      [{ text: 'Continue' }]
    );
  };

  const handleInterviewQuestion = (question: InterviewQuestion) => {
    setCurrentQuestion(question);
    setShowQuestionModal(true);
  };

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * interviewQuestions.length);
    handleInterviewQuestion(interviewQuestions[randomIndex]);
  };

  const renderSkillCard = (skill: Skill) => {
    const IconComponent = skill.icon;
    
    return (
      <TouchableOpacity 
        key={skill.id} 
        style={[styles.skillCard, !skill.unlocked && styles.lockedCard]}
        onPress={() => handleStartSkill(skill)}
      >
        <View style={styles.skillHeader}>
          <View style={[styles.skillIcon, { backgroundColor: `${skill.color}15` }]}>
            <IconComponent size={24} color={skill.color} />
            {!skill.unlocked && (
              <View style={styles.lockOverlay}>
                <Lock size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.skillInfo}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillLevel}>{skill.level}</Text>
          </View>
          <View style={styles.skillProgress}>
            <Text style={styles.progressText}>{skill.progress}%</Text>
          </View>
        </View>
        
        <Text style={styles.skillDescription}>{skill.description}</Text>
        
        <View style={styles.skillMeta}>
          <Text style={styles.skillLessons}>
            {skill.completedLessons}/{skill.lessons} lessons
          </Text>
          <Text style={styles.skillTime}>{skill.estimatedTime}</Text>
        </View>
        
        <ProgressBar 
          progress={skill.progress} 
          color={skill.color}
          height={6}
          showPercentage={false}
        />
        
        {skill.prerequisites && skill.prerequisites.length > 0 && (
          <View style={styles.prerequisites}>
            <Text style={styles.prerequisitesText}>
              Requires: {skill.prerequisites.join(', ')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderInterviewQuestion = (question: InterviewQuestion) => {
    const difficultyColors = {
      easy: '#10B981',
      medium: '#F59E0B',
      hard: '#EF4444',
    };

    return (
      <TouchableOpacity 
        key={question.id}
        style={styles.questionCard}
        onPress={() => handleInterviewQuestion(question)}
      >
        <View style={styles.questionHeader}>
          <View style={styles.questionMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[question.difficulty] }]}>
              <Text style={styles.difficultyText}>{question.difficulty}</Text>
            </View>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
        </View>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.questionActions}>
          <Text style={styles.practiceText}>Tap to practice</Text>
          <Play size={16} color="#2563EB" />
        </View>
      </TouchableOpacity>
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
            <Text style={styles.achievementText}>JavaScript Master - Completed 25 lessons</Text>
          </View>
          <View style={styles.achievementItem}>
            <Zap size={20} color="#10B981" />
            <Text style={styles.achievementText}>Week Warrior - 7 day learning streak</Text>
          </View>
          <View style={styles.achievementItem}>
            <Star size={20} color="#8B5CF6" />
            <Text style={styles.achievementText}>Interview Ready - Practiced 10 questions</Text>
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
      {selectedTab === 'skills' && (
        <ScrollView style={styles.content}>
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

      {selectedTab === 'interview' && (
        <ScrollView style={styles.content}>
          <View style={styles.interviewHeader}>
            <Text style={styles.sectionTitle}>Interview Preparation</Text>
            <TouchableOpacity style={styles.randomButton} onPress={getRandomQuestion}>
              <Text style={styles.randomButtonText}>Random Question</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.questionsGrid}>
            {interviewQuestions.map(renderInterviewQuestion)}
          </View>
        </ScrollView>
      )}

      {selectedTab === 'progress' && renderProgressTab()}

      {/* Interview Question Modal */}
      <Modal
        visible={showQuestionModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQuestionModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Interview Question</Text>
            <TouchableOpacity onPress={() => setShowQuestionModal(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          {currentQuestion && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.questionDetails}>
                <Text style={styles.modalQuestion}>{currentQuestion.question}</Text>
                
                <View style={styles.questionInfo}>
                  <Text style={styles.infoLabel}>Category: {currentQuestion.category}</Text>
                  <Text style={styles.infoLabel}>Difficulty: {currentQuestion.difficulty}</Text>
                </View>

                <Text style={styles.tipsTitle}>Tips for answering:</Text>
                {currentQuestion.tips.map((tip, index) => (
                  <Text key={index} style={styles.tipText}>• {tip}</Text>
                ))}

                {currentQuestion.sampleAnswer && (
                  <View style={styles.sampleAnswer}>
                    <Text style={styles.sampleTitle}>Sample Answer:</Text>
                    <Text style={styles.sampleText}>{currentQuestion.sampleAnswer}</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
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
  lockedCard: {
    opacity: 0.6,
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
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillInfo: {
    flex: 1,
    marginLeft: 12,
  },
  skillName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  skillLevel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  skillProgress: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  skillDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  skillMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skillLessons: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  skillTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  prerequisites: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  prerequisitesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
  },
  interviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  randomButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  randomButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  questionsGrid: {
    paddingBottom: 20,
  },
  questionCard: {
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
  questionHeader: {
    marginBottom: 12,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  questionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 12,
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  practiceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  achievementsList: {
    marginTop: 16,
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
  questionDetails: {
    paddingVertical: 20,
  },
  modalQuestion: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 16,
  },
  questionInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  sampleAnswer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  sampleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 8,
  },
  sampleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 20,
  },
});