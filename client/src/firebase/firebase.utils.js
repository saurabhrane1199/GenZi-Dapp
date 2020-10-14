import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCcOIVLeXUIeBHQGU0Elc0OWtUaEWw4Ymc",
    authDomain: "genz-ea342.firebaseapp.com",
    databaseURL: "https://genz-ea342.firebaseio.com",
    projectId: "genz-ea342",
    storageBucket: "genz-ea342.appspot.com",
    messagingSenderId: "164270630422",
    appId: "1:164270630422:web:cffc33632650483889f737"
  };

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return;
  
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();
    if(!snapShot.exists){
      const {displayName, email} = userAuth;
      const createdAt = new Date();
      
      try {
       await userRef.set({
         displayName,
         email,
         createdAt,
         ...additionalData,
       }) 
      } catch (error) {
        console.log('error creating user', error.message)
      }
  
    }
    return userRef
  }; 


firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'})

export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase