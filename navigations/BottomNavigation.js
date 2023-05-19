import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View, Image, Dimensions } from "react-native";
import AddNote from '../pages/AddNote';
import Map from "../pages/Map";
import Gardens from "../pages/Gardens";
import Profile from "../pages/Profile";
import Galleries from "../pages/Galleries";
import styles from "../styles/Style";
import CreateGarden from "../pages/CreateGarden"
import SelectPlant from "../pages/SelectPlant"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawPolygon from "../pages/DrawPolygon";
import Settings from "../pages/Settings";
import ViewGarden from "../pages/ViewGarden";
import Plants from "../pages/Plants";
import CreatePlant from "../pages/CreatePlant";
import AddPlantLocation from "../pages/AddPlantLocation";
import PlantNote from "../layouts/add_note/PlantNote";
import ViewPlant from "../pages/ViewPlant";
import EditPlant from "../pages/EditPlant";
import EditPlantLocation from "../pages/EditPlantLocation";
import EditGarden from "../pages/EditGarden";
import EditGardenPolygon from "../pages/EditGardenPolygon";


const { width, height } = Dimensions.get("window")
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const BottomNavigation = ({ setIsSigned }) => {

  return (

    <View style={{
      width,
      height,
    }}>

      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.bottomNavigation,
          headerShown: false,
          tabBarHideOnKeyboard: true,

        }}>

        <Tab.Screen
          name="AddNoteStack"
          component={AddNoteStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={focused ? require("../images/icons/focused_camera.png") : require("../images/icons/camera.png")}
                  resizeMode="contain"
                  style={styles.bottomNavigationİcons}

                >

                </Image>
              </View>
            ),
          }}>

        </Tab.Screen>

        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={focused ? require("../images/icons/focused_location.png") : require("../images/icons/location.png")}
                  resizeMode="contain"
                  style={styles.bottomNavigationİcons}

                >

                </Image>
              </View>
            ),
          }}>

        </Tab.Screen>


        <Tab.Screen
          name="GardensStack"
          component={GardensStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={focused ? require("../images/icons/focused_plant.png") : require("../images/icons/plant.png")}
                  resizeMode="contain"
                  style={styles.bottomNavigationİcons}

                >

                </Image>
              </View>
            ),
          }}>

        </Tab.Screen>

        <Tab.Screen
          name="Galleries"
          component={Galleries}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={focused ? require("../images/icons/focused_gallery.png") : require("../images/icons/gallery.png")}
                  resizeMode="contain"
                  style={styles.bottomNavigationİcons}

                >

                </Image>
              </View>
            ),
          }}>

        </Tab.Screen>

        <Tab.Screen
          name="SettingsStack"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={focused ? require("../images/icons/focused_settings.png") : require("../images/icons/settings.png")}
                  resizeMode="contain"
                  style={styles.bottomNavigationİcons}

                >

                </Image>
              </View>
            ),
          }}>
          {() => <SettingsStack setIsSigned={setIsSigned} />}

        </Tab.Screen>
      </Tab.Navigator>
    </View>


  )
}
const GardensStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name="Gardens"
        component={Gardens}
      />
      <Stack.Screen
        name="CreateGarden"
        component={CreateGarden} />

      <Stack.Screen
        name="ViewGarden"
        component={ViewGarden} />

      <Stack.Screen
        name="Plants"
        component={Plants} />

      <Stack.Screen
        name="CreatePlant"
        component={CreatePlant} />

      <Stack.Screen
        name="ViewPlant"
        component={ViewPlant} />

      <Stack.Screen
        name="DrawPolygon"
        component={DrawPolygon} />

      <Stack.Screen
        name="AddPlantLocation"
        component={AddPlantLocation} />
      <Stack.Screen
        name="EditPlant"
        component={EditPlant} />
      <Stack.Screen
        name="EditPlantLocation"
        component={EditPlantLocation} />
      <Stack.Screen
        name="EditGarden"
        component={EditGarden} />
      <Stack.Screen
        name="EditGardenPolygon"
        component={EditGardenPolygon} />
    </Stack.Navigator>
  )
}

const AddNoteStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AddNote" component={AddNote} />
      <Stack.Screen name="SelectPlant" component={SelectPlant} />
      <Stack.Screen name="PlantNote" component={PlantNote} />
    </Stack.Navigator>
  );
}

const SettingsStack = ({ setIsSigned }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Settings" component={Settings} initialParams={{ setIsSigned }} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}


export default BottomNavigation
