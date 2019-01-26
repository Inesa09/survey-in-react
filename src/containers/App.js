import React, { Component } from 'react';

import fireDB from '../fireDB';
import gcp_config from '../GCP_configs';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Text from '../components/Text';
import Top from '../components/Top';
import Survey from './Survey';
import NewForm from './NewForm';
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
      placesList: [],
      previosIndexList: [],
      user: {},
      newItem: false,
    }; // <- set up react state
  }

  setNew = (bool) => {
    this.setState({ newItem: bool });
  }

  // ---> 1. FIREBASE DB <---
  authListener() {
    fireDB.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      }
      else {
        this.setState({ user: null });
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
    const { text } = this.state;
    for (let i = post + 1, size = Object.values(text).length; i < size; i++) {
      console.log(this.state.user.email);
      console.log(text[i]);
      if ((text[i].assigned_user === this.state.user.email || text[i].assigned_user === null)
        && text[i].submission_time === null && text[i].story === "test") {   //TODO delete "test"
        console.log("Item ID: ", text[i]);
        // console.log(1640970940540570457547809);
        return i;
      }
    }
  }

  //CSS methods
  showEl = (el, time, bool) => {
    const current = document.getElementById(el);
    this.hideEl('negative', false);
    this.hideEl('error', false);
    if (current.style.display === 'none') {
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

  // ---> 3. GCP <---
  componentDidMount() {
    this.authListener(); // <--- FIREBASE DB
    console.log(this);
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(gcp_config.username + ":" + gcp_config.password));
    fetch('https://roadio-master.appspot.com/v1/get_places?limit=-1')
      .then(response => response.json())
      .then(placeData => this.setState({ placesList: placeData }, () => {
        fetch('https://roadio-master.appspot.com/v1/get_user_items?user_id=management_user&limit=-1', { method: 'GET', headers: headers, })
          .then(response => response.json())
          .then(data => this.setState({ text: data.items }));
      }));


    console.log("a");
    console.log(this.state.placesList);
    console.log("a");

  }

  render() {
    console.log("RENDER: ", this.state.text);

    let username = 'shinom';
    let password = 'iloveToRide';

    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');


    let c = 0;

    for (let i = 0; i < Object.values(this.state.text).length; i++) {
      let current = this.state.text[i];

      if (current.story === "test" && current.submission_time === null) {
        // console.log(current);
        c++;
      }
    }
    console.log("test:" + c)

    let current = {
      answers: ["כור גרעיני"],
      categories: ["נמל תעופה"],
      editor_username: null,
      extended_story: null,
      extended_story_voices: [],
      is_ready: true,
      is_test: false,
      item_id: "",
      lables: [],
      last_modified: null,
      lat: "09",
      lon: "08",
      notes: null,
      place: "town",
      place_relevancy: null,
      question: "what?",
      question_images: [],
      question_videos: [],
      qustion_voice: null,
      raw_text: null,
      right_answer: "כור גרעיני",
      score: 1,
      source: "",
      story: "test",
      story_images: [],
      story_ref: null,
      story_videos: [],
      story_voices: [],
      submission_time: null,
      tourists_relevancy: null,
      type: "question",
      assigned_user: "inesusja@gmail.com"
    }
    //    current.lon = current.lon.toString();
    //    current.lat = current.lat.toString();
    //    delete current.datastore_id;
    //    current.story = "aaabbbccc";

    //  if(current.story  === "aaabbbccc"){
    //    console.log("test" + current);
    //  }



    const data = JSON.stringify({ item: current });
    //  console.log(data);

    // fetch('https://roadio-master.appspot.com/v1/edit_item', {
    //   method: 'POST',
    //   headers: headers,
    //   body: data
    // }).then(res => console.log(res))
    //   // .then(response => console.log('Success:', JSON.stringify(response)))
    //   .catch(error => console.error('Error:', error));







    // console.log(this.state.text);
    // console.log(this.state.text.items);
    // if(this.state.text.items !== undefined)
    // console.log(this.state.text.items[2][29]);
    if (this.state.user) {
      const { post, text, previosIndexList, user, newItem } = this.state;
      let submitted = false;
      let hideMessage, hideDiv;
      let number = this.findNextUnsubmitedElement(post);
      console.log("number: " + number);
      console.log("post: " + post);
      if (post !== 0) {
        number = post;
      }

      let isNextElementExist = this.findNextUnsubmitedElement(number) !== undefined;
      const itemId = text[number] === undefined ? false : text[number].datastore_id;


      if (text.length === 0)  //Loading
        return (
          <Top user={user.email} itemId={false} >
            <Message color='teal' icon='circle notched loading icon'
              text1='רק שניה' text2='מביאים לכם את התוכן' />
          </Top>
        )
      else if (this.state.newItem) {
        return (
          <Top user={user.email} itemId={false} >
            <Heading heading={'New item'} />
            <NewForm
              user={user.email}
              post={{ place: null, lat: undefined, lon: undefined}}
              placesList={this.state.placesList} 
              setNew={this.setNew}
            />
          </Top>

        )
      } else if (post === undefined || (post === 0 && number === undefined)) { //All text submitted
        submitted = true;
        hideMessage = false;
        hideDiv = true;
      } else { //Main
        hideMessage = true;
        hideDiv = false;
      }
      console.log(this);
      // console.log(text[number].raw_text);
      // console.log(text[number].place);

      return (
        <Router>
          <div>
            <Route path="/:name" exact render={(routeProps) => {
              console.log(routeProps);
              console.log(number);
              console.log(this);
              console.log(window.location.href);
              let postExistanse = false;
              for (let i = 0, size = Object.values(text).length; i < size; i++) {
                if (text[i].datastore_id == routeProps.match.params.name) {
                  postExistanse = true;
                  number = i;
                  break;
                }
              }
              console.log("12" == 12);
              console.log(typeof text[number].datastore_id);
              console.log(typeof routeProps.match.params.name);
              console.log(number);
              console.log(Object.values(text).length);
              // if (!isNaN(routeProps.match.params.name) && number != post) {
              //   number = parseFloat(routeProps.match.params.name);
              // }
              let string = "/" + text[number].datastore_id;
              console.log(string);
              //
              // routeProps.history.push(string);
              // routeProps.match.url = string;
              // routeProps.location.pathname = string;
              return (
                <Top user={user.email} itemId={itemId} setNew={() => this.setNew(true)} >
                  <Redirect to={string} />
                  <Message className={hideMessage ? 'hidden' : ''} color='green' icon='check icon'
                    text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
                  <div className={hideDiv ? 'hidden' : ''}>
                    <Heading heading={hideDiv ? '' : `תוכן - בהקשר ל ${text[number].place}`} />
                    <Text text={hideDiv ? '' : text[number].raw_text} heading={hideDiv ? '' : text[number].place} />
                  </div>

                  <Survey postNum={number}
                    showPrev={this.showPrev} showNext={this.showNext} showEl={this.showEl}
                    numberOfPreviousElemnts={previosIndexList.length}
                    nextElementExistanse={isNextElementExist}
                    toUndef={this.toUndef}
                    post={submitted ? '' : text[number]}
                    user={submitted ? '' : user.email}
                    submitted={submitted}
                    placesList={this.state.placesList}
                  />
                </Top>
              );
            }} />
            <Route path="/" exact render={() => {
              let string = "/" + (text[number] === undefined ? "" : text[number].datastore_id);
              console.log(number);
              return (
                <Top user={user.email} itemId={itemId} setNew={() => this.setNew(true)} >
                  <Redirect to={string} />
                  <Message className={hideMessage ? 'hidden' : ''} color='green' icon='check icon'
                    text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
                  <div className={hideDiv ? 'hidden' : ''}>
                    <Heading heading={hideDiv ? '' : `תוכן - בהקשר ל ${text[number].place}`} />
                    <Text text={hideDiv ? '' : text[number].raw_text} heading={hideDiv ? '' : text[number].place} />
                  </div>

                  <Survey postNum={number}
                    showPrev={this.showPrev} showNext={this.showNext} showEl={this.showEl}
                    numberOfPreviousElemnts={previosIndexList.length}
                    nextElementExistanse={isNextElementExist}
                    toUndef={this.toUndef}
                    post={submitted ? '' : text[number]}
                    user={submitted ? '' : user.email}
                    submitted={submitted}
                    placesList={this.state.placesList}
                  />
                </Top>
              );
            }} />
          </div>
        </Router>
      )
    }
    else {
      return (
        <Login showEl={this.showEl} hideEl={this.hideEl} />
      )
    }
  }
}

export default App;
