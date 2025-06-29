import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Eye, MessageCircle, Filter, Search, Plus, Calendar, ExternalLink, Trash2, Edit3, MoreVertical } from 'lucide-react-native';
import { dataService, Application } from '@/services/dataService';

export default function ApplicationsScreen() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadApplications = async () => {
    try {
      const apps = await dataService.getApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getFilteredApplications = () => {
    switch (selectedTab) {
      case 'pending':
        return applications.filter(app => app.status === 'pending');
      case 'reviewed':
        return applications.filter(app => app.status === 'reviewed');
      case 'interview':
        return applications.filter(app => app.status === 'interview');
      case 'accepted':
        return applications.filter(app => app.status === 'accepted');
      case 'rejected':
        return applications.filter(app => app.status === 'rejected');
      default:
        return applications;
    }
  };

  const filteredApplications = getFilteredApplications();

  const tabs = [
    { id: 'all', label: 'All', count: applications.length },
    { id: 'pending', label: 'Pending', count: applications.filter(app => app.status === 'pending').length },
    { id: 'reviewed', label: 'Reviewed', count: applications.filter(app => app.status === 'reviewed').length },
    { id: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'interview').length },
    { id: 'accepted', label: 'Accepted', count: applications.filter(app => app.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length },
  ];

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'reviewed': return '#2563EB';
      case 'interview': return '#8B5CF6';
      case 'accepted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'reviewed': return Eye;
      case 'interview': return MessageCircle;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const handleStatusUpdate = async (applicationId: number, newStatus: Application['status']) => {
    try {
      await dataService.updateApplicationStatus(applicationId, newStatus);
      await loadApplications();
      Alert.alert('Success', 'Application status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update application status');
    }
  };

  const handleDeleteApplication = async (applicationId: number) => {
    Alert.alert(
      'Delete Application',
      'Are you sure you want to delete this application? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dataService.deleteApplication(applicationId);
              await loadApplications();
              Alert.alert('Success', 'Application deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete application');
            }
          }
        }
      ]
    );
  };

  const renderApplicationCard = (application: Application) => {
    const StatusIcon = getStatusIcon(application.status);
    const statusColor = getStatusColor(application.status);
    const appliedDate = new Date(application.appliedAt).toLocaleDateString();
    const lastUpdated = new Date(application.lastUpdated).toLocaleDateString();

    return (
      <View key={application.id} style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <View style={styles.applicationInfo}>
            <Text style={styles.jobTitle}>{application.jobTitle}</Text>
            <Text style={styles.companyName}>{application.company}</Text>
            <View style={styles.applicationMeta}>
              <Text style={styles.appliedDate}>Applied: {appliedDate}</Text>
              <Text style={styles.source}>via {application.source}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
              <StatusIcon size={14} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {application.nextStep && (
          <View style={styles.nextStepContainer}>
            <Text style={styles.nextStepLabel}>Next Step:</Text>
            <Text style={styles.nextStepText}>{application.nextStep}</Text>
          </View>
        )}

        {application.interviewDate && (
          <View style={styles.interviewContainer}>
            <Calendar size={14} color="#8B5CF6" />
            <Text style={styles.interviewText}>
              Interview: {new Date(application.interviewDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.applicationActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              if (application.applicationUrl) {
                // Open external URL
                console.log('Opening:', application.applicationUrl);
              }
            }}
          >
            <ExternalLink size={14} color="#2563EB" />
            <Text style={styles.actionButtonText}>View Application</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Show status update options
              Alert.alert(
                'Update Status',
                'Select new status:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Pending', onPress: () => handleStatusUpdate(application.id, 'pending') },
                  { text: 'Reviewed', onPress: () => handleStatusUpdate(application.id, 'reviewed') },
                  { text: 'Interview', onPress: () => handleStatusUpdate(application.id, 'interview') },
                  { text: 'Accepted', onPress: () => handleStatusUpdate(application.id, 'accepted') },
                  { text: 'Rejected', onPress: () => handleStatusUpdate(application.id, 'rejected') },
                ]
              );
            }}
          >
            <Edit3 size={14} color="#F59E0B" />
            <Text style={styles.actionButtonText}>Update Status</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteApplication(application.id)}
          >
            <Trash2 size={14} color="#EF4444" />
            <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>Last updated: {lastUpdated}</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <CheckCircle size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No Applications Yet</Text>
      <Text style={styles.emptyDescription}>
        Start applying to internships and jobs to track your progress here. 
        Your application history, status updates, and next steps will appear in this section.
      </Text>
      <TouchableOpacity style={styles.startButton}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Start Applying</Text>
      </TouchableOpacity>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Application Tips:</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipText}>• Complete your profile for better matches</Text>
          <Text style={styles.tipText}>• Customize your applications for each role</Text>
          <Text style={styles.tipText}>• Follow up on applications after 1 week</Text>
          <Text style={styles.tipText}>• Keep track of application deadlines</Text>
          <Text style={styles.tipText}>• Prepare for interviews in advance</Text>
        </View>
      </View>
    </View>
  );

  const renderSummaryStats = () => {
    const stats = [
      { label: 'Total', value: applications.length, color: '#2563EB' },
      { label: 'Pending', value: applications.filter(app => app.status === 'pending').length, color: '#F59E0B' },
      { label: 'Interview', value: applications.filter(app => app.status === 'interview').length, color: '#8B5CF6' },
      { label: 'Accepted', value: applications.filter(app => app.status === 'accepted').length, color: '#10B981' },
    ];

    return (
      <View style={styles.summaryContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.summaryCard}>
            <Text style={[styles.summaryNumber, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.summaryLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Stats */}
      {renderSummaryStats()}

      {/* Filter Tabs */}
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
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredApplications.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.applicationsContainer}>
            {filteredApplications.map(renderApplicationCard)}
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  summaryCard: {
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
  summaryNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  applicationsContainer: {
    paddingHorizontal: 20,
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicationInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 6,
  },
  applicationMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  appliedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  source: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  nextStepContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  nextStepLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 4,
  },
  nextStepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  interviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  interviewText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 6,
  },
  applicationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 4,
  },
  lastUpdated: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  lastUpdatedText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tipsContainer: {
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
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});