import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect to onboarding welcome page
    router.replace('/onboarding/welcome');
  };

  const schoolInfo = [
    { title: 'School Year Info', icon: 'calendar-outline', route: '#' },
    { title: 'Curriculum & Courses', icon: 'book-outline', route: '#' },
    { title: 'Documents & Circulars', icon: 'document-text-outline', route: '#' },
    { title: 'Events Calendar', icon: 'notifications-outline', route: '#' },
  ];

  const logistics = [
    { title: 'Authorized Pickup Persons', icon: 'people-outline', route: '#' },
    { title: 'Extra Time Bookings', icon: 'time-outline', route: '#' },
    { title: 'Child Location History', icon: 'map-outline', route: '#' },
  ];

  const account = [
    { title: 'My Profile', icon: 'person-outline', route: '#' },
    { title: 'Settings & Notifications', icon: 'settings-outline', route: '#' },
    { title: 'Send Feedback', icon: 'chatbox-ellipses-outline', route: '#' },
    { title: 'About App', icon: 'information-circle-outline', route: '#' },
  ];

  const renderSection = (title: string, items: typeof schoolInfo) => (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <View style={styles.listContainer}>
        {items.map((item, idx) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => alert(`${item.title}: Mock detail loaded.`)}
            activeOpacity={0.7}
            style={[
              styles.listItem,
              idx === items.length - 1 && styles.lastItem,
            ]}
          >
            <View style={styles.itemLeft}>
              <Ionicons name={item.icon as any} size={20} color={Colors.light.primary} style={styles.itemIcon} />
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C4C4C6" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <View style={styles.header}>
          <Text style={styles.titleText}>More Functions</Text>
        </View>

        {/* Render sections */}
        {renderSection('School Information', schoolInfo)}
        {renderSection('Childcare Logistics', logistics)}
        {renderSection('Account & Settings', account)}

        {/* Log Out Button */}
        <View style={styles.actionContainer}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="secondary"
            style={styles.logoutButton}
          />
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
  section: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 14,
  },
  itemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.light.text,
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  logoutButton: {
    width: '100%',
  },
});
