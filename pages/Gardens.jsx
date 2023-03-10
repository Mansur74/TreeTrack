import { View, Text, Image, ToastAndroid } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/Style";
import { TouchableOpacity } from "react-native";
import EmptyGardens from "../layouts/EmptyGardens";
import FilledGardens from "../layouts/FilledGardens";
import { useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore';

// get gardens
const getGardens = async () => {
  gList = []
  await firestore()
    .collection('gardens')
    .orderBy('created_at', 'desc')
    .get()
    .then(querySnapshot => {
      gList = querySnapshot.docs.map(doc => doc.data());
    })
    .catch(error => {
      console.error(error);
    });
  return gList
}

const Gardens = ({ navigation }) => {
  const [gardens, setGardens] = useState([])

  const updateGardens = async () => {
    const data = await getGardens();
    setGardens(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGardens();
      setGardens(data);
    };
    fetchData();
  }, []);

  return (
    gardens.length == 0
      ? <EmptyGardens navigation={navigation} />
      : <FilledGardens navigation={navigation} gardens={gardens} onAdd={updateGardens} onDelete={updateGardens}/>
  )
}

export default Gardens