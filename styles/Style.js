import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  bottomNavigation: {
    position: 'absolute',
    height: 60,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 50,
    borderRadius: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 35,
    paddingRight: 35
  },

  bottomNavigationİcons: {
    width: 30,
    height: 30,
  },

  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF1DD',
    marginBottom: 20,
  },
  subtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF1DD',
  },

  t4: {
    fontSize: 17,
    color: 'white',
    marginBottom: 10,
    marginTop: 10
  },
  button: {
    width: 250,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#44A77A',
    fontWeight: 'bold',
  },
  button_right: {
    width: 150,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#44A77A',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  bt1: {
    color: 'white',
    textAlign: 'center',
  },
});

export default styles;