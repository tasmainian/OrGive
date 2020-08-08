import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Colors from '../utils/colors';

export default function AppButton({ title, onPress, color = 'pink' }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width:"80%",
    // backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
});
