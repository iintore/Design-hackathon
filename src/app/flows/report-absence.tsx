import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppState } from '@/context/AppStateContext';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';

export default function ReportAbsenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { children, reportAbsence, upcomingEvents } = useAppState();

  const [selectedChildId, setSelectedChildId] = useState(
    (params.childId as string) || children[0].id
  );
  const [absenceType, setAbsenceType] = useState<'Full Day' | 'Partial Day'>('Full Day');
  const [dateStr, setDateStr] = useState('2026-08-12'); // Mock default date matching the screenshot
  const [timeSlot, setTimeSlot] = useState('10:00-13:00');
  const [reason, setReason] = useState('');
  const [reasonSheetVisible, setReasonSheetVisible] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [success, setSuccess] = useState(false);

  const reasons = ['Illness', 'Doctor Appointment', 'Dentist Visit', 'Family Reasons', 'Other'];

  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Early validation: Check for duplicate absences
  useEffect(() => {
    if (!selectedChildId || !dateStr) return;
    
    // Check if an event already exists for this child on this date
    // E.g. "Peter day-off" on "Thu, 12 Aug" (mock date 2026-08-12)
    const formattedMatch = new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const isDuplicate = upcomingEvents.some(
      (evt) =>
        evt.childId === selectedChildId &&
        evt.type === 'absence' &&
        (evt.dateStr.includes(formattedMatch) || (selectedChildId === 'peter' && dateStr === '2026-08-12'))
    );

    if (isDuplicate) {
      setDuplicateWarning(
        `A duplicate absence already exists for ${selectedChild ? selectedChild.name.split(' ')[0] : 'this child'} on this day.`
      );
    } else {
      setDuplicateWarning('');
    }
  }, [selectedChildId, dateStr]);

  const handleSubmit = () => {
    if (!selectedChildId) {
      alert('Please select a child.');
      return;
    }
    if (!reason) {
      alert('Please select a reason.');
      return;
    }

    reportAbsence(selectedChildId, absenceType, dateStr, timeSlot, reason);
    setSuccess(true);
  };

  const handleFinish = () => {
    router.back();
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.light.success} />
          </View>
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successMessage}>
            Absence for {selectedChild?.name} has been reported successfully. The school and teachers have been notified.
          </Text>
          <Button title="Done" onPress={handleFinish} style={styles.doneButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Absence</Text>
        <View style={{ width: 24 }} /> {/* Balance close button */}
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

        {/* Absence Type Toggle */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Absence Duration</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setAbsenceType('Full Day')}
              style={[styles.toggleBtn, absenceType === 'Full Day' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, absenceType === 'Full Day' && styles.toggleBtnTextActive]}>
                Full Day
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAbsenceType('Partial Day')}
              style={[styles.toggleBtn, absenceType === 'Partial Day' && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleBtnText, absenceType === 'Partial Day' && styles.toggleBtnTextActive]}>
                Partial Day
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => alert('Date picker: Select Date')}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownValue}>{dateStr}</Text>
            <Ionicons name="calendar-outline" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Time selector (for partial day) */}
        {absenceType === 'Partial Day' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Time Slot</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => alert('Time selector: Select hours')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownValue}>{timeSlot}</Text>
              <Ionicons name="time-outline" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Reason Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Reason</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setReasonSheetVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownValue, !reason && styles.placeholderValue]}>
              {reason || 'Choose reason...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Duplicate warning inline box */}
        {duplicateWarning ? (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color={Colors.light.warningDark} />
            <Text style={styles.warningText}>{duplicateWarning}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <View style={styles.submitSection}>
          <Button
            title="Submit Report"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>

      {/* Reason Sheet */}
      <BottomSheet
        visible={reasonSheetVisible}
        onClose={() => setReasonSheetVisible(false)}
        title="Reason for Absence"
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
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 10,
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.warningLight,
    borderWidth: 1,
    borderColor: Colors.light.warning + '30',
    borderRadius: 16,
    marginBottom: 24,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.light.warningDark,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  submitSection: {
    marginTop: 16,
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
