import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, Image } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import useStatusBar from '../hooks/useStatusBar';
import { logout, auth } from '../components/Firebase/firebase';
import { AuthUserContext } from '../navigation/AuthUserProvider';
import { db } from '../components/Firebase/firebase';

export default function DonationPoolScreen() {
  useStatusBar('dark-content');
  const [swiper, setSwiper] = useState(null)
  let currentUser =auth.currentUser;
  console.log('USERRRRR')
  console.log(currentUser.email)
  // const { userLogin, setUserLogin } = useState(AuthUserContext)
  let currentUserObj = null
  let accounts = []
  db.ref('users').on('value', (data) => {
    let users = data.val();
    let keys = Object.keys(users);
    for (let i = 0; i < keys.length; i++){
      let k = keys[i]
      let user = { 
        bloodType: users[k].bloodType,
        firstName: users[k].firstName,
        lastName: users[k].lastName,
        organ: users[k].organ,
        role: users[k].role,
        phoneNumber: users[k].phoneNumber,
        story: users[k].story,
        email: users[k].email,
        donorListRegNum: users[k].donorListRegNum,
        dob: users[k].dob,
      }
      if(user.role === 'recipient'){
        accounts.push(user)
      }
      if(user.email === currentUser.email)
        currentUserObj = user
    }
  })
  let pooledList = accounts.filter(e => {return e.organ === currentUserObj.organ})

  async function handleSignOut() {
    try {
      console.log()
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  let pool = null
  if(currentUserObj !== null && currentUserObj.role === 'orgiver'){
    pool = (
      <View style={styles.container}>
      

      <CardStack style={styles.content}
        renderNoMoreCards={() => <Text style={{fontWeight:'700', fontSize:18, color:'gray'}}>No more recipients :(</Text>}
        ref={swiper => {
          setSwiper(swiper)
        }}

        onSwiped={() => console.log('onSwiped')}
        onSwipedLeft={() => console.log('onSwipedLeft')}
      >
      {pooledList.map((e, i) => {
          return(
            <Card style={[styles.card, styles.card1]}>
              <Text style={styles.label}>{e.firstName+' '+e.lastName}</Text>
              <Text style={styles.story}>{'Looking for a ' +e.organ}</Text>
              <Text style={styles.story}>{'Born on ' + e.dob}</Text>
              <Text style={styles.story}>{e.story}</Text>
            </Card>
          )
        // }
      })}
    </CardStack>
    <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button,styles.red]} onPress={()=>{
            swiper.swipeLeft();
          }}>
            <Image source={require('../assets/red.png')} resizeMode={'contain'} style={{ height: 62, width: 62 }} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,styles.orange]} onPress={() => {
            swiper.goBackFromLeft();
          }}>
            <Image source={require('../assets/back.png')} resizeMode={'contain'} style={{ height: 32, width: 32, borderRadius: 5 }} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,styles.green]} onPress={()=>{
            swiper.swipeRight();
          }}>
            <Image source={require('../assets/green.png')} resizeMode={'contain'} style={{ height: 62, width: 62 }} />
          </TouchableOpacity>
        </View>
      </View>
      </View>
    )
  } else if (currentUserObj !== null && currentUserObj.role !== 'orgiver') {
    pool = ( 
      <View  styles={styles.container}>
        <Text>        An Orgiver will contact you if they wish to proceed </Text>
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
      {pool}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
  },
  content:{
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    width: 320,
    height: 470,
    backgroundColor: '#FE474C',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    lineHeight: 100,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  story: {
    // lineHeight: 100,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
    paddingBottom: 20
  },
  footer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonContainer:{
    width:220,
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  button:{
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    zIndex: 0,
  },
  orange:{
    width:55,
    height:55,
    borderWidth:6,
    borderColor:'rgb(246,190,66)',
    borderWidth:4,
    borderRadius:55,
    marginTop:-15
  },
  green:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#01df8a',
  },
  red:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#fd267d',
  }
});
