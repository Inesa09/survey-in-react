import React, { Component } from 'react';
import Text from '../components/Text';
import Survey from './Survey';
// import fireDB from '../fireDB';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        post: 1,
    }; // <- set up react state
}

  showPrev = (post) => {
    console.log("showPrev" + (post-1));
  }

  showNext = (post) => {
    console.log("showNext" + (post+1));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Survey</h1>
        </header>

        <div className="App-content">
          <Text post={this.state.post} />
          <Survey post={this.state.post} showPrev={this.showPrev} showNext={this.showNext} />
        </div>
      </div>
    );
  }
}

export default App;
