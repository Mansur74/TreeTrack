import LinearGradient from "react-native-linear-gradient";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import CheckBox from "@react-native-community/checkbox";
import { saveUserId } from "../services/storage";

const SignUp = ({ setIsInSignIn, setIsSigned }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [rememberToggleCheckBox, setRememberToggleCheckBox] = useState(false);


  const handleSignUp = () => {
    if (toggleCheckBox && email != '' && name != '' && password != '') {
      if (password !== confirmPassword) {
        ToastAndroid.show('Passwords do not match!', ToastAndroid.SHORT);
        return;
      }
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (response) => {
          const { uid, email } = response.user;
          const ref = firestore().collection('users').doc(uid)
          ref.set({
            "user_uid": uid,
            "name": name,
            "email": email,
            "remember_auth": rememberToggleCheckBox
          })
          setIsSigned(true);
          await saveUserId(uid, toggleCheckBox);
          console.log('User signed up!');
          ToastAndroid.show('User signed up!', ToastAndroid.SHORT);

          })
        .catch((error) => {
          console.log(error);
          ToastAndroid.show(error.message.split('] ')[1], ToastAndroid.SHORT);
        });
    }

    else if (email == '' || password == '' || name == '') {
      ToastAndroid.show('Please fill the form correctly!', ToastAndroid.SHORT);
    }

    else {
      ToastAndroid.show('Please, read and confirm the terms and conditions!', ToastAndroid.SHORT);
    }

  };

  const handleSignIn = () => {
    setIsInSignIn(true)
  }

  return (
    <View
      style={{
        padding: '5%',
        alignItems: 'center',
        backgroundColor: '#efefef',
        height: '100%',
      }}>
      <Image
        resizeMode="contain"
        style={{
          marginVertical: 10,
          marginHorizontal: '5%',
          alignItems: 'center',
          width: '75%',
        }}
        source={require('../images/tree_track.png')}></Image>

      <LinearGradient
        colors={['#BAE9D1', '#36861C']}
        style={{
          width: '100%',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 50,
          paddingHorizontal: 20,
          paddingTop: '5%',
          paddingBottom: '10%',
        }}>
        <View>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              marginBottom: '5%',
            }}>
            welcome :)
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={'#21212160'}
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
              color: 'black',
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

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
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
              I accept the
            </Text>

            <Text
              style={{
                color: 'white',
                textDecorationLine: 'underline',
              }}>
              {'\t'}terms and conditions
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              disabled={false}
              value={rememberToggleCheckBox}
              onValueChange={newValue => setRememberToggleCheckBox(newValue)}
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
        onPress={handleSignUp}
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
          SIGN UP
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <Text style={{color: 'black'}}>Already have an account?</Text>

        <Text
          onPress={handleSignIn}
          style={{
            textDecorationLine: 'underline',
            fontWeight: 'bold',
            color: '#36861C',
          }}>
          {'\t'}Sign in
        </Text>
      </View>
    </View>
  );
}


export default SignUp

