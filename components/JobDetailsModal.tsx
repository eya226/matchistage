import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, MapPin, Clock, DollarSign, Briefcase, Users, Star, ExternalLink, Heart, Bookmark, Building, Calendar, Award, Globe, Shield, Zap } from 'lucide-react-native';
import { Job } from '@/services/dataService';

interface JobDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  job: Job | null;
  onApply: (job: Job) => void;
  onSave: (job: Job) => void;
}

export default function JobDetailsModal({ visible, onClose, job, onApply, onSave }: JobDetailsModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  if (!job) return null;

  const handleApply = () => {
    onApply(job);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(job);
  };

  const handleExternalLink = () => {
    if (job.applyUrl) {
      Linking.openURL(job.applyUrl);
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return '#10B981';
    if (match >= 75) return '#F59E0B';
    if (match >= 60) return '#EF4444';
    return '#6B7280';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Bookmark size={24} color={isSaved ? "#F59E0B" : "#6B7280"} fill={isSaved ? "#F59E0B" : "transparent"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View style={styles.bannerContainer}>
            <Image source={{ uri: job.banner }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay} />
            <View style={[styles.matchBadge, { backgroundColor: getMatchColor(job.match) }]}>
              <Text style={styles.matchText}>{job.match}% Match</Text>
            </View>
          </View>

          {/* Company Header */}
          <View style={styles.companySection}>
            <View style={styles.companyHeader}>
              <Image source={{ uri: job.logo }} style={styles.companyLogo} />
              <View style={styles.companyInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{job.rating.toFixed(1)}</Text>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.teamSize}>{job.teamSize} employees</Text>
                </View>
              </View>
            </View>

            {/* Quick Info */}
            <View style={styles.quickInfo}>
              <View style={styles.infoItem}>
                <MapPin size={18} color="#6B7280" />
                <Text style={styles.infoText}>{job.location}</Text>
                {job.remote && (
                  <View style={styles.remoteBadge}>
                    <Text style={styles.remoteText}>Remote</Text>
                  </View>
                )}
              </View>
              <View style={styles.infoItem}>
                <DollarSign size={18} color="#6B7280" />
                <Text style={styles.infoText}>{job.salary}</Text>
              </View>
              <View style={styles.infoItem}>
                <Clock size={18} color="#6B7280" />
                <Text style={styles.infoText}>{job.duration}</Text>
              </View>
              <View style={styles.infoItem}>
                <Briefcase size={18} color="#6B7280" />
                <Text style={styles.infoText}>{job.type}</Text>
              </View>
              <View style={styles.infoItem}>
                <Calendar size={18} color="#6B7280" />
                <Text style={styles.infoText}>Posted {job.postedTime}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this role</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.requirementsList}>
              {job.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits & Perks</Text>
            <View style={styles.benefitsList}>
              {job.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Award size={16} color="#10B981" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Application Deadline */}
          <View style={styles.section}>
            <View style={styles.deadlineCard}>
              <Calendar size={20} color="#EF4444" />
              <View style={styles.deadlineInfo}>
                <Text style={styles.deadlineTitle}>Application Deadline</Text>
                <Text style={styles.deadlineDate}>{job.applicationDeadline}</Text>
              </View>
            </View>
          </View>

          {/* Company Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {job.company}</Text>
            <View style={styles.companyStats}>
              <View style={styles.statItem}>
                <Building size={16} color="#6B7280" />
                <Text style={styles.statText}>{job.teamSize} employees</Text>
              </View>
              <View style={styles.statItem}>
                <Globe size={16} color="#6B7280" />
                <Text style={styles.statText}>Technology</Text>
              </View>
              <View style={styles.statItem}>
                <Star size={16} color="#F59E0B" />
                <Text style={styles.statText}>{job.rating.toFixed(1)} rating</Text>
              </View>
            </View>
          </View>

          {/* Source Info */}
          <View style={styles.sourceSection}>
            <ExternalLink size={16} color="#6B7280" />
            <Text style={styles.sourceText}>Originally posted on {job.source}</Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.externalButton} onPress={handleExternalLink}>
            <ExternalLink size={20} color="#6B7280" />
            <Text style={styles.externalButtonText}>View Original</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Heart size={20} color="#FFFFFF" />
            <Text style={styles.applyButtonText}>Quick Apply</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  matchBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  matchText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  companySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  teamSize: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickInfo: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  remoteBadge: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  remoteText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginTop: 8,
    marginRight: 12,
  },
  requirementText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skillText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
  },
  deadlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deadlineInfo: {
    marginLeft: 12,
  },
  deadlineTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  deadlineDate: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
    marginTop: 2,
  },
  companyStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  sourceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  externalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  externalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 8,
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});