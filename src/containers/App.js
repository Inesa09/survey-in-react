import React, { Component } from 'react';
import Text from '../components/Text';
import Top from '../components/Top';
import Survey from './Survey';
import fireDB from '../fireDB';
import Heading from '../components/Heading';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
        post: 0,
        text: [],
        previosIndexList :[],
        show: 0
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
    const { post, text} = this.state;
    let number = this.findNextUnsubmitedElement(post);
    if(post != 0){
      number = post;
    }
    let isNextElementExist = this.findNextUnsubmitedElement(number) != undefined;


    if(text.length === 0)  //Loading
      return (
        <Top>
          <div class='ui icon teal message'>
            <i aria-hidden='true' class='circle notched loading icon' />
            <div class='content'>
              <div class='header'>Just one second</div>We are fetching that content for you.
            </div>
          </div>
        </Top>
      )
    else if (post === undefined || (post === 0 && number === undefined)) //All text submitted
      return (
        <Top>
          <div className='ui icon green massive message' >
            <i aria-hidden='true' className='check icon' />
            <div className='content'>
              <div className='header'>Sorry</div>All of the texts are already reviewed.
            </div>
          </div>
          <button className = {this.state.previosIndexList.length > 0 ? 
            'ui left animated violet basic massive button' : 'ui grey basic massive button'}
                style= {{margin: '30px 33%' }}
                onClick={this.showPrev}>
                <div className='visible content'> Previous Text</div>
                <div className='hidden content'>
                    <i aria-hidden='true' 
                    className={this.state.previosIndexList.length > 0 ? 'arrow left icon' : ''} />
                </div>
          </button>
        </Top>
      )
    else if(number !=undefined  && text.length != 0) //Main
      return (
        <Top>
          <Heading heading = {`Post Content - Related to ${text[number][1]}`}/>
          <Text text={text[number][2]}/>
          <Heading heading={"Post Review (Your input)"} />
          <Survey post={number} 
            showPrev={this.showPrev} showNext={this.showNext}
            numberOfPreviousElemnts={this.state.previosIndexList.length} 
            nextElementExistanse ={isNextElementExist}/>
        </Top>
      )
  }
}

export default App;
