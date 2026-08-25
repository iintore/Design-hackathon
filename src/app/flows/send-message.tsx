import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppState } from '@/context/AppStateContext';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';

export default function SendMessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { children, sendMessage } = useAppState();

  const [selectedChildId, setSelectedChildId] = useState(
    (params.childId as string) || children[0].id
  );
  
  const [recipient, setRecipient] = useState('Mrs. Sarah Jenkins (Class Teacher)');
  const [recipientSheetVisible, setRecipientSheetVisible] = useState(false);
  const [topic, setTopic] = useState('General Update');
  const [topicSheetVisible, setTopicSheetVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedChild = children.find((c) => c.id === selectedChildId);

  const recipients = [
    'Mrs. Sarah Jenkins (Class Teacher)',
    'Mr. David Miller (Preschool Lead)',
    'Principal Lars (School Administration)',
    'Afterschool Care Coordinator',
  ];

  const topics = ['Absence / Leave Inquiry', 'Schedule Adjustment', 'Leisure & Activities', 'General Update'];

  const handleSubmit = () => {
    if (!selectedChildId) {
      alert('Please select a child.');
      return;
    }
    if (!recipient) {
      alert('Please select a recipient.');
      return;
    }
    if (!messageText.trim()) {
      alert('Please enter your message.');
      return;
    }

    sendMessage(selectedChildId, recipient, topic, messageText);
    setSuccess(true);
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="paper-plane" size={70} color={Colors.light.primary} />
          </View>
          <Text style={styles.successTitle}>Message Sent</Text>
          <Text style={styles.successMessage}>
            Your message has been sent to {recipient} regarding {selectedChild?.name}. They will reply in your inbox.
          </Text>
          <Button title="Done" onPress={() => router.back()} style={styles.doneButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Child Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Child Context</Text>
          <View style={styles.childSelectorRow}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                onPress={() => setSelectedChildId(child.id)}
                style={[
                  styles.childCard,
                  selectedChildId === child.id && styles.childCardActive,
                ]}
                activeOpacity={0.8}
              >
                <Image source={child.avatar} style={styles.avatarImage} />
                <Text
                  style={[
                    styles.childName,
                    selectedChildId === child.id && styles.childNameActive,
                  ]}
                >
                  {child.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recipient Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>To Recipient</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setRecipientSheetVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownValue}>{recipient}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Topic Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Message Topic</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setTopicSheetVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownValue}>{topic}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Message Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Message</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              placeholder="Write your message here..."
              placeholderTextColor={Colors.light.textTertiary}
              multiline
              numberOfLines={6}
              value={messageText}
              onChangeText={setMessageText}
              style={styles.textArea}
            />
          </View>
        </View>

        {/* Send Button */}
        <View style={styles.submitSection}>
          <Button
            title="Send Message"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>

      {/* Recipient Sheet */}
      <BottomSheet
        visible={recipientSheetVisible}
        onClose={() => setRecipientSheetVisible(false)}
        title="Select Recipient"
      >
        <View style={styles.sheetContent}>
          {recipients.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => {
                setRecipient(r);
                setRecipientSheetVisible(false);
              }}
              style={styles.reasonRow}
            >
              <Text style={[styles.reasonText, recipient === r && styles.activeReasonText]}>
                {r}
              </Text>
              {recipient === r && <Ionicons name="checkmark" size={20} color={Colors.light.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* Topic Sheet */}
      <BottomSheet
        visible={topicSheetVisible}
        onClose={() => setTopicSheetVisible(false)}
        title="Select Topic"
      >
        <View style={styles.sheetContent}>
          {topics.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setTopic(t);
                setTopicSheetVisible(false);
              }}
              style={styles.reasonRow}
            >
              <Text style={[styles.reasonText, topic === t && styles.activeReasonText]}>
                {t}
              </Text>
              {topic === t && <Ionicons name="checkmark" size={20} color={Colors.light.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 22,
    color: Colors.light.text,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 8,
  },
  childSelectorRow: {
    flexDirection: 'row',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  childCardActive: {
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  avatarImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  childName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  childNameActive: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    backgroundColor: Colors.light.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdownValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
    height: 120,
    textAlignVertical: 'top',
  },
  submitSection: {
    marginTop: 20,
  },
  submitBtn: {
    width: '100%',
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  reasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  reasonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  activeReasonText: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  doneButton: {
    width: '100%',
  },
});
