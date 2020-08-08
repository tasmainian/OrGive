import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Text } from 'react-native-elements';
import Colors from '../utils/colors'
import useStatusBar from '../hooks/useStatusBar';

export default function DisclaimerScreen( {navigation} ) {
  useStatusBar('dark-content');
  const handleOpenWithLinking = () => {
    Linking.openURL('https://myhealth.alberta.ca/Health/pages/conditions.aspx?hwid=abl0501&lang=en-ca#abl0502');
  }

  return (
    <View style={styles.container}>
        <Text h4 style={{paddingBottom: 30}}>Terms and Conditions</Text>
        <Text style={styles.disclaimer}>    OrGive is a service intended to connect individuals who want to be living organ donors to those in need of an organ. This service does not guarantee the completion of a successful donation. </Text>
        <Text style={styles.disclaimer}>    Suitability to donate will be determined by an evaluation by medical professionals to ensure no adverse physical, psychological, and emotional outcomes will occur before, during, or following the donation.</Text>

        <Text style={{fontWeight: 'bold'}}>To learn more, visit:</Text>
        <TouchableOpacity onPress={() => handleOpenWithLinking()}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Living Organ Donation by Alberta Health Services</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>I understand this information and wish to proceed with usage of this application:</Text>

        <TouchableOpacity style={styles.agreeBtn} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.btnText}>Agree</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.btnText2}>Decline</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agreeBtn:{
    width:"80%",
    backgroundColor: Colors.lightGreen,
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  btnText:{
    color: Colors.white
  },
  btnText2:{
    color: Colors.black
  },
  disclaimer:{
      paddingBottom: 20,
      fontWeight: 'bold'
  }
});
