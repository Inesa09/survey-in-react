import firebase from 'firebase'

// var config = {
//   apiKey: "AIzaSyAsmdS3u-q70bl-p823HbANg5T_urpufQM",
//   authDomain: "roadio-posts-review.firebaseapp.com",
//   databaseURL: "https://roadio-posts-review.firebaseio.com",
//   projectId: "roadio-posts-review",
//   storageBucket: "roadio-posts-review.appspot.com",
//   messagingSenderId: "525382261981"
// };

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