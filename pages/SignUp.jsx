import LinearGradient from "react-native-linear-gradient";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // oturum açan kullanıcının durumunu dinle
        auth().onAuthStateChanged((user) => {
          if (user) {
            console.log(user)
            const {uid, email} = user;
            const ref = firestore().collection('users').doc(uid)
            ref.set({
              "user_uid": uid,
              "email": email,

            })
            
          }

        
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (

    <LinearGradient
      colors={["#D1A96DE5", "#DB966FE5"]}
      style={{ height: "100%" }}
    >
      <View style={{
        alignItems: "center"
      }}>
        <Text>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
        <Text>Password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Enter your password"
        />
        <TouchableOpacity onPress={handleSignUp}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>

  )
}


export default SignUp

