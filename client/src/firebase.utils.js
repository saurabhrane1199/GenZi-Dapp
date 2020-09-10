import firebase from 'firebase'
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCcOIVLeXUIeBHQGU0Elc0OWtUaEWw4Ymc",
    authDomain: "genz-ea342.firebaseapp.com",
    databaseURL: "https://genz-ea342.firebaseio.com",
    projectId: "genz-ea342",
    storageBucket: "genz-ea342.appspot.com",
    messagingSenderId: "164270630422",
    appId: "1:164270630422:web:cffc33632650483889f737"
  };


firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'})

export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase