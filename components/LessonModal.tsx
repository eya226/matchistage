import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Play, CheckCircle, Award, ArrowRight, ArrowLeft, Code, BookOpen, HelpCircle, Lightbulb } from 'lucide-react-native';
import { Lesson, LessonContent } from '@/services/skillsLearningService';

interface LessonModalProps {
  visible: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onComplete: (score: number) => void;
}

export default function LessonModal({ visible, onClose, lesson, onComplete }: LessonModalProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [lessonStep, setLessonStep] = useState<'theory' | 'practice' | 'complete'>('theory');

  useEffect(() => {
    if (lesson) {
      setCurrentSection(0);
      setCurrentExercise(0);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setLessonStep(lesson.type === 'theory' ? 'theory' : lesson.type === 'practice' ? 'practice' : 'theory');
    }
  }, [lesson]);

  if (!lesson) return null;

  const handleAnswer = (exerciseId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const checkAnswers = () => {
    if (!lesson.content.practice) return;
    
    const exercises = lesson.content.practice.exercises;
    let correctCount = 0;
    
    exercises.forEach(exercise => {
      const userAnswer = userAnswers[exercise.id];
      const correctAnswer = Array.isArray(exercise.correctAnswer) 
        ? exercise.correctAnswer[0] 
        : exercise.correctAnswer;
      
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / exercises.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const completeLesson = () => {
    onComplete(score);
    setLessonStep('complete');
  };

  const renderTheorySection = () => {
    if (!lesson.content.theory) return null;
    
    const section = lesson.content.theory.sections[currentSection];
    const isLastSection = currentSection === lesson.content.theory.sections.length - 1;
    
    return (
      <ScrollView style={styles.content}>
        <View style={styles.theorySection}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
          
          {section.codeExample && (
            <View style={styles.codeBlock}>
              <View style={styles.codeHeader}>
                <Code size={16} color="#2563EB" />
                <Text style={styles.codeHeaderText}>Code Example</Text>
              </View>
              <Text style={styles.codeText}>{section.codeExample}</Text>
            </View>
          )}
          
          {section.tips && (
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Lightbulb size={16} color="#F59E0B" />
                <Text style={styles.tipsHeaderText}>Tips</Text>
              </View>
              {section.tips.map((tip, index) => (
                <Text key={index} style={styles.tipText}>• {tip}</Text>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.navigationButtons}>
          {currentSection > 0 && (
            <TouchableOpacity 
              style={styles.prevButton}
              onPress={() => setCurrentSection(currentSection - 1)}
            >
              <ArrowLeft size={16} color="#6B7280" />
              <Text style={styles.prevButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => {
              if (isLastSection) {
                if (lesson.type === 'theory') {
                  completeLesson();
                } else {
                  setLessonStep('practice');
                }
              } else {
                setCurrentSection(currentSection + 1);
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {isLastSection ? (lesson.type === 'theory' ? 'Complete' : 'Practice') : 'Next'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderPracticeSection = () => {
    if (!lesson.content.practice) return null;
    
    const exercises = lesson.content.practice.exercises;
    const exercise = exercises[currentExercise];
    const isLastExercise = currentExercise === exercises.length - 1;
    
    return (
      <ScrollView style={styles.content}>
        <View style={styles.practiceSection}>
          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>
              Question {currentExercise + 1} of {exercises.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentExercise + 1) / exercises.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <Text style={styles.questionText}>{exercise.question}</Text>
          
          {exercise.type === 'multiple-choice' && exercise.options && (
            <View style={styles.optionsContainer}>
              {exercise.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    userAnswers[exercise.id] === option && styles.selectedOption
                  ]}
                  onPress={() => handleAnswer(exercise.id, option)}
                >
                  <Text style={[
                    styles.optionText,
                    userAnswers[exercise.id] === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {exercise.type === 'fill-blank' && (
            <View style={styles.fillBlankContainer}>
              <Text style={styles.fillBlankLabel}>Your Answer:</Text>
              <TouchableOpacity 
                style={styles.fillBlankInput}
                onPress={() => {
                  Alert.prompt(
                    'Enter your answer',
                    exercise.hint || 'Type your answer below:',
                    (text) => {
                      if (text) handleAnswer(exercise.id, text.trim());
                    }
                  );
                }}
              >
                <Text style={styles.fillBlankText}>
                  {userAnswers[exercise.id] || 'Tap to enter answer'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {exercise.hint && (
            <TouchableOpacity style={styles.hintButton}>
              <HelpCircle size={16} color="#8B5CF6" />
              <Text style={styles.hintText}>Hint: {exercise.hint}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.navigationButtons}>
          {currentExercise > 0 && (
            <TouchableOpacity 
              style={styles.prevButton}
              onPress={() => setCurrentExercise(currentExercise - 1)}
            >
              <ArrowLeft size={16} color="#6B7280" />
              <Text style={styles.prevButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.nextButton,
              !userAnswers[exercise.id] && styles.disabledButton
            ]}
            disabled={!userAnswers[exercise.id]}
            onPress={() => {
              if (isLastExercise) {
                checkAnswers();
              } else {
                setCurrentExercise(currentExercise + 1);
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {isLastExercise ? 'Submit' : 'Next'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderResults = () => {
    if (!lesson.content.practice) return null;
    
    const exercises = lesson.content.practice.exercises;
    const passed = score >= 70;
    
    return (
      <ScrollView style={styles.content}>
        <View style={styles.resultsSection}>
          <View style={styles.scoreContainer}>
            {passed ? (
              <CheckCircle size={64} color="#10B981" />
            ) : (
              <X size={64} color="#EF4444" />
            )}
            <Text style={styles.scoreText}>{score}%</Text>
            <Text style={styles.scoreLabel}>
              {passed ? 'Great job!' : 'Keep practicing!'}
            </Text>
          </View>
          
          <View style={styles.resultsDetails}>
            <Text style={styles.resultsTitle}>Results Breakdown</Text>
            {exercises.map((exercise, index) => {
              const userAnswer = userAnswers[exercise.id];
              const correctAnswer = Array.isArray(exercise.correctAnswer) 
                ? exercise.correctAnswer[0] 
                : exercise.correctAnswer;
              const isCorrect = userAnswer === correctAnswer;
              
              return (
                <View key={exercise.id} style={styles.resultItem}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultQuestion}>Q{index + 1}: {exercise.question}</Text>
                    {isCorrect ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <X size={20} color="#EF4444" />
                    )}
                  </View>
                  <Text style={styles.resultAnswer}>
                    Your answer: {userAnswer || 'No answer'}
                  </Text>
                  {!isCorrect && (
                    <Text style={styles.correctAnswer}>
                      Correct answer: {correctAnswer}
                    </Text>
                  )}
                  <Text style={styles.explanation}>{exercise.explanation}</Text>
                </View>
              );
            })}
          </View>
          
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={completeLesson}
          >
            <Award size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>
              Complete Lesson (+{lesson.xp} XP)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderCompleteSection = () => (
    <View style={styles.completeSection}>
      <Award size={80} color="#F59E0B" />
      <Text style={styles.completeTitle}>Lesson Complete!</Text>
      <Text style={styles.completeMessage}>
        You've earned {lesson.xp} XP and completed "{lesson.title}"
      </Text>
      <Text style={styles.completeScore}>Final Score: {score}%</Text>
      
      <TouchableOpacity style={styles.continueButton} onPress={onClose}>
        <Text style={styles.continueButtonText}>Continue Learning</Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.lessonTypeIcon, { backgroundColor: getTypeColor(lesson.type) }]}>
              {lesson.type === 'theory' ? (
                <BookOpen size={16} color="#FFFFFF" />
              ) : lesson.type === 'practice' ? (
                <Code size={16} color="#FFFFFF" />
              ) : (
                <Award size={16} color="#FFFFFF" />
              )}
            </View>
            <View>
              <Text style={styles.headerTitle}>{lesson.title}</Text>
              <Text style={styles.headerSubtitle}>
                {lesson.duration} min • {lesson.xp} XP
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {lessonStep === 'theory' && renderTheorySection()}
        {lessonStep === 'practice' && !showResults && renderPracticeSection()}
        {lessonStep === 'practice' && showResults && renderResults()}
        {lessonStep === 'complete' && renderCompleteSection()}
      </View>
    </Modal>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'theory': return '#2563EB';
    case 'practice': return '#10B981';
    case 'quiz': return '#F59E0B';
    case 'project': return '#8B5CF6';
    default: return '#6B7280';
  }
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  theorySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  codeBlock: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  codeHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#F9FAFB',
    padding: 16,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsHeaderText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 6,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 4,
  },
  practiceSection: {
    padding: 20,
  },
  progressIndicator: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  selectedOptionText: {
    color: '#2563EB',
    fontFamily: 'Inter-SemiBold',
  },
  fillBlankContainer: {
    marginBottom: 20,
  },
  fillBlankLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  fillBlankInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 50,
    justifyContent: 'center',
  },
  fillBlankText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  hintText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  prevButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 6,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  resultsSection: {
    padding: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
  },
  scoreLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 8,
  },
  resultsDetails: {
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultQuestion: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  resultAnswer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  completeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  completeMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  completeScore: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});