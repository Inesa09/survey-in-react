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
      constants: {
        DATE: 29,
      },
      // table: 'newData/',
      table: 'version4/', //--> Developer's DB <--
    }; // <- set up react state
  }

  // ---> 1. NEW DB <---
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
    const {text, constants} = this.state;
    for (let i = post + 1, size = Object.values(text).length; i < size; i++) {
      console.log(text[i].submission_time);
      if (text[i].submission_time === null) {
        console.log(1640970940540570457547809);
        return i;
      }
    }
  }

    // ---> 2. NEW DB <---
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

    // ---> 3. NEW DB <---
  componentDidMount() {

    // fireDB.database().ref(this.state.table).on('value', snapshot => {
    //   this.setState({ text: snapshot.val() });
    // });
    // this.authListener();
    // console.log("12313");
    // console.log(this.state.text);
    let base64 = require('base-64');

    let username = 'shinom';
    let password = 'iloveToRide';

    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));

    fetch('https://roadio-master.appspot.com/v1/get_user_items?user_id=management_user&limit=-1', {method:'GET',headers: headers,})
     .then(response =>response.json())
     .then(data => this.setState({ text: data.items}));
     console.log(this.state.text);

  }

  render() {
    // for(var i = 1; i <= 100; i++){
    //   fireDB.database().ref(`version4/${i}`).update({ 27: ''}); // <- send to db
    // }
    console.log(this.state.text);
    console.log(this.state.text.items);
    if(this.state.text.items != undefined)
    console.log(this.state.text.items[2][29]);
    if(this.state.user){
      const { post, text, previosIndexList, user } = this.state;
      let submitted = false;
      let hideMessage, hideDiv;
      let number = this.findNextUnsubmitedElement(post);
      if (post !== 0) {
        number = post;
      }
      let isNextElementExist = this.findNextUnsubmitedElement(number) !== undefined;
      console.log(number);
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
      
      console.log(text[number].raw_text);
      console.log(text[number].place);
      return (
        <Top user={user.email} signOut={this.signOut}>
          <Message className={hideMessage ? 'hidden' : ''} color='green' icon='check icon'
            text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
          <div className={hideDiv ? 'hidden' : ''}>
            <Heading heading={hideDiv ? '' : `תוכן - בהקשר ל ${text[number].place}`} />
            <Text text={hideDiv ? '' : text[number].raw_text} heading={hideDiv ? '' : text[number].place} />
            <Heading heading={"שדות למילוי"} />
          </div>

          <Survey postNum={number}
            showPrev={this.showPrev} showNext={this.showNext} showEl={this.showEl}
            numberOfPreviousElemnts={previosIndexList.length}
            nextElementExistanse={isNextElementExist}
            toUndef={this.toUndef}
            post={submitted ? '' : text[number]}
            text={submitted ? '' : text[number][2]}
            place={submitted ? '' : text[number][1]}
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
