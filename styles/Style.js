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
    paddingLeft: 20,
    paddingRight: 20
  },

  bottomNavigationİcons: {
    width: 30,
    height: 30,
  },

  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },

  t4: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
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
  button_left: {
    height: 42,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  picker_view: {
    width: '100%',
    height: 42,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  text_area: {
    width: '100%',
    paddingStart: 10,
    paddingEnd: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0,
    color: '#212121',
    textAlignVertical: 'top',
    elevation: 5,
    fontSize: 16,
  },
});

export default styles;