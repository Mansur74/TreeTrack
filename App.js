/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './navigations/BottomNavigation';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const App = () => {
  return (
    <NavigationContainer>
      <BottomNavigation/>
    </NavigationContainer>
  );
};


export default App;
