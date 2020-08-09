import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Button, View, ScrollView, TextInput, Picker, Linking, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';
import { Text, Header } from 'react-native-elements';
import Colors from '../utils/colors';
import SafeView from '../components/SafeView';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import IconButton from '../components/IconButton';
import FormErrorMessage from '../components/Forms/FormErrorMessage';
import { registerWithEmail, storage, db } from '../components/Firebase/firebase';
import useStatusBar from '../hooks/useStatusBar';
import colors from '../utils/colors';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Random from 'expo-random';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required()
    .label('First Name'),
  lastName: Yup.string()
    .required()
    .label('Last Name'),
  dob: Yup.string()
    // .test(
    //   "DOB",
    //   "error message",
    //   value => {
    //     return moment().diff(moment(value),'years') >= 18;
    //   }
    // )
    .required()
    .label('Date of Birth'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .label('PhoneNumber')
    .required('Please enter a valid Phone Number'),
  email: Yup.string()
    .required('Please enter a valid email')
    .email()
    .label('Email'),
  password: Yup.string()
    .required()
    .min(6, 'Password must have at least 6 characters')
    .label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match Password')
    .required('Confirm Password is required'),
  bloodType: Yup.string()
  .required()
  .min(2, 'Blood type must have at least 2 characters')
  .label('BloodType'),
  donorListRegNum: Yup.string()
  .required()
  .label('DonorListRegistrationNumber')
});
const RegisterScreen = ({ navigation }) => {
  useStatusBar('dark-content');

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('eye');
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    true
  )
  const [date, setDate] = useState(new Date(1598051730000));
  const [dateString, setDateString] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [registerError, setRegisterError] = useState('')
  const [role, setRole] = useState('orgiver');
  const [organ, setOrgan] = useState('kidney');
  const [story, setStory] = useState('')
  const [image, setImage] = useState(null)


  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri)
        uploadImage(result.uri)
      }
    } catch (E) {
      console.log(E);
    }
  }

  const uploadImage = async(uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = storage.ref().child(new Date().toString());
    return ref.put(blob);
  }

  useEffect (() => {
    getPermissionAsync()
  })

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    if(show)
      setDateString(date.toISOString().substr(0,10));
  }

  const showMode = (currentMode) => {
    setShow(!show);
    setMode(currentMode);
  }

  const showDatepicker = () => {
    showMode('date');
  }

  function handlePasswordVisibility() {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  }

  function handleConfirmPasswordVisibility() {
    if (confirmPasswordIcon === 'eye') {
      setConfirmPasswordIcon('eye-off');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === 'eye-off') {
      setConfirmPasswordIcon('eye');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  }

  async function handleOnSignUp(values, actions) {
    // console.log('values')
    let topPicks = ''
    console.log(values)
    if(role === 'orgiver')
      values = { ...values, role, organ, dob: dateString, topPicks}
    else
      values = {...values, role, organ, story, dob: dateString}
    console.log(values)
    const { email, password } = values;
    const uuid = await Random.getRandomBytesAsync(16);
    await db.ref('users/'+uuid).set(values)

    try {
      await registerWithEmail(email, password);
    } catch (error) {
      setRegisterError(error.message);
    }
  }

  const donorForm = (
    <View>
      <Text style={styles.donate}>I want to donate my:</Text>
      <Picker
        selectedValue={organ}
        onValueChange={(itemValue, itemIndex) => setOrgan(itemValue)}
      >
        <Picker.Item value="kidney" label="Kidney" />
        <Picker.Item value="liver" label="Liver" />
        <Picker.Item value="lung" label="Lung" />
        <Picker.Item value="boneMarrow" label="Bone Marrow / Stem Cells" />
        <Picker.Item value="blood" label="Blood" />
      </Picker>
      {/* <TouchableOpacity onPress={() => Linking.openURL('')}>
            <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}></Text>
          </TouchableOpacity> */}
      {organ === 'kidney' && 
      <View>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.uhn.ca/Transplant/Kidney_Transplant_Program')}>
            <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Kidney Transplant Program at UHN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.blood.ca/en/organs-tissues/living-donation/what-is-living-kidney-donation')}>
            <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>What is living kidney donation?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.giftoflife.on.ca/en/transplant.htm')}>
            <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Ontario's Organ and Tissue Donation Agency: Transplants</Text>
          </TouchableOpacity>
      </View>
      }
      {organ === 'liver' && 
      <View>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.uhn.ca/Transplant/Liver_Transplant_Program')}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Liver Transplant Program at UHN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.giftoflife.on.ca/en/transplant.htm')}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Ontario's Organ and Tissue Donation Agency: Transplants</Text>
        </TouchableOpacity>
      </View>
      }
      {organ === 'lung' && 
        <TouchableOpacity onPress={() => Linking.openURL('https://www.uhn.ca/Transplant/Lung_Transplant_Program/Documents/Living_Donor_Lung_Transplant_Manual.pdf')}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Lung Transplant Program Manual from UHN</Text>
        </TouchableOpacity> 
      }
      {organ === 'boneMarrow' && 
        <TouchableOpacity onPress={() => Linking.openURL('https://www.blood.ca/en/stemcells/donating-stemcells')}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Canadian Blood Services</Text>
        </TouchableOpacity> 
      }
      {organ === 'blood' && 
        <TouchableOpacity onPress={() => Linking.openURL('https://www.blood.ca/en/stemcells/donating-stemcells')}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Canadian Blood Services</Text>
        </TouchableOpacity> 
      }
    </View>
  )

  const recipientForm = (
    <View>
      <FormField
        name="donorListRegNum"
        leftIcon="folder-pound"
        placeholder="Enter Donor List Registration Number"
        autoFocus={true}
      />
      <Text style={styles.donate}>I am looking for a:</Text>
      <Picker
        selectedValue={organ}
        onValueChange={(itemValue, itemIndex) => setOrgan(itemValue)}
      >
        <Picker.Item value="kidney" label="Kidney" />
        <Picker.Item value="liver" label="Liver" />
        <Picker.Item value="lung" label="Lung" />
        <Picker.Item value="boneMarrow" label="Bone Marrow / Stem Cells" />
        <Picker.Item value="blood" label="Blood" />
      </Picker>
      <Text style={styles.donate}>Enter your Story (500 Characters)</Text>
      <View style={styles.multiLineInput}>
        <TextInput
          editable
          maxLength={500}
          multiline
          numberOfLines={4}
          onChangeText={text => setStory(text)}
          value={story}
        />
      </View>
    </View>
  )

  return (
    <SafeView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Upload Profile Picture" onPress={_pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
      <Form
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',

        }}
        // validationSchema={validationSchema}
        onSubmit={values => handleOnSignUp(values)}
      >
        <FormField
          name="firstName"
          leftIcon="account"
          placeholder="Enter first name"
          autoFocus={true}
        />
        <FormField
          name="lastName"
          leftIcon="account"
          placeholder="Enter last name"
        />
        <FormField
          name="dob"
          value={dateString}
          onChange={showDatepicker} title="Show date picker!"
          leftIcon="calendar"
          placeholder="Enter Date of Birth"
        />
        <View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <FormField
          name="phoneNumber"
          leftIcon="phone"
          placeholder="Enter Phone Number"
        />
        <FormField
          name="email"
          leftIcon="email"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
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
        <FormField
          name="confirmPassword"
          leftIcon="lock"
          placeholder="Confirm password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={confirmPasswordVisibility}
          textContentType="password"
          rightIcon={confirmPasswordIcon}
          handlePasswordVisibility={handleConfirmPasswordVisibility}
        />
        <FormField
          name="bloodType"
          leftIcon="blood-bag"
          placeholder="Enter Blood Type"
        />
        <TouchableOpacity onPress={() => Linking.openURL('https://www.blood.ca/en/blood/donating-blood/whats-my-blood-type')}>
          <Text style={{color: Colors.blue, paddingBottom: 30, textAlign: 'center'}}>Find your blood type with Canadian Blood Services</Text>
        </TouchableOpacity>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
        >
          <Picker.Item value="orgiver" label="I want to donate as a living donor" />
          <Picker.Item value="recipient" label="I need an organ" />
        </Picker>
        {role == 'orgiver' && donorForm}
        {role == 'recipient' && recipientForm}
        <View style={{justifyContent:'center', alignItems: 'center'}}>
          <FormButton style={styles.button} title={'Register'} />
        </View>
        {<FormErrorMessage error={registerError} visible={true} />}
        </Form>
        <IconButton
          style={styles.backButton}
          iconName="keyboard-backspace"
          color={Colors.secondary}
          size={30}
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.white
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  donate: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20
  }, 
  multiLineInput: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.black,
    borderWidth: 1,
  }
});

export default RegisterScreen