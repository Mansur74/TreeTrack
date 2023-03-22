/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './navigations/BottomNavigation';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Main from './pages/Main';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

const App = () => {
  const [isSignedIn, setIsSigned] = useState(false);
  const [isInMain, setIsInMain] = useState(true);
  const [isInSign, setIsInSignIn] = useState(false);

  useEffect(() => {
    const usersRef = firestore().collection('users');
    // oturum açan kullanıcının durumunu dinle
    firebase.auth().onAuthStateChanged(user => {
      console.log(
        'Checking if user is signed in before...' + JSON.stringify(user),
      );
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((firestoreDocument) => {
            const userData = firestoreDocument.data();
            console.log(
              'User already signed in.' + JSON.stringify(userData),
            );
            // remember me true ise oturum kendiliğinden açılır
            if(userData.remember_auth){
              setIsSigned(true);
            }
          })
          .catch(error => {
            console.log(error.toString());
          });
      }
    });
  }, []);

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