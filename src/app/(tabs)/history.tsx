import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppState } from '@/context/AppStateContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const router = useRouter();
  const { children, absences, leaves } = useAppState();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Filter child history
  const filteredAbsences = selectedChildId
    ? absences.filter((a) => a.childId === selectedChildId)
    : absences;

  const filteredLeaves = selectedChildId
    ? leaves.filter((l) => l.childId === selectedChildId)
    : leaves;

  const totalRecords = filteredAbsences.length + filteredLeaves.length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Excused':
        return { bg: Colors.light.successLight, text: Colors.light.successDark };
      case 'Pending':
        return { bg: Colors.light.warningLight, text: Colors.light.warningDark };
      case 'Rejected':
      default:
        return { bg: Colors.light.dangerLight, text: Colors.light.dangerDark };
    }
  };

  const getChildName = (id: string) => {
    const child = children.find((c) => c.id === id);
    return child ? child.name.split(' ')[0] : 'Child';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <View style={styles.header}>
          <Text style={styles.titleText}>Absence & Leave</Text>
        </View>

        {/* Child Context Selector */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              onPress={() => setSelectedChildId(null)}
              style={[styles.filterTab, !selectedChildId && styles.filterTabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, !selectedChildId && styles.filterTabTextActive]}>
                All Children
              </Text>
            </TouchableOpacity>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                onPress={() => setSelectedChildId(child.id)}
                style={[
                  styles.filterTab,
                  selectedChildId === child.id && styles.filterTabActive,
                ]}
                activeOpacity={0.7}
              >
                <Image source={child.avatar} style={styles.avatarImage} />
                <Text
                  style={[
                    styles.filterTabText,
                    selectedChildId === child.id && styles.filterTabTextActive,
                  ]}
                >
                  {child.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Report Absence"
            onPress={() => router.push('/flows/report-absence')}
            variant="primary"
            style={styles.actionBtn}
          />
          <Button
            title="Apply for Leave"
            onPress={() => router.push('/flows/apply-leave')}
            variant="secondary"
            style={styles.actionBtn}
          />
        </View>

        {/* Tracking List */}
        <View style={styles.listSection}>
          <Text style={styles.listHeading}>Status & History</Text>

          {totalRecords === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#C4C4C6" />
              <Text style={styles.emptyText}>No recent absence or leave reports found.</Text>
            </View>
          ) : (
            <View style={styles.recordsList}>
              {/* Render Leave Applications */}
              {filteredLeaves.map((leave) => {
                const colors = getStatusStyle(leave.status);
                return (
                  <View key={leave.id} style={styles.recordCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.recordTitle}>Planned Leave ({leave.leaveType})</Text>
                        <Text style={styles.recordSubtitle}>For {getChildName(leave.childId)}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.statusText, { color: colors.text }]}>{leave.status}</Text>
                      </View>
                    </View>
                    <View style={styles.cardDetails}>
                      <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
                      <Text style={styles.detailsText}>
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </Text>
                    </View>
                    <View style={styles.cardDetails}>
                      <Ionicons name="information-circle-outline" size={14} color="#8E8E93" />
                      <Text style={styles.detailsText}>Reason: {leave.reason}</Text>
                    </View>
                  </View>
                );
              })}

              {/* Render Absences */}
              {filteredAbsences.map((abs) => {
                const colors = getStatusStyle(abs.status);
                return (
                  <View key={abs.id} style={styles.recordCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.recordTitle}>reported Absence ({abs.type})</Text>
                        <Text style={styles.recordSubtitle}>For {getChildName(abs.childId)}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.statusText, { color: colors.text }]}>{abs.status}</Text>
                      </View>
                    </View>
                    <View style={styles.cardDetails}>
                      <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
                      <Text style={styles.detailsText}>
                        Date: {formatDate(abs.date)} {abs.timeSlot ? `(${abs.timeSlot})` : ''}
                      </Text>
                    </View>
                    <View style={styles.cardDetails}>
                      <Ionicons name="alert-circle-outline" size={14} color="#8E8E93" />
                      <Text style={styles.detailsText}>Reason: {abs.reason}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 12,
  },
  titleText: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 26,
    color: Colors.light.text,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  avatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  filterTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionBtn: {
    flex: 0.48,
  },
  listSection: {
    paddingHorizontal: 24,
  },
  listHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginTop: 12,
  },
  recordsList: {
    width: '100%',
  },
  recordCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
  },
  recordSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  detailsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginLeft: 6,
  },
});
