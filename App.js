/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './navigations/BottomNavigation';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Main from './pages/Main';

const App = () => {
  const [isSignedIn, setIsSigned] = useState(false);
  const [isInMain, setIsInMain] = useState(true);
  const [isInSign, setIsInSignIn] = useState(false);

  const handle = ()  => 
  {
    if(isSignedIn)
    {
      return (
        <NavigationContainer>
          <BottomNavigation setIsSigned={setIsSigned}/>
        </NavigationContainer>
        )
    }

    else if(isInMain)
      return <Main setIsInMain={setIsInMain} setIsInSignIn={setIsInSignIn}></Main>

    else if(isInSign)
       return <SignIn setIsSigned={setIsSigned} setIsInSignIn={setIsInSignIn}/>

    else
      return <SignUp setIsSigned={setIsSigned} setIsInSignIn={setIsInSignIn}/>
     
  }

  const render = handle();

  return (
    <View>
      {
        render
      }
    </View>
  );
};


export default App;
/*
{isSignedIn ? (
        <NavigationContainer>
          <BottomNavigation setIsSignedIn={setIsSignedIn}/>
        </NavigationContainer>
      ) : isSign ? (
        <SignIn setIsSignedIn={setIsSignedIn} setIsSign={setIsSign}/>
      ) : <SignUp setIsSignedIn={setIsSignedIn} setIsSign={setIsSign}/>}
*/