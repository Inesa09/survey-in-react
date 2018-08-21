import React, { Component } from 'react';
import Text from '../components/Text';
import Survey from '../components/Survey';
import PrevBtn from '../components/PrevBtn';
import NextBtn from '../components/NextBtn';
import SaveBtn from '../components/SaveBtn';
// import fireDB from '../fireDB';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Survey</h1>
        </header>

        <div className="App-content">
          <Text />
          <Survey />
          <PrevBtn />
          <NextBtn />
          <SaveBtn />
        </div>
      </div>
    );
  }
}

export default App;
