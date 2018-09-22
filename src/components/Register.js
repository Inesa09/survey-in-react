import React from 'react';


var firebase = require('firebase');
var firebaseui = require('firebaseui');



const Register = () => {
    firebaseui.start('#firebaseui-auth-container', {
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