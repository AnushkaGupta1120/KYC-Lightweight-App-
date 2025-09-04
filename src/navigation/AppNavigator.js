import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import KYCMethodScreen from '../screens/KYCMethodScreen';
import DocumentCaptureScreen from '../screens/DocumentCaptureScreen';
import FaceAuthScreen from '../screens/FaceAuthScreen';
import DigiLockerScreen from '../screens/DigiLockerScreen';
import SuccessScreen from '../screens/SuccessScreen';
import {colors} from '../styles/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          title: 'भाषा चुनें / Select Language',
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="KYCMethod"
        component={KYCMethodScreen}
        options={{
          title: 'KYC विधि / KYC Method',
        }}
      />
      <Stack.Screen
        name="DocumentCapture"
        component={DocumentCaptureScreen}
        options={{
          title: 'दस्तावेज़ / Documents',
        }}
      />
      <Stack.Screen
        name="FaceAuth"
        component={FaceAuthScreen}
        options={{
          title: 'चेहरे की पहचान / Face Verification',
        }}
      />
      <Stack.Screen
        name="DigiLocker"
        component={DigiLockerScreen}
        options={{
          title: 'DigiLocker',
        }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          title: 'सफल / Success',
          headerLeft: null,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
