/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
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
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSign, setIsSign] = useState(false);

  return (
    <View>
      {isSignedIn ? (
        <NavigationContainer>
          <BottomNavigation/>
        </NavigationContainer>
      ) : isSign ? (
        <SignIn setIsSignedIn={setIsSignedIn} setIsSign={setIsSign}/>
      ) : <SignUp setIsSignedIn={setIsSignedIn} setIsSign={setIsSign}/>}
    </View>
  );
};


export default App;
