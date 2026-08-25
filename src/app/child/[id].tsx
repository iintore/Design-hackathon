import React from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppState } from '@/context/AppStateContext';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { children, upcomingEvents } = useAppState();

  const child = children.find((c) => c.id === id);

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Child not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  // Filter events related to this child
  const childEvents = upcomingEvents.filter((e) => e.childId === child.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Child Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={child.avatar} style={styles.avatarImage} />
          </View>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childSchool}>{child.school}</Text>
          <Text style={styles.childGrade}>{child.grade}</Text>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{child.status}</Text>
          </View>
        </View>

        {/* Quick Actions Specific to Child */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Child Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/flows/report-absence', params: { childId: child.id } })}
              activeOpacity={0.8}
              style={[styles.actionCard, { borderColor: '#FF3B301A' }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#FF3B3012' }]}>
                <Ionicons name="alert-circle" size={24} color="#FF3B30" />
              </View>
              <Text style={styles.actionCardTitle}>Report Absence</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/flows/apply-leave', params: { childId: child.id } })}
              activeOpacity={0.8}
              style={[styles.actionCard, { borderColor: '#FF8A001A' }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#FF8A0012' }]}>
                <Ionicons name="calendar" size={24} color="#FF8A00" />
              </View>
              <Text style={styles.actionCardTitle}>Apply for Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/flows/send-message', params: { childId: child.id } })}
              activeOpacity={0.8}
              style={[styles.actionCard, { borderColor: '#3B82F61A' }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#3B82F612' }]}>
                <Ionicons name="chatbubble" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionCardTitle}>Message School</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Schedule info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Today's Schedule</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <Ionicons name="time" size={20} color={Colors.light.primary} />
              <View style={styles.scheduleTextContainer}>
                <Text style={styles.scheduleTitle}>Attendance Hours</Text>
                <Text style={styles.scheduleHours}>
                  {child.status === 'Day off' ? 'None (Day off)' : '08:00 - 15:30'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity / Events */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Recent Activity</Text>
          {childEvents.length === 0 ? (
            <Text style={styles.emptyText}>No recent activity reported.</Text>
          ) : (
            <View style={styles.activityList}>
              {childEvents.map((evt) => (
                <View key={evt.id} style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: evt.color }]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{evt.title}</Text>
                    <Text style={styles.activityMeta}>
                      {evt.time} • {evt.dateStr}
                    </Text>
                  </View>
                </View>
              ))}
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
    paddingHorizontal: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F2FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  childName: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 26,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  childSchool: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  childGrade: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#E8E8EC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#1C1C1E',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 0.31,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: Colors.light.text,
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTextContainer: {
    marginLeft: 12,
  },
  scheduleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  scheduleHours: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.light.text,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  activityList: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
  },
  activityMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
