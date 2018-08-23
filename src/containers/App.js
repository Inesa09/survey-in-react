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

  showPrev = (e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    if(temporaryList.length > 0){
    let previosElement = temporaryList.pop();
    this.setState({post : previosElement, previosIndexList : temporaryList});
    this.scrollToTop();
    }
  }

  showNext = (post, e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    let number = this.findNextUnsubmitedElement(post);
    if(number != undefined) {
    temporaryList.push(this.state.post);
    this.setState({post : number, previosIndexList : temporaryList});
    this.scrollToTop();
    }
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

  scrollToTop = () => {
    document.getElementById("form").reset(); 
    document.getElementById('top').scrollIntoView(true);
  }

  render() {
    const { post, text} = this.state;
    let number = this.findNextUnsubmitedElement(post);
    if(post != 0){
      number = post;
    }
    let isNextElementExist = this.findNextUnsubmitedElement(number) != undefined;
    console.log(text);
    return (post != undefined && text.length != 0 ? (
        <div className="App" id='top'>
          <header className="App-header">
            <h1 className="App-title">Survey</h1>
          </header>
          <div className="App-content">
            <Heading heading = {`Post Content - Related to ${text[number][1]}`}/>
            <Text text={text[number][2]}/>
            <Heading heading={"Post Review (Your input)"} />
            <Survey post={number} showPrev={this.showPrev} showNext={this.showNext} numberOfPreviousElemnts={this.state.previosIndexList.length} nextElementExistanse ={isNextElementExist}/>
          </div>
          </div>
    )
      :
      <div></div>)
  }
}

export default App;
