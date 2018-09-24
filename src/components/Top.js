import React from 'react';
import '../css/Top.css';
import UserName from './UserName';

const Top = (props) => {
    return (
        <div className="App" id='top'>
          <header className="App-header">
            <h1 className="App-title">Survey</h1>
            <UserName user= {props.user} hidden={props.user === '' ? 'hidden' : ''} signOut={props.signOut}/>
          </header>
          <div className="App-content">
            {props.children}
          </div>
        </div>
    )
}

export default Top;