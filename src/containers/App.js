import React, { Component } from 'react';
import Text from '../components/Text';
import Survey from './Survey';
import fireDB from '../fireDB';
import Heading from '../components/Heading';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        post: 1,
        text: []
    }; // <- set up react state
}
updateDB(){
  fireDB.database().ref('masterSheet/').on('value', snapshot => { 
    this.setState({text : snapshot.val()});
}); 
}
componentDidMount() { 
  this.updateDB();
  console.log(this.state.text);
  } 
  showPrev = (post) => {
    console.log("showPrev" + (post-1));
  }

  showNext = (post) => {
    console.log("showNext" + (post+1));
  }
  findNextUnsubmitedElement(){
    const { post, text} = this.state;
    this.updateDB;
    for(let i = post + 1, size = fireDB.database().ref('masterSheet/').length; i < size; i++){
        if(text[i][3].length === 0){
          this.setState({post : i});
          return;
        }
    }
    this.setState({post : undefined});
  }
  render() {
    const { post, text} = this.state;
  return post != undefined && text.length != 0 ? (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Survey</h1>
        </header>

        <div className="App-content">
          <Heading heading = {text[post][1]}/>
          <Text text={text[post][2]}/>
          <Survey post={this.state.post} showPrev={this.showPrev} showNext={this.showNext} />
        </div>
      </div>
    )
    :
    <div></div>
  }
}

export default App;
