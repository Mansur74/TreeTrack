import LinearGradient from "react-native-linear-gradient";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import CheckBox from "@react-native-community/checkbox";
import { saveUserId } from "../services/storage";


const SignIn = ({ setIsInSignIn, setIsSigned }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleLogin = () => {
    if (email != '' && password != '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          const uid = response.user.uid;
          const usersRef = firestore().collection('users').doc(uid);
          usersRef
            .get()
            .then(async firestoreDocument => {
              if (!firestoreDocument.exists) {
                ToastAndroid.show('User does not exist!', ToastAndroid.SHORT);
              }
              setIsSigned(true);
              await saveUserId(uid, toggleCheckBox);
              ToastAndroid.show(
                'User signed in succesfully.',
                ToastAndroid.SHORT,
              );
            })
            .catch(error => {
              console.error(error);
              ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
            });
        })
        .catch(error => {
          console.log(error);
          ToastAndroid.show(error.message.split('] ')[1], ToastAndroid.SHORT);
        });
    } else if (email == '' || password == '') {
      ToastAndroid.show(
        'Email and password cannot be empty!',
        ToastAndroid.SHORT,
      );
    } else {
      ToastAndroid.show(
        'Please, read and confirm the terms and conditions!',
        ToastAndroid.SHORT,
      );
    }
  };

  const handleSignUp = () => {
    setIsInSignIn(false)
  }

  return (

    <View
      style={{
        paddingTop: '8%',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '5%',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#efefef',
      }}>
      <Image
        resizeMode="contain"
        style={{
          width: '75%',
        }}
        source={require('../images/tree_track.png')}>

        </Image>

      <LinearGradient
        colors={['#BAE9D1', '#36861C']}
        style={{
          width: '100%',
          marginTop: 40,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 50,
          padding: 20,
          paddingBottom: '20%'


        }}>
        
        <View>

          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              marginBottom: 10,
            }}>
            welcome :)
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            placeholderTextColor={'#21212160'}
            style={{
              backgroundColor: 'white',
              borderRadius: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
              elevation: 10,
              color: 'black'
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={'#21212160'}
            secureTextEntry={true}
            style={{
              backgroundColor: 'white',
              borderRadius: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
              elevation: 10,
              color: 'black',
            }}
          />

          <Text
            style={{
              color: 'white',
              textDecorationLine: 'underline',
              marginTop: 10,
              marginLeft: 10,
            }}>
            Forgot password?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}>

            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
              tintColors={{true: 'white'}}

            />
            <Text
              style={{
                color: 'white',
              }}>
              Remember me
            </Text>


          </View>


        </View>


        
      </LinearGradient>

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          justifyContent: 'center',
          backgroundColor: '#36861C',
          borderRadius: 50,
          marginTop: 15,
          marginLeft: 50,
          marginRight: 50,
          height: 50,
          width: '75%',
          elevation: 5,
        }}>
        <Text style={{color: '#fff', fontSize: 16, textAlign: 'center'}}>
          SIGN IN
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <Text style={{color: 'black'}}>Don't you have an account?</Text>

        <Text
          onPress={handleSignUp}
          style={{
            textDecorationLine: 'underline',
            fontWeight: 'bold',
            color: '#36861C',
          }}>
          {'\t'}Sign up
        </Text>
      </View>
    </View>
  );
}


export default SignIn

