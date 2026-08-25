import React, { useState, useEffect } from 'react';
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

export default function ApplyLeaveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { children, applyForLeave } = useAppState();

  const [selectedChildId, setSelectedChildId] = useState(
    (params.childId as string) || children[0].id
  );
  const [leaveType, setLeaveType] = useState<'School' | 'Preschool/Leisure'>('School');
  const [startDate, setStartDate] = useState('2026-07-15'); // Mock future date
  const [endDate, setEndDate] = useState('2026-07-18');
  const [reason, setReason] = useState('');
  const [reasonSheetVisible, setReasonSheetVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Warning States
  const [warningText, setWarningText] = useState('');
  const [commentRequired, setCommentRequired] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedChild = children.find((c) => c.id === selectedChildId);
  const reasons = ['Family Holiday', 'Sports Event', 'Study / Student Exchange', 'Other'];

  // Validations: Check date boundaries and weekend restrictions
  useEffect(() => {
    if (!startDate || !endDate) return;

    let warning = '';
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Check if start is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 2. Municipality rule: 14 days notice required
    const minNoticeDate = new Date(today);
    minNoticeDate.setDate(today.getDate() + 14);

    if (start < minNoticeDate) {
      warning = 'Municipality rules require leave applications to be submitted at least 14 days in advance. A special review might be required.';
    }

    // 3. School days check: Check if range includes at least one weekday (Mon-Fri)
    let hasSchoolDay = false;
    let current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // Not Sunday (0) and not Saturday (6)
        hasSchoolDay = true;
        break;
      }
      current.setDate(current.getDate() + 1);
    }

    if (!hasSchoolDay) {
      warning = 'This leave period does not include a school day (weekend only).';
    }

    setWarningText(warning);
  }, [startDate, endDate]);

  // Comment requirement check
  useEffect(() => {
    if (reason === 'Other') {
      setCommentRequired(true);
    } else {
      setCommentRequired(false);
    }
  }, [reason]);

  const handleSubmit = () => {
    if (!selectedChildId) {
      alert('Please select a child.');
      return;
    }
    if (!reason) {
      alert('Please select a reason.');
      return;
    }
    if (commentRequired && !comment.trim()) {
      alert('A comment is required when selecting "Other" as the reason.');
      return;
    }
    if (!acceptTerms) {
      alert('You must accept the terms & rules.');
      return;
    }

    applyForLeave({
      childId: selectedChildId,
      leaveType,
      startDate,
      endDate,
      reason,
      comment: comment ? comment : undefined,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.light.success} />
          </View>
          <Text style={styles.successTitle}>Application Sent</Text>
          <Text style={styles.successMessage}>
            Your leave request for {selectedChild?.name} has been sent to the school administration. You will be notified when a decision is made.
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
        <Text style={styles.headerTitle}>Apply for Leave</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Child Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Who is this for?</Text>
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

        {/* Leave Type Toggle */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Leave Type</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setLeaveType('School')}
              style={[styles.toggleBtn, leaveType === 'School' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, leaveType === 'School' && styles.toggleBtnTextActive]}>
                School
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLeaveType('Preschool/Leisure')}
              style={[styles.toggleBtn, leaveType === 'Preschool/Leisure' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, leaveType === 'Preschool/Leisure' && styles.toggleBtnTextActive]}>
                Preschool / Leisure
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dates Range Picker */}
        <View style={styles.datesRow}>
          <View style={[styles.formGroup, { flex: 0.48 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => alert('Start Date Picker')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownValue}>{startDate}</Text>
              <Ionicons name="calendar-outline" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.formGroup, { flex: 0.48 }]}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => alert('End Date Picker')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownValue}>{endDate}</Text>
              <Ionicons name="calendar-outline" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reason Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Reason for Leave</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setReasonSheetVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownValue, !reason && styles.placeholderValue]}>
              {reason || 'Select reason...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Comment field (Required if "Other" is selected) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Comment {commentRequired ? <Text style={styles.requiredMark}>* (Required)</Text> : ''}
          </Text>
          <View style={[styles.textAreaContainer, commentRequired && !comment.trim() && styles.textAreaRequired]}>
            <TextInput
              placeholder={commentRequired ? "Please explain the reason for the leave" : "Optional comments..."}
              placeholderTextColor={Colors.light.textTertiary}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              style={styles.textArea}
            />
          </View>
        </View>

        {/* Warning Banner */}
        {warningText ? (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color={Colors.light.warningDark} />
            <Text style={styles.warningText}>{warningText}</Text>
          </View>
        ) : null}

        {/* Accept terms Checkbox */}
        <TouchableOpacity
          onPress={() => setAcceptTerms(!acceptTerms)}
          activeOpacity={0.8}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
            {acceptTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I confirm that I have informed the joint guardian (if applicable) and understand the municipality rules.
          </Text>
        </TouchableOpacity>

        {/* Submit */}
        <View style={styles.submitSection}>
          <Button
            title="Submit Leave Application"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>

      {/* Reason Sheet */}
      <BottomSheet
        visible={reasonSheetVisible}
        onClose={() => setReasonSheetVisible(false)}
        title="Reason for Leave"
      >
        <View style={styles.sheetContent}>
          {reasons.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => {
                setReason(r);
                setReasonSheetVisible(false);
              }}
              style={styles.reasonRow}
            >
              <Text style={[styles.reasonText, reason === r && styles.activeReasonText]}>
                {r}
              </Text>
              {reason === r && <Ionicons name="checkmark" size={20} color={Colors.light.primary} />}
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
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  toggleBtnTextActive: {
    color: Colors.light.text,
    fontFamily: 'Inter-SemiBold',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  placeholderValue: {
    color: Colors.light.textTertiary,
  },
  requiredMark: {
    color: Colors.light.danger,
    fontSize: 12,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textAreaRequired: {
    borderColor: Colors.light.danger + '80',
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
    height: 90,
    textAlignVertical: 'top',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.warningLight,
    borderWidth: 1,
    borderColor: Colors.light.warning + '30',
    borderRadius: 16,
    marginBottom: 20,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.light.warningDark,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C4C4C6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
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
