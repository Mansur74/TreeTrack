import LinearGradient from "react-native-linear-gradient";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';


const Main = ({setIsInMain, setIsInSignIn}) => {

  const handleIsSignUp = () => {
    setIsInMain(false)
    setIsInSignIn(false)
  }

  const handleIsSignIn = () => {
    setIsInMain(false)
    setIsInSignIn(true)
  }


  return (

    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      style={{ height: "100%" }}
    >
      <View style={{ flex: 1 }}>

        <View style={{
          padding: 20,
          paddingTop: 100,
          flex: 10,
          alignItems: "center"
        }}>
          <Image
            resizeMode="contain"
            style={{
              width: "100%"
            }}
            source={require("../images/tree_track.png")}>

          </Image>

          <Image
            resizeMode="contain"
            style={{
              width: "75%",
              marginTop: 50
            }}
            source={require("../images/human.png")}>

          </Image>

        </View>
        <View style={{

          flex: 5,
        }}>
          <LinearGradient
            colors={["#BAE9D1", "#36861C"]}
            style={{
              height: "100%",
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              alignItems: "center"
            }}
          >

            <TouchableOpacity
              onPress={handleIsSignUp}
              style={{
                justifyContent: "center",
                backgroundColor: 'white',
                borderRadius: 50,
                marginTop: 50,
                marginLeft: 50,
                marginRight: 50,
                height: 50,
                width: "75%",
                elevation: 5
              }}>
              <Text style={{ fontSize: 16, textAlign: "center", fontWeight: "bold", color: "#36861C" }}>SIGN UP</Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "white",
                marginTop: 10,
                marginLeft: 10
              }}>
              Already have an account?
            </Text>

            <Text
              onPress={handleIsSignIn}
              style={{
                color: "white",
                textDecorationLine: "underline",
                marginLeft: 10
              }}>
              Sign in
            </Text>

          </LinearGradient>

        </View>

      </View>

    </LinearGradient>

  )
}


export default Main

/**<View
            style={{
                paddingTop: 40,

                alignItems: "center"
            }}>

            <Image
                resizeMode="contain"
                style={{
                    width: "75%"
                }}
                source={require("../images/tree_track.png")}>

            </Image>

            <Image
                resizeMode="contain"
                style={{
                    width: "75%"
                }}
                source={require("../images/human.png")}>

            </Image>

            <LinearGradient
                colors={["#BAE9D1", "#36861C"]}
                style={{
                    width: "100%",
                    height: "100%",
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    padding: 20,
                    paddingBottom: 150

                }}
            >

                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        backgroundColor: 'white',
                        borderRadius: 50,
                        marginTop: 15,
                        marginLeft: 50,
                        marginRight: 50,
                        height: 50,
                        width: "75%",
                        elevation: 5
                    }}>
                    <Text style={{ fontSize: 16, textAlign: "center" }}>SIGN UP</Text>
                </TouchableOpacity>

            </LinearGradient>



        </View>/ */