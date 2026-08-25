import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function WelcomeScreen() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('Sweden');
  const [countrySheetVisible, setCountrySheetVisible] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  const countries = ['Sweden', 'Norway', 'Denmark', 'Germany'];

  const handleLogin = () => {
    if (!schoolId.trim()) {
      setErrorText('Please enter your SchoolID');
      return;
    }
    setErrorText('');
    setLoading(true);
    
    // Simulate API load
    setTimeout(() => {
      setLoading(false);
      router.push('/onboarding/confirm-children');
    }, 1000);
  };

  const selectCountry = (country: string) => {
    setSelectedCountry(country);
    setCountrySheetVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('../../../assets/images/Logo.svg')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.tagline}>Your daily guardian assistant</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Country Selector */}
            <Text style={styles.label}>Select Country</Text>
            <TouchableOpacity
              onPress={() => setCountrySheetVisible(true)}
              style={styles.dropdownButton}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{selectedCountry}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            {/* SchoolID input */}
            <Text style={styles.label}>SchoolID</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your SchoolID username"
                placeholderTextColor={Colors.light.textTertiary}
                value={schoolId}
                onChangeText={(t) => {
                  setSchoolId(t);
                  setErrorText('');
                }}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={Colors.light.textTertiary}
                secureTextEntry
                value={password}
                onChangeText={(t) => setPassword(t)}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

            {/* Login Button */}
            <Button
              title="Log in with SchoolID"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity style={styles.troubleLink}>
              <Text style={styles.troubleText}>Having trouble logging in?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Selection Bottom Sheet */}
      <BottomSheet
        visible={countrySheetVisible}
        onClose={() => setCountrySheetVisible(false)}
        title="Choose a country"
      >
        <View style={styles.sheetContent}>
          {countries.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => selectCountry(c)}
              style={styles.countryRow}
            >
              <Text
                style={[
                  styles.countryRowText,
                  selectedCountry === c && styles.activeCountryText,
                ]}
              >
                {c}
              </Text>
              {selectedCountry === c && (
                <Ionicons name="checkmark" size={20} color={Colors.light.primary} />
              )}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    backgroundColor: '#4E33D9',
    width: '100%',
    paddingVertical: 36,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#4E33D9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    width: 190,
    height: 56,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E0DBFA',
    marginTop: 12,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 16,
  },
  dropdownButton: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.light.card,
  },
  dropdownText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: Colors.light.card,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.light.text,
  },
  loginButton: {
    marginTop: 32,
  },
  troubleLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  troubleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: Colors.light.danger,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  countryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  countryRowText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  activeCountryText: {
    color: Colors.light.primary,
    fontFamily: 'Inter-SemiBold',
  },
});
