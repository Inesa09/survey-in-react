import React, { Component } from 'react';
import Text from '../components/Text';
import Top from '../components/Top';
import Survey from './Survey';
import fireDB from '../fireDB';
import Heading from '../components/Heading';
import Message from '../components/Message';
import Login from './Login';
import '../css/Hidden.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: 0,
      text: [],
      previosIndexList: [],
      user : {},
      // table: 'newData/',
      table: 'version3/',
    }; // <- set up react state
  }

  authListener(){
    fireDB.auth().onAuthStateChanged((user) =>{
      console.log(user);
      if(user){
        this.setState({user});
        localStorage.setItem('user',user.uid);
      }
      else{
        this.setState({user : null});
        localStorage.removeItem('user');
      }
    });
  }

  showPrev = (e) => {
    e.preventDefault();
    this.hideEl('negative', true);
    let temporaryList = this.state.previosIndexList;
    if (temporaryList.length > 0) {
      let previosElement = temporaryList.pop();
      this.setState({ post: previosElement, previosIndexList: temporaryList });
    }
  }

  showNext = (post, e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    let number = this.findNextUnsubmitedElement(post);
    if (number !== undefined) {
      temporaryList.push(post);
      this.setState({ post: number, previosIndexList: temporaryList });
    }
  }

  toUndef = (post, e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    temporaryList.push(post);
    this.setState({ post: undefined, previosIndexList: temporaryList });
  }

  findNextUnsubmitedElement = (post) => {
    for (let i = post + 1, size = Object.values(this.state.text).length; i < size; i++) {
      if (this.state.text[i][23].length === 0) {
        return i;
      }
    }
  }

  signOut() {
    fireDB.auth().signOut();
  }

  //CSS methods
  showEl = (el, time, bool) => {
    const current = document.getElementById(el);
    this.hideEl('negative', false);
    this.hideEl('error', false);
    if(current.style.display === 'none'){
      current.style.display = 'block';
      current.scrollIntoView(true);
      setTimeout(this.hideEl, time, el, bool);
    }
  }
  hideEl = (el, bool) => {
    try {
      document.getElementById(el).style.display = 'none';
      if (bool)
        document.getElementById('top').scrollIntoView(true);
    } catch (err) {
    }
  }

  componentDidMount() {
    fireDB.database().ref(this.state.table).on('value', snapshot => {
      this.setState({ text: snapshot.val() });
    });
    this.authListener();
  }

  render() {
    if(this.state.user){
      const { post, text, previosIndexList, user } = this.state;
      let submitted = false;
      let hideMessage, hideDiv;
      let number = this.findNextUnsubmitedElement(post);
      if (post !== 0) {
        number = post;
      }
      let isNextElementExist = this.findNextUnsubmitedElement(number) !== undefined;
    
      if (text.length === 0)  //Loading
        return (


          <Top user={user.email} signOut={this.signOut}>
            <Message color='teal' icon='circle notched loading icon'
              text1='רק שניה' text2='מביאים לכם את התוכן' />
          </Top>
        )
      else if (post === undefined || (post === 0 && number === undefined)){ //All text submitted
        submitted = true;
        hideMessage = false;
        hideDiv = true;
      } else { //Main
        hideMessage = true;
        hideDiv = false;
      }
      

      return (
        <Top user={user.email} signOut={this.signOut}>
          <Message className={hideMessage ? 'hidden' : ''} color='green' icon='check icon'
            text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
          <div className={hideDiv ? 'hidden' : ''}>
            <Heading heading={hideDiv ? '' : `תוכן - בהקשר ל ${text[number][1]}`} />
            <Text text={hideDiv ? '' : text[number][2]} heading={hideDiv ? '' : text[number][1]} />
            <Heading heading={"שדות למילוי"} />
          </div>

          <Survey postNum={number}
            showPrev={this.showPrev} showNext={this.showNext} showEl={this.showEl}
            numberOfPreviousElemnts={previosIndexList.length}
            nextElementExistanse={isNextElementExist}
            toUndef={this.toUndef}
            post={submitted ? '' : text[number]}
            user={submitted ? '' : user.email}
            submitted={submitted}
          />
        </Top>
      )
      }
    else{
      return (
        <Login showEl={this.showEl} hideEl={this.hideEl}/>
      )
    }
  }
}

export default App;
