import React, { Component } from 'react';

import fireDB from '../fireDB';
import gcp_config from '../GCP_configs';
import { HashRouter as Router, Redirect } from 'react-router-dom';
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
      previosIndex: undefined,
      previosDatascore_id: undefined,
      user: {},
      newItem: false,
      dbIsFull: false,
    }; // <- set up react state
  }

  setNew = (bool) => {
    this.setState({ newItem: bool });
  }

  // ---> 1. FIREBASE DB <---
  authListener() {
    fireDB.auth().onAuthStateChanged((user) => {
      // console.log(user);
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
      console.log(previosElement);
      this.setState({ post: previosElement, previosIndexList: temporaryList, previosDatascore_id: this.state.text[previosElement].datastore_id });
    }
  }

  showNext = (post, e) => {
    e.preventDefault();
    console.log("showNext");
    let temporaryList = this.state.previosIndexList;
    let number = this.findNextUnsubmitedElement(post);
    // console.log(number);
    if (number !== undefined) {
      temporaryList.push(post);
      this.setState({ post: number, previosIndexList: temporaryList });
    }
  }

  toUndef = (post, e) => {
    console.log("toUndef");
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    temporaryList.push(post);
    this.setState({ post: undefined, previosIndexList: temporaryList });
  }

  findNextUnsubmitedElement = (post) => {
    const { text } = this.state;
    console.log(this.state.user.email);
    for (let i = post + 1, size = Object.values(text).length; i < size; i++) {
      if ((text[i].assigned_user === this.state.user.email)
        && text[i].submission_time === null) {
        console.log("Item ID: ", text[i]);
        console.log(i);
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
    // console.log(this);
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(gcp_config.username + ":" + gcp_config.password));
    fetch('https://roadio-master.appspot.com/v1/get_places?limit=-1')
      .then(response => response.json())
      .then(placeData => this.setState({ placesList: placeData }, () => {
        fetch('https://roadio-master.appspot.com/v1/get_user_items?user_id=management_user&limit=-1', { method: 'GET', headers: headers, })
          .then(response => response.json())
          .then(data => this.setState({ text: data.items }, () => {
            console.log(this.state.text);
            this.setState({ dbIsFull: true });
          }));
      }));


    // console.log("a");
    // console.log(this.state.placesList);
    // console.log("a");

  }

  render() {
    // console.log("RENDER: ", this.state.text);
    console.log(11111111111111111111111);
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
    // console.log("test:" + c)

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
      // console.log("number: " + number);
      // console.log("post: " + post);
      if (post !== 0) {
        number = post;
      }

      let isNextElementExist = this.findNextUnsubmitedElement(number) !== undefined;
      const itemId = text[number] === undefined ? false : text[number].datastore_id;
      console.log(this.findNextUnsubmitedElement(number));
      console.log(isNextElementExist);
      console.log(222222222222);
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
              post={{ place: null, lat: undefined, lon: undefined }}
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
      console.log(333333333333);
      // console.log(this);
      // console.log(number);
      // console.log(this.state.previosIndexList);
      // console.log(text[number].raw_text);
      // console.log(text[number].place);

      console.log("url: ", window.location.href);

      return (
        <Router >
          <div>
            <Route path={"/:name"} exact render={(routeProps) => {
              console.log(routeProps);
              let string = "/" + routeProps.match.params.name;
              console.log(string);
              let postExistanse = false;
              console.log(this.state.previosIndexList);
              console.log(string);
              console.log(itemId);
              console.log(number);
              if (number === undefined && Object.values(text).length > 0 && this.state.previosIndexList.length === 0 || routeProps.history.action == "POP") {
                for (let i = 0, size = Object.values(text).length; i < size; i++) {
                  if (text[i].datastore_id == routeProps.match.params.name) {
                    console.log(i);
                    submitted = false;
                    hideMessage = true;
                    hideDiv = false;
                    postExistanse = true;
                    number = i;
                    break;
                  }
                }
              }
              if (itemId) {
                // console.log(number);
                console.log(!(this.state.previosIndexList.length > 0 && this.findNextUnsubmitedElement(this.state.previosIndexList[this.state.previosIndexList.length - 1]) === number) && this.state.previosDatascore_id != text[number].datastore_id);
                console.log(number);
                console.log(post);
                console.log(previosIndexList);
                console.log(this.findNextUnsubmitedElement(this.state.previosIndexList[this.state.previosIndexList.length - 1]));
                console.log(this.state.previosDatascore_id != text[number].datastore_id);
                if (!(this.state.previosIndexList.length > 0 && this.findNextUnsubmitedElement(this.state.previosIndexList[this.state.previosIndexList.length - 1] ) === number ) && this.state.previosDatascore_id != text[number].datastore_id ) {
                  for (let i = 0, size = Object.values(text).length; i < size; i++) {
                    console.log(1);
                    if (text[i].datastore_id == routeProps.match.params.name) {
                      console.log(i);
                      submitted = false;
                      postExistanse = true;
                      number = i;
                      break;
                    }
                  }
                  console.log(submitted);
                }
                
                console.log(submitted);
                console.log(number);
                // console.log("12" == 12);
                // console.log(typeof text[number].datastore_id);
                // console.log(typeof routeProps.match.params.name);
                // console.log(number);
                // console.log(Object.values(text).length);
                // if (!isNaN(routeProps.match.params.name) && number != post) {
                //   number = parseFloat(routeProps.match.params.name);
                // }

                string = "/" + text[number].datastore_id;
                console.log(string);
                //
                // routeProps.history.push(string);
                // routeProps.match.url = string;
                // routeProps.location.pathname = string;
              }
              console.log(submitted);
              console.log(text[number]);
              isNextElementExist = this.findNextUnsubmitedElement(number) !== undefined;
              return (
                <Top user={user.email} itemId={itemId} setNew={() => this.setNew(true)} >
                  <Redirect to={string} />
                  <Message className={hideMessage ? 'hidden' : ''} color='green' icon='check icon'
                    text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
                  <div className={hideDiv ? 'hidden' : ''}>
                    {/* <Heading heading={hideDiv ? '' : `תוכן - בהקשר ל ${text[number].place}`} /> */}
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
            <Route path={"/"} exact render={() => {
              let string = "/" + (text[number] === undefined ? "" : text[number].datastore_id);
              // console.log(number);
              // console.log(previosIndexList);
              console.log(44444444444444);
              return (
                <Top user={user.email} itemId={itemId} setNew={() => this.setNew(true)} >
                  <Redirect to={string} />
                  <Message className={hideMessage ? 'hidden' : ''} color='green' icon='check icon'
                    text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
                  <div className={hideDiv ? 'hidden' : ''}>
                    {/* <Heading heading={hideDiv ? '' : `תוכן - בהקשר ל ${text[number].place}`} /> */}
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
