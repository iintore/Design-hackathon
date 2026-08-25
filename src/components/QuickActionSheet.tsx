import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface QuickActionSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickActionSheet: React.FC<QuickActionSheetProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();

  const handleAction = (route: string) => {
    onClose();
    // Short delay to let bottom sheet close before opening modal
    setTimeout(() => {
      router.push(route as any);
    }, 200);
  };

  const actions = [
    {
      title: 'Report Absence',
      desc: 'Report illness or other unexpected absence today',
      icon: 'alert-circle',
      color: '#FF3B30', // Red
      route: '/flows/report-absence',
    },
    {
      title: 'Apply for Leave',
      desc: 'Request planned school or preschool days off',
      icon: 'calendar',
      color: '#FF8A00', // Warning Orange
      route: '/flows/apply-leave',
    },
    {
      title: 'Submit Schedule',
      desc: 'Set childcare or preschool attendance hours',
      icon: 'time',
      color: '#4E33D9', // CUI Brand Purple
      route: '/flows/submit-schedule',
    },
    {
      title: 'Send Message',
      desc: 'Message your child\'s teacher or preschool lead',
      icon: 'chatbubble',
      color: '#3B82F6', // Royal Blue
      route: '/flows/send-message',
    },
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose} title="What would you like to do?">
      <View style={styles.listContainer}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.title}
            onPress={() => handleAction(act.route)}
            activeOpacity={0.7}
            style={styles.item}
          >
            <View style={[styles.iconContainer, { backgroundColor: act.color + '12' }]}>
              <Ionicons name={act.icon as any} size={24} color={act.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{act.title}</Text>
              <Text style={styles.desc}>{act.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C4C4C6" />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  desc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});
