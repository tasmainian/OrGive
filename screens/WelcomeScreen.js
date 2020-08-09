import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import AppButton from '../components/AppButton';
import Colors from '../utils/colors';
import useStatusBar from '../hooks/useStatusBar';
import * as Yup from 'yup';
import { loginWithEmail, recordLogin, getUsers, db } from '../components/Firebase/firebase';
import FormErrorMessage from '../components/Forms/FormErrorMessage';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .email()
    .label('Email'),
  password: Yup.string()
    .required()
    .min(6, 'Password must have at least 6 characters')
    .label('Password')
});

const customFonts = {
  'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
};

const WelcomeScreen = ({ navigation }) => {
  useStatusBar('light-content');
  // useFonts(customFonts);
  const [fontsLoaded] = useFonts(customFonts)
  

  // if (!fontsLoaded) {
  //   return null;
  // } 

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [loginError, setLoginError] = useState('');

  function handlePasswordVisibility() {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  }

  async function handleOnLogin(values) {
    const { email, password } = values;

    try {
      // let values = {
      //   user: 'Tas',
      //   sadness: 'high'
      //   // time: new Date?
      // }
      // await db.ref('users/test2').set(values).then(() => {
      //   console.log('INSERTED')
      // })

      // await db.ref('users').once('value', (data) => {
      //   console.log(data.toJSON())
      // })
      await loginWithEmail(email, password);
      console.log('test')
    } catch (error) {
      setLoginError(error.message);
    }
  }
  return (
    <View style={styles.container}>
      {fontsLoaded && <Text style={styles.title}>OrGive</Text>}
      <Image source={require('../assets/orgiveLogo.png')} style={styles.logo} />
      <View style={styles.logoContainer}>
      </View>
        <Form
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={values => handleOnLogin(values)}
        >
          <FormField
            name="email"
            leftIcon="email"
            placeholder="Enter email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
          />
          <FormField
            name="password"
            leftIcon="lock"
            placeholder="Enter password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={passwordVisibility}
            textContentType="password"
            rightIcon={rightIcon}
            handlePasswordVisibility={handlePasswordVisibility}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity> */}
          <FormButton title={'Login'} />
          {<FormErrorMessage error={loginError} visible={true} />}
        </Form>
        <TouchableOpacity style={{paddingBottom: 10}} onPress={() => navigation.navigate('Disclaimer')}>
          <Text style={styles.loginText}>Register</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center'
  },
  logo: {
    width: 125,
    height: 125
  },
  container: {
    padding: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.green,
  },
  title:{
    fontWeight:"bold",
    fontSize:50,
    color: Colors.white,
    marginBottom:-30,
    fontFamily: 'Pacifico'
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center'
  },
  logo: {
    width: 125,
    height: 125
  },
  loginText:{
    color: Colors.white
  }
});

export default WelcomeScreen