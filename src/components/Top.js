import React from 'react';
import '../css/Top.css';

const Top = (props) => {
    return (
        <div className="App" id='top'>
          <header className="App-header">
            <h1 className="App-title">Survey</h1>
          </header>
          <div className="App-content">
            {props.children}
          </div>
        </div>
    )
}

export default Top;