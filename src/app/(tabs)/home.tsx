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
import { Ionicons } from '@expo/vector-icons';
import { QuickActionSheet } from '@/components/QuickActionSheet';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { children, upcomingEvents } = useAppState();
  const [fabOpen, setFabOpen] = useState(false);

  const handleChildPress = (id: string) => {
    router.push(`/child/${id}` as any);
  };

  const handleQuickAction = (actionName: string) => {
    if (actionName === 'Schedule') {
      router.push('/flows/submit-schedule');
    } else if (actionName === 'Absence') {
      router.push('/flows/report-absence');
    } else if (actionName === 'Message') {
      router.push('/flows/send-message');
    } else if (actionName === 'Curriculum') {
      alert('Curriculum view: Details will be loaded here.');
    }
  };

  const handleMenuPress = (route: string) => {
    setFabOpen(false);
    setTimeout(() => {
      router.push(route as any);
    }, 100);
  };

  // Format today's date for display matching mockup: "Tue, 6 Jan 2025"
  const formattedDate = 'Tue, 6 Jan 2025';

  const getEventAccentColor = (event: any) => {
    if (event.id === 'event-1' || (event.type === 'absence' && event.childId === 'peter')) {
      return '#00B0FF';
    }
    if (event.id === 'event-2' || event.type === 'event' || event.type === 'leave') {
      return '#FF9100';
    }
    if (event.id === 'event-3' || (event.type === 'absence' && event.childId === 'linda')) {
      return '#E1BEE7';
    }
    return Colors.light.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hello Header */}
        <View style={styles.header}>
          <Text style={styles.titleText}>Good morning, Tony</Text>
          <Text style={styles.subtitleText}>{formattedDate}</Text>
        </View>

        {/* Children Row */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Children</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.childrenRow}
          >
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                onPress={() => handleChildPress(child.id)}
                activeOpacity={0.8}
                style={styles.childCard}
              >
                <View style={styles.childCardHeader}>
                  <View style={styles.avatarContainer}>
                    <Image source={child.avatar} style={styles.avatarImage} />
                  </View>
                  <Text style={styles.childName}>{child.name}</Text>
                </View>
                
                <View style={styles.badgeRow}>
                  {child.status === 'Day off' ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Day off</Text>
                    </View>
                  ) : (
                    <>
                      <View style={[styles.badge, styles.badgeSuccess]}>
                        <Text style={[styles.badgeText, styles.badgeTextSuccess]}>{child.status}</Text>
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>9AM - 5PM</Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {/* Schedule Action */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => handleQuickAction('Schedule')}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                <Ionicons name="calendar-outline" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Schedule</Text>
            </View>

            {/* Curriculum Action */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => handleQuickAction('Curriculum')}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                <Ionicons name="book-outline" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Curriculum</Text>
            </View>

            {/* Absence Action */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => handleQuickAction('Absence')}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                <Ionicons name="person-outline" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Absence</Text>
            </View>

            {/* Message Action */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => handleQuickAction('Message')}
                activeOpacity={0.7}
                style={styles.actionButton}
              >
                <Ionicons name="paper-plane-outline" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Message</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Upcoming</Text>
          <View style={styles.upcomingList}>
            {upcomingEvents.map((event) => {
              const accentColor = getEventAccentColor(event);
              return (
                <View key={event.id} style={[styles.eventCard, { borderLeftColor: accentColor }]}>
                  <View style={styles.eventRow}>
                    {/* Category Indicator Dot */}
                    <View style={[styles.dot, { borderColor: event.color }]} />
                    <Text style={styles.eventTime}>{event.time}</Text>
                    
                    {/* Options Menu */}
                    <TouchableOpacity style={styles.optionsButton} activeOpacity={0.6}>
                      <Ionicons name="ellipsis-horizontal" size={16} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.dateStr}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Dimmed Backdrop Overlay when FAB is open */}
      {fabOpen && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropOverlay}
          onPress={() => setFabOpen(false)}
        />
      )}

      {/* Speed Dial Action Menu */}
      {fabOpen && (
        <View style={styles.fabMenu}>
          <TouchableOpacity
            onPress={() => handleMenuPress('/flows/report-absence')}
            activeOpacity={0.8}
            style={styles.fabMenuItem}
          >
            <Text style={styles.fabMenuText}>Report absence</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleMenuPress('/flows/submit-schedule')}
            activeOpacity={0.8}
            style={styles.fabMenuItem}
          >
            <Text style={styles.fabMenuText}>Submit schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleMenuPress('/flows/send-message')}
            activeOpacity={0.8}
            style={styles.fabMenuItem}
          >
            <Text style={styles.fabMenuText}>Send messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleMenuPress('/flows/apply-leave')}
            activeOpacity={0.8}
            style={styles.fabMenuItem}
          >
            <Text style={styles.fabMenuText}>Apply for leave</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        onPress={() => setFabOpen(!fabOpen)}
        activeOpacity={0.8}
        style={[styles.fab, fabOpen && styles.fabOpen]}
      >
        <Ionicons name={fabOpen ? "close" : "add"} size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 100, // Leave space for FAB and Bottom Tabs
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
  subtitleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#334155', // Slate-700
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#334155', // Slate-700
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  childrenRow: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  childCard: {
    width: 180,
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
  },
  childCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  childName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#1C1C1E',
    flex: 1,
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#E8E8EC', // Light status capsule background
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginRight: 4,
    marginTop: 4,
  },
  badgeSuccess: {
    backgroundColor: '#E6F7F0', // Light green bg for At School
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#1C1C1E',
  },
  badgeTextSuccess: {
    color: '#008254', // Dark green text for At School
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  actionContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0EEFD', // Light purple wash background matching screenshot
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#334155', // Slate-700
  },
  upcomingList: {
    paddingHorizontal: 24,
  },
  eventCard: {
    backgroundColor: '#F5F5F7',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  eventTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#334155', // Slate-700
    flex: 1,
  },
  optionsButton: {
    padding: 4,
  },
  eventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  eventDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#334155', // Slate-700
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: Platform.OS === 'ios' ? 24 : 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4E33D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 90,
  },
  fabOpen: {},
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 80,
  },
  fabMenu: {
    position: 'absolute',
    right: 24,
    bottom: Platform.OS === 'ios' ? 92 : 84,
    alignItems: 'flex-end',
    zIndex: 95,
  },
  fabMenuItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fabMenuText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1C1C1E',
  },
});
