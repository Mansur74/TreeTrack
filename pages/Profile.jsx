import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { removeUserId } from "../services/storage";

const Profile = ({route}) => {
  
  const { setIsSigned } = route.params;
  const currentUser = auth().currentUser;
  const[userName, setUserName] = useState("Name");

  useEffect(() => {
    const ref = firestore().collection('users').doc(currentUser.uid)
      ref.onSnapshot(documentSnapshot => {
        setUserName(documentSnapshot.data().name);
        console.log('User data: ', documentSnapshot.data());
      });
  }, []);

  const handleSignOut = () => {
    auth()
    .signOut()
    .then(async() => {
      setIsSigned(false)
      await removeUserId();
      console.log('User signed out!')
    });
  }




  return (

    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF"]}
      style={{ height: "100%" }}
    >
      <View style={{ flex: 1 }}>

        <View style={{
          padding: 20,
          flex: 1,
        }}>
          <Text style={{ fontSize: 30, color: "white", fontWeight: "bold", color: "#09A555" }}>
            profile
          </Text>

        </View>

        <View
          style={{
            backgroundColor: 'grey',
            height: 100,
            width: 100,
            alignSelf: "flex-end",
            borderRadius: 100,
            borderColor: '#FFFFFF',
            borderWidth: 7,
            position: 'absolute',
            top: 40,
            right: 25,
            zIndex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={require("../images/profile.png")}>

          </Image>
        </View>
        <View style={{
          padding: 20,
          flex: 17,
          backgroundColor: "#89C6A7",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50
        }}>

          <Text style={{ color: "white", fontSize: 20, paddingLeft: 20, marginTop: 75 }}>Gardener Information</Text>
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 10
            }}>
            <Text style={{color: "black"}}>{userName}</Text>
            <View style={{ height: 1, backgroundColor: "gray", marginTop: 5, marginBottom: 5 }}></View>
            <Text style={{color: "black"}}>Last Name</Text>
            <View style={{ height: 1, backgroundColor: "gray", marginTop: 5, marginBottom: 5 }}></View>
            <Text style={{color: "black"}}>Bio</Text>
            <View style={{ height: 1, backgroundColor: "gray", marginTop: 5, marginBottom: 5 }}></View>
            <Text style={{color: "black"}}>Home Garden</Text>

          </View>


          <Text style={{ color: "white", fontSize: 20, paddingLeft: 20, marginTop: 20 }}>Social</Text>
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 10
            }}>
            <Text style={{color: "black"}}>Share Sprout Profile</Text>
            <View style={{ height: 1, backgroundColor: "gray", marginTop: 5, marginBottom: 5 }}></View>
            <Text style={{color: "black"}}>Connect Instagram</Text>
            <View style={{ height: 1, backgroundColor: "gray", marginTop: 5, marginBottom: 5 }}></View>
            <Text style={{color: "black"}}>Connect Twitter</Text>
            <View style={{ height: 1, backgroundColor: "gray", marginTop: 5, marginBottom: 5 }}></View>
            <Text style={{color: "black"}}>Connect Pinterest</Text>

          </View>

          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              height: 50,
              backgroundColor: 'white',
              borderRadius: 50,
              marginTop: 15,
              width: "100%",
              elevation: 5,
              justifyContent: "center"
            }}>
            <Text style={{ fontSize: 16, textAlign: "center", color: "black", fontWeight: "bold" }}>LOG OUT</Text>
          </TouchableOpacity>

        </View>

      </View>

    </LinearGradient>

  )
}

export default Profile
