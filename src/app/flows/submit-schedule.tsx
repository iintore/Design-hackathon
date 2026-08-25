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

export default function SubmitScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { children, submitSchedule } = useAppState();

  const [selectedChildId, setSelectedChildId] = useState(
    (params.childId as string) || children[0].id
  );
  const [startDate, setStartDate] = useState('2026-07-01');
  const [repeatPattern, setRepeatPattern] = useState('Every Week');
  const [repeatSheetVisible, setRepeatSheetVisible] = useState(false);

  // Daily hours state
  const [checkedDays, setCheckedDays] = useState<Record<string, boolean>>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
  });
  
  const [dailyTimes, setDailyTimes] = useState<Record<string, string>>({
    monday: '08:00 - 15:30',
    tuesday: '08:00 - 15:30',
    wednesday: '08:00 - 15:30',
    thursday: '08:00 - 15:30',
    friday: '08:00 - 14:00',
  });

  const [warningText, setWarningText] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedChild = children.find((c) => c.id === selectedChildId);
  const repeatOptions = ['Every Week', 'Every 2 Weeks', 'Odd Weeks Only', 'Even Weeks Only'];

  // Municipality validation: Schedule changes must be 1 day in advance
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeDiff = start.getTime() - today.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff < 1) {
      setWarningText('This date cannot be changed because your municipality requires changes at least 1 day in advance.');
    } else {
      setWarningText('');
    }
  }, [startDate]);

  const toggleDay = (day: string) => {
    setCheckedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleTimeChange = (day: string, text: string) => {
    setDailyTimes((prev) => ({
      ...prev,
      [day]: text,
    }));
  };

  const handleSubmit = () => {
    if (!selectedChildId) {
      alert('Please select a child.');
      return;
    }

    // Verify checked days have times
    const activeDays = Object.keys(checkedDays).filter((k) => checkedDays[k]);
    if (activeDays.length === 0) {
      alert('Please select at least one attendance day.');
      return;
    }

    for (const d of activeDays) {
      if (!dailyTimes[d].trim()) {
        alert(`Please enter times for ${d.charAt(0).toUpperCase() + d.slice(1)}.`);
        return;
      }
    }

    // Build days structure for submission
    const daysData: any = {};
    activeDays.forEach((d) => {
      daysData[d] = dailyTimes[d];
    });

    submitSchedule({
      childId: selectedChildId,
      startDate,
      repeatPattern,
      days: daysData,
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
          <Text style={styles.successTitle}>Schedule Submitted</Text>
          <Text style={styles.successMessage}>
            New childcare schedule for {selectedChild?.name} has been submitted successfully. The preschool lead has been notified.
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
        <Text style={styles.headerTitle}>Submit Schedule</Text>
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

        {/* Start Date & Repeat Pattern */}
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
            <Text style={styles.label}>Repeat Pattern</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setRepeatSheetVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownValue}>{repeatPattern}</Text>
              <Ionicons name="chevron-down" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Schedule Entry */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Attendance Times</Text>
          <View style={styles.scheduleGrid}>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => {
              const isChecked = checkedDays[day];
              const displayDay = day.charAt(0).toUpperCase() + day.slice(1, 3);
              return (
                <View key={day} style={styles.dayRow}>
                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => toggleDay(day)}
                    style={[styles.checkbox, isChecked && styles.checkboxActive]}
                    activeOpacity={0.8}
                  >
                    {isChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <Text style={[styles.dayLabel, !isChecked && styles.dayLabelDisabled]}>
                    {displayDay}
                  </Text>
                  
                  {/* Time input */}
                  <View style={[styles.timeInputContainer, !isChecked && styles.timeInputContainerDisabled]}>
                    <TextInput
                      value={dailyTimes[day]}
                      onChangeText={(t) => handleTimeChange(day, t)}
                      editable={isChecked}
                      placeholder="e.g. 08:00 - 15:30"
                      placeholderTextColor={Colors.light.textTertiary}
                      style={[styles.timeInput, !isChecked && styles.timeInputDisabled]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Warning Banner */}
        {warningText ? (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color={Colors.light.warningDark} />
            <Text style={styles.warningText}>{warningText}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <View style={styles.submitSection}>
          <Button
            title="Submit Schedule"
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>

      {/* Repeat Pattern Sheet */}
      <BottomSheet
        visible={repeatSheetVisible}
        onClose={() => setRepeatSheetVisible(false)}
        title="Select Repeat Pattern"
      >
        <View style={styles.sheetContent}>
          {repeatOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                setRepeatPattern(opt);
                setRepeatSheetVisible(false);
              }}
              style={styles.reasonRow}
            >
              <Text style={[styles.reasonText, repeatPattern === opt && styles.activeReasonText]}>
                {opt}
              </Text>
              {repeatPattern === opt && <Ionicons name="checkmark" size={20} color={Colors.light.primary} />}
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
  scheduleGrid: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C4C4C6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  dayLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.text,
    width: 44,
  },
  dayLabelDisabled: {
    color: Colors.light.textTertiary,
  },
  timeInputContainer: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  timeInputContainerDisabled: {
    backgroundColor: '#EBEBEB',
    borderColor: 'transparent',
  },
  timeInput: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
  timeInputDisabled: {
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
