import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import AppButton from '../components/AppButton';
import Colors from '../utils/colors';
import useStatusBar from '../hooks/useStatusBar';
import * as Yup from 'yup';
import { loginWithEmail } from '../components/Firebase/firebase';
import FormErrorMessage from '../components/Forms/FormErrorMessage';

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


const WelcomeScreen = ({ navigation }) => {
  useStatusBar('light-content');
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
      await loginWithEmail(email, password);
    } catch (error) {
      setLoginError(error.message);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OrGive</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.loginText}>Register</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom:40
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