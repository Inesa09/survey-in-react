import React from 'react';


var firebase = require('firebase');
var firebaseui = require('firebaseui');



const Register = () => {
    let ui = new firebaseui.auth.AuthUI(firebase.auth());

    ui.start('#firebaseui-auth-container', {
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
          }
        ]
      });    

    return 0;
}

export default Register;