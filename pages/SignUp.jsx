import LinearGradient from "react-native-linear-gradient";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import CheckBox from "@react-native-community/checkbox";

const SignUp = ({ setIsSign, setIsSignedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);


  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // oturum açan kullanıcının durumunu dinle
        auth().onAuthStateChanged((user) => {
          if (user) {
            console.log(user)
            const { uid, email } = user;
            const ref = firestore().collection('users').doc(uid)
            ref.set({
              "user_uid": uid,
              "name": name,
              "email": email,

            })

          }

        });
        console.log('User signed in!');
        setIsSignedIn(true);

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignIn = () => {
    setIsSign(true)
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
            value={name}
            onChangeText={setName}
            placeholder="Name"
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

          <TextInput
            placeholder="Confirm password"
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 10,
              elevation: 10
            }}
          />
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
              I accept the
            </Text>

            <Text
              style={{
                color: "white",
                textDecorationLine: "underline"
              }}>
              {'\t'}terms and conditions
            </Text>
          </View>


        </View>

      </LinearGradient>

      <TouchableOpacity
        onPress={handleSignUp}
        style={{
          backgroundColor: '#36861C',
          padding: 20,
          borderRadius: 50,
          marginTop: 15,
          marginLeft: 50,
          marginRight: 50,
          width: "75%",
          elevation: 5
        }}>
        <Text style={{ color: '#fff', fontSize: 16, alignSelf: "center" }}>SIGN UP</Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          marginTop: 20
        }}>
        <Text>
          Already have an account?
        </Text>

        <Text
          onPress={handleSignIn}
          style={{
            textDecorationLine: "underline",
            fontWeight: "bold"
          }}>
          {'\t'}Login
        </Text>
      </View>

    </View>

  )
}


export default SignUp

