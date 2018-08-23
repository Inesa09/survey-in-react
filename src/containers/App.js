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
        post: 0,
        text: [],
        previosIndexList :[]
    }; // <- set up react state
}
  showPrev = (post) => {
    let temporaryList = this.state.previosIndexList;
    let previosElement = temporaryList.pop();
    console.log("showPrev" + (post-1));
    this.setState({post : previosElement, previosIndexList : temporaryList});
  }

  showNext = (post) => {
    console.log("showNext" + (post+1));
    let temporaryList = this.state.previosIndexList;
    let number = this.findNextUnsubmitedElement(post);
    if(number != undefined) temporaryList.push(this.state.post);
    this.setState({post : number, previosIndexList : temporaryList});
  }
  findNextUnsubmitedElement= (post) => {
    for(let i = post + 1, size = Object.values(this.state.text).length; i < size; i++){
        if(this.state.text[i][3].length === 0){
          return i;
        }
    }
  }
  componentDidMount() { 
    fireDB.database().ref('masterSheet/').on('value', snapshot => { 
      this.setState({text : snapshot.val()});
  }); 
    } 
  render() {
    const { post, text} = this.state;
    let number = this.findNextUnsubmitedElement(post);
    if(post != 0){
      number = post;
      }
  return post != undefined && text.length != 0 ? (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Survey</h1>
        </header>

        <div className="App-content">
          <Heading heading = {text[number][1]}/>
          <Text text={text[number][2]}/>
          <Survey post={number} showPrev={this.showPrev} showNext={this.showNext} />
        </div>
      </div>
    )
    :
    <div></div>
  }
}

export default App;
