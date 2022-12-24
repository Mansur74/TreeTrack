import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View, Image } from "react-native";
import Camera from "../pages/Camera";
import Map from "../pages/Map";
import Gardens from "../pages/Gardens";
import Profile from "../pages/Profile";
import Galleries from "../pages/Galleries";
import styles from "../styles/Style";
import CreateGarden from "../pages/CreateGarden"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: styles.bottomNavigation,
                headerShown: false

            }}

        >
            <Tab.Screen
                name="Camera"
                component={Camera}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image
                                source={require("../images/icons/camera.png")}
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
                                source={require("../images/icons/location.png")}
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
                                source={require("../images/icons/plant.png")}
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
                                source={require("../images/icons/image.png")}
                                resizeMode="contain"
                                style={styles.bottomNavigationİcons}

                            >

                            </Image>
                        </View>
                    ),
                }}>

            </Tab.Screen>

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image
                                source={require("../images/icons/user.png")}
                                resizeMode="contain"
                                style={styles.bottomNavigationİcons}

                            >

                            </Image>
                        </View>
                    ),
                }}>

            </Tab.Screen>
        </Tab.Navigator>


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
        </Stack.Navigator>
    )
}



export default BottomNavigation


