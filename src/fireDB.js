import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBq9NBrnLFLkjUXlVNWMzV55XYGDLjY3JE",
    authDomain: "survey-in-react.firebaseapp.com",
    databaseURL: "https://survey-in-react.firebaseio.com",
    projectId: "survey-in-react",
    storageBucket: "survey-in-react.appspot.com",
    messagingSenderId: "62317409113"
  };
var fireDB = firebase.initializeApp(config);

export default fireDB;