import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {colors} from './src/styles/colors';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
