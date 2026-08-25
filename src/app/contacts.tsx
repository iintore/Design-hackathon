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
import { useAppState } from '@/context/AppStateContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactsScreen() {
  const router = useRouter();
  const { schoolContacts } = useAppState();

  // Group contacts by role
  const groupedContacts: Record<string, typeof schoolContacts> = {};
  schoolContacts.forEach((contact) => {
    const group = contact.role;
    if (!groupedContacts[group]) {
      groupedContacts[group] = [];
    }
    groupedContacts[group].push(contact);
  });

  const groupOrder = ['Class Teacher', 'Preschool Lead', 'Head of School', 'Administration', 'School Nurse'];
  const sortedGroups = Object.keys(groupedContacts).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );

  const handleContactMessage = (contact: typeof schoolContacts[0]) => {
    if (contact.threadId) {
      router.push(`/chat/${contact.threadId}`);
    } else {
      // Navigate to compose for contacts without existing threads
      router.push('/flows/send-message');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.titleText}>Contacts</Text>
          <Text style={styles.subtitleText}>Pinewood Preschool</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* School Info Banner */}
      <View style={styles.schoolBanner}>
        <View style={styles.schoolIconContainer}>
          <Ionicons name="school" size={20} color={Colors.light.primary} />
        </View>
        <View style={styles.schoolBannerText}>
          <Text style={styles.schoolName}>Pinewood Preschool</Text>
          <Text style={styles.schoolAddress}>{schoolContacts.length} staff members</Text>
        </View>
      </View>

      {/* Contact Groups */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {sortedGroups.map((group) => (
          <View key={group} style={styles.group}>
            <Text style={styles.groupTitle}>{group}</Text>
            {groupedContacts[group].map((contact) => (
              <View key={contact.id} style={styles.contactRow}>
                {/* Avatar */}
                <View style={[styles.contactAvatar, { backgroundColor: contact.color }]}>
                  <Text style={styles.contactAvatarText}>{contact.initial}</Text>
                </View>

                {/* Info */}
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactSchool}>{contact.school}</Text>
                </View>

                {/* Message action */}
                <TouchableOpacity
                  style={styles.messageBtn}
                  onPress={() => handleContactMessage(contact)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-outline" size={18} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.light.text,
  },
  subtitleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  schoolBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
  },
  schoolIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  schoolBannerText: {
    flex: 1,
  },
  schoolName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  schoolAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  group: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  groupTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  contactSchool: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  messageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
