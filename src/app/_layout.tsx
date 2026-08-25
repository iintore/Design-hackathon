import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold,
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { AppStateProvider } from '@/context/AppStateContext';
import { ThemeProvider, DefaultTheme } from 'expo-router/react-navigation';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync().catch(() => {});

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PPEditorialNew-Regular': require('@/assets/fonts/PPEditorialNew-Regular-BF644b214ff145f.otf'),
    'PPEditorialNew-Italic': require('@/assets/fonts/PPEditorialNew-Italic-BF644b214fb0c0a.otf'),
    'PPEditorialNew-Ultrabold': require('@/assets/fonts/PPEditorialNew-Ultrabold-BF644b21500840c.otf'),
    'PPEditorialNew-UltraboldItalic': require('@/assets/fonts/PPEditorialNew-UltraboldItalic-BF644b214faef01.otf'),
    'PPEditorialNew-Ultralight': require('@/assets/fonts/PPEditorialNew-Ultralight-BF644b21500d0c0.otf'),
    'PPEditorialNew-UltralightItalic': require('@/assets/fonts/PPEditorialNew-UltralightItalic-BF644b214ff1e9b.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppStateProvider>
      <ThemeProvider value={AppTheme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Onboarding Flow */}
          <Stack.Screen name="onboarding/welcome" />
          <Stack.Screen name="onboarding/confirm-children" />
          
          {/* Main App Tabs */}
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          
          {/* Child Details */}
          <Stack.Screen 
            name="child/[id]" 
            options={{ 
              headerShown: true, 
              headerTitle: '',
              headerShadowVisible: false,
              headerBackTitle: '',
              headerTintColor: Colors.light.text,
              headerStyle: { backgroundColor: Colors.light.background },
            }} 
          />
          
          {/* Full Screen Flows (Modals) */}
          <Stack.Screen 
            name="flows/report-absence" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="flows/apply-leave" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="flows/submit-schedule" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="flows/send-message" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="chat/[threadId]" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="contacts" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
        </Stack>
        <AnimatedSplashOverlay />
      </ThemeProvider>
    </AppStateProvider>
  );
}
