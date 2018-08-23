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
        previosIndexList :[],
        show: true
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
 toUndef(post){
  let temporaryList = this.state.previosIndexList;
  temporaryList.push(post);
  this.setState({post : undefined, previosIndexList : temporaryList});
 }
  showNext = (post, e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    let number = this.findNextUnsubmitedElement(post);
    if(number != undefined) {
      temporaryList.push(post);
      this.setState({post : number, previosIndexList : temporaryList});
      this.scrollToTop();
    } else
      this.setState({post: undefined});

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
    try{
      document.getElementById("form").reset(); 
      document.getElementById('top').scrollIntoView(true);
    } catch (err){ }
  }

  render() {
    console.log('render');
    const { post, text} = this.state;
    let number = this.findNextUnsubmitedElement(post);
    if(post != 0){
      number = post;
    }
    let isNextElementExist = this.findNextUnsubmitedElement(number) != undefined;


    if (post != undefined && text.length != 0) 
      return (
        <div className="App" id='top'>
          <header className="App-header">
            <h1 className="App-title">Survey</h1>
          </header>
          <div className="App-content">
            <Heading heading = {`Post Content - Related to ${text[number][1]}`}/>
            <Text text={text[number][2]}/>
            <Heading heading={"Post Review (Your input)"} />
            <Survey post={number} 
             showPrev={this.showPrev} showNext={this.showNext}
             numberOfPreviousElemnts={this.state.previosIndexList.length} 
             nextElementExistanse ={isNextElementExist}/>
          </div>
        </div>
      )
    else if(post === undefined)
      return (
        <div className="App" id='top'>
          <header className="App-header">
            <h1 className="App-title">Survey</h1>
          </header>
          <div className="App-content" style={{marginTop:'2%'}}>
            <div className='ui icon green massive message' style={{width:'640px', height:'150px', margin: '20px'}}>
              <i aria-hidden='true' className='check icon' />
              <div className='content'>
                <div className='header'>Sorry</div>All of the texts are already reviewed.
              </div>
            </div>
            <button className = {this.state.previosIndexList.length > 0 ? 
              'ui left animated violet basic massive button' : 'ui grey basic massive button'}
                  style= {{margin: '30px 220px' }}
                  onClick={this.showPrev}>
                  <div className='visible content'> Previous Text</div>
                  <div className='hidden content'>
                      <i aria-hidden='true' 
                      className={this.state.previosIndexList.length > 0 ? 'arrow left icon' : ''} />
                  </div>
              </button>
          </div>
        </div>
      )
    else return (<div> </div>)
  }
}

export default App;
