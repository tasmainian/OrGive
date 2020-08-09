import * as firebase from 'firebase';
import 'firebase/auth';

import firebaseConfig from './firebaseConfig';

// Initialize Firebase App

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.database();

export const loginWithEmail = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

export const registerWithEmail = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

export const logout = () => auth.signOut();

export const passwordReset = email => auth.sendPasswordResetEmail(email);

// export const recordLogin = email => () => firebase.database().ref('users/'+email).set({
//   user: 'Tas',
//   sadness: 'high'
//   // time: new Date?
// }).then(() => {
//   console.log('INSERTED')
// })

// export const getUsers = () => firebase.database().ref('users').once('value', (data) => {
//   console.log(data.toJSON())
// })
