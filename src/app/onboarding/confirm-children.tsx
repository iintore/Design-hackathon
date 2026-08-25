import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/context/AppStateContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ConfirmChildrenScreen() {
  const router = useRouter();
  const { children } = useAppState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [confirmedChildren, setConfirmedChildren] = useState<Record<string, boolean>>({
    peter: true,
    linda: true,
  });

  const toggleChildConfirmation = (id: string) => {
    setConfirmedChildren((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirm = () => {
    // Ensure at least one child is checked
    const confirmedList = Object.keys(confirmedChildren).filter((k) => confirmedChildren[k]);
    if (confirmedList.length === 0) {
      alert('Please confirm at least one child to continue.');
      return;
    }
    
    // Redirect to main tabs layout
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Children</Text>
          <Text style={styles.subtitle}>
            We found {children.length} children linked to your SchoolID account. Confirm they are correct:
          </Text>
        </View>

        {/* Children List */}
        <View style={styles.childrenList}>
          {children.map((child) => {
            const isConfirmed = confirmedChildren[child.id];
            return (
              <TouchableOpacity
                key={child.id}
                onPress={() => toggleChildConfirmation(child.id)}
                activeOpacity={0.9}
                style={[
                  styles.childCard,
                  isConfirmed && styles.childCardActive,
                ]}
              >
                <View style={styles.avatarContainer}>
                  <Image source={child.avatar} style={styles.avatarImage} />
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childMeta}>
                    {child.grade} • {child.school}
                  </Text>
                </View>
                <View style={[styles.checkbox, isConfirmed && styles.checkboxActive]}>
                  {isConfirmed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications preferences card */}
        <View style={styles.prefCard}>
          <View style={styles.prefIconContainer}>
            <Ionicons name="notifications" size={24} color={Colors.light.primary} />
          </View>
          <View style={styles.prefTextContainer}>
            <Text style={styles.prefTitle}>Stay Updated</Text>
            <Text style={styles.prefDesc}>
              Receive instant updates about absences, school events, and messages from teachers.
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D1D6', true: Colors.light.primaryLight }}
            thumbColor={notificationsEnabled ? Colors.light.primary : '#FFFFFF'}
            ios_backgroundColor="#D1D1D6"
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Confirm & Enter App"
            onPress={handleConfirm}
            style={styles.submitButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PPEditorialNew-Regular',
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  childrenList: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  childCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.card,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F2FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  childMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C4C4C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#F0EEFD', // Very light purple background matching color system
    marginBottom: 32,
  },
  prefIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  prefTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  prefTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  prefDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#4E4D68',
    lineHeight: 18,
  },
  footer: {
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
  },
});
