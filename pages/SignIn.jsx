import LinearGradient from "react-native-linear-gradient";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import CheckBox from "@react-native-community/checkbox";

const SignIn = ({ setIsInSignIn, setIsSigned }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleLogin = () => {
    if (email != '' && password != '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setIsSigned(true)
          console.log('User signed in!');
          ToastAndroid.show('User signed in succesfully.', ToastAndroid.SHORT);
        })
        .catch(error => {
          console.error(error);
          ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
        });
    }
    else if (email == '' || password == '') {
      ToastAndroid.show('Email and password can not be empty!', ToastAndroid.SHORT);
    }

    else {
      ToastAndroid.show('Please, read and confirm the terms and conditions!', ToastAndroid.SHORT);
    }
  };

  const handleSignUp = () => {
    setIsInSignIn(false)
  }

  return (

    <View
      style={{
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        alignItems: "center"
      }}>

      <Image
        resizeMode="contain"
        style={{
          width: "75%"
        }}
        source={require("../images/tree_track.png")}>

      </Image>

      <LinearGradient
        colors={["#BAE9D1", "#36861C"]}
        style={{
          width: "100%",
          marginTop: 40,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 50,
          padding: 20,
          paddingBottom: 150

        }}
      >

        <View>

          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 20,
              marginTop: 30,
              marginBottom: 10
            }}>
            welcome :)
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
              elevation: 10
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
              elevation: 10
            }}
          />

          <Text
            style={{
              color: "white",
              textDecorationLine: "underline",
              marginTop: 10,
              marginLeft: 10
            }}>
            Forgot password?
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              alignItems: "center"
            }}>

            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
              tintColors={{ true: "white" }}

            />
            <Text
              style={{
                color: "white",
              }}>
              Remember me
            </Text>


          </View>


        </View>



      </LinearGradient>

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          justifyContent: "center",
          backgroundColor: '#36861C',
          borderRadius: 50,
          marginTop: 15,
          marginLeft: 50,
          marginRight: 50,
          height: 50,
          width: "75%",
          elevation: 5
        }}>
        <Text style={{ color: '#fff', fontSize: 16, textAlign: "center" }}>SIGN IN</Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          marginTop: 20
        }}>
        <Text>
          Don't you have an account?
        </Text>

        <Text
          onPress={handleSignUp}
          style={{
            textDecorationLine: "underline",
            fontWeight: "bold"
          }}>
          {'\t'}Sign up
        </Text>
      </View>

    </View>

  )
}


export default SignIn

