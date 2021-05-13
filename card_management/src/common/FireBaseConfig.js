import * as firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDoJMg3yjClA65cpL_2WQNEppoiaWdqckc',
  authDomain: 'thueoto-4ddc1.firebaseapp.com',
  projectId: 'thueoto-4ddc1',
  storageBucket: 'thueoto-4ddc1.appspot.com',
  messagingSenderId: '896164622054',
  appId: '1:896164622054:web:10af8b903db7b9ff229527',
  measurementId: 'G-7RTT9MD0KQ',
};

export const FireBaseApp = firebase.initializeApp(firebaseConfig);
