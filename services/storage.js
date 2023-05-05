import AsyncStorage from '@react-native-async-storage/async-storage';

// async storage'dan key ile değer alınır
export const getFromStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(`Error retrieving ${key}: ${error}`);
  }
};

// oturum açılırken user_uid ve hatırlama tercihi async storage'a kaydedilir
export const saveUserId = async (userId, remember_auth) => {
  try {
    await AsyncStorage.setItem('userId', userId.toString());
    await AsyncStorage.setItem('remember_auth', remember_auth.toString());
    console.log('User ID + remember auth saved successfully!');
  } catch (error) {
    console.log('Error saving user ID + remember auth: ', error);
  }
};

// oturum açılırken user_uid ve hatırlama tercihi async storage'a kaydedilir
export const removeUserId = async () => {
  try {
    await AsyncStorage.clear()
    console.log('User info cleared!');
  } catch (error) {
    console.log('Error clearing: ', error);
  }
};
