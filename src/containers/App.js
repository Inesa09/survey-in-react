import React, { Component } from 'react';
import Text from '../components/Text';
import Survey from './Survey';
import fireDB from '../fireDB';
import Heading from '../components/Heading';
// import fireDB from '../fireDB';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        post: 1,
        text: []
    }; // <- set up react state
}
componentDidMount() { 
  fireDB.database().ref('masterSheet/').on('value', snapshot => { 
      this.setState({text : snapshot.val()});
  }); 
  } 
  showPrev = (post) => {
    console.log("showPrev" + (post-1));
  }

  showNext = (post) => {
    console.log("showNext" + (post+1));
  }

  render() {
    const filteredList = Object.values(this.state.text).filter(elem => {
      return elem[3].length === 0;
  });
  return filteredList.length > 0 ? (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Survey</h1>
        </header>

        <div className="App-content">
          <Heading heading = {filteredList[this.state.post][1]}/>
          <Text text={filteredList[this.state.post][2]}/>
          <Survey post={this.state.post} showPrev={this.showPrev} showNext={this.showNext} />
        </div>
      </div>
    )
    :
    <div></div>
  }
}

export default App;
