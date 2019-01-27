import React, { Component } from 'react';

import gcp_config from '../GCP_configs';
import SurveyQuestions from '../components/SurveyQuestions';

import '../css/Button.css';

class Survey extends Component {

  constructor(props) {
    super(props);

    this.state = {
      setNewFields: this.setNewFields.bind(this),
      answers: this.props.submitted ? '' : this.setNewFields(this.props.post),
      listWithPreviosAnswers: [],
      changed: false,
      changedForMap: false,
    }; // <- set up react state
  }

  static defaultProps = {
    constants: {
      numericFields: ['difficulty', 'score'],
      textFields: ['place', 'lon', 'lat', 'story'],
      arrayFields: ['labels', 'question_images', 'story_images'],
      checkFields: ['tourists_relevancy', 'night_item', 'see_item']
    },
  }

  setNewFields(change) {
    const { numericFields, textFields, checkFields } = this.props.constants;

    change.editor_username = this.props.user;

    for (let i = 1; i < 3; i++) {
      change = this.setTrivia(i, change);
    }

    for (let prop in change) {
      if ((numericFields.indexOf(prop) !== -1) && (change[prop] === ""))
        change[prop] = null;
      else if ((textFields.indexOf(prop) !== -1) && (change[prop] === null))
        change[prop] = "";
      else if ((checkFields.indexOf(prop) !== -1) && (change[prop] === null))
        change[prop] = false;
    }

    return change;
  }

  setTrivia = (triviaNum, change) => {
    const getIfNotNull = this.getIfNotNull;
    let trivia = this.getTriviaByNum(triviaNum);

    change[trivia] = (triviaNum === 1) ? {
      question: getIfNotNull(change, 'question'),
      right_answer: getIfNotNull(change, 'right_answer'),
      wrong_answer1: getIfNotNull(change, 'answers', 1),
      wrong_answer2: getIfNotNull(change, 'answers', 2),
      wrong_answer3: getIfNotNull(change, 'answers', 3),
    } : {
        question: undefined,
        right_answer: undefined,
        wrong_answer1: undefined,
        wrong_answer2: undefined,
        wrong_answer3: undefined,
      }
    return change;
  }

  getIfNotNull = (getFromThere, getThis, index = 0) => {
    if (index === 0) {
      if (getFromThere[getThis] !== null | undefined)
        return getFromThere[getThis];
    } else {
      if (getFromThere[getThis].length > index) {
        if (getFromThere[getThis][index] !== null | undefined)
          return getFromThere[getThis][index];
      }
    } return undefined;
  }

  getTriviaByNum = (num) => {
    let trivia;
    switch (num) {
      case 1:
        trivia = 'trivia1';
        break;
      case 2:
        trivia = 'trivia2';
        break;
      default:
        return null;
    }
    return trivia;
  }


  addToAnswer = (answers) => {
    this.setState({ answers: answers });
  }


  // ---> 1. GCP <---
  //Submit
  addAnswers = (e, postNum) => {
    const { answers, } = this.state;
    const { showEl } = this.props;

    e.preventDefault(); // <- prevent form submit from reloading the page
    this.addToPreviousAnswers(answers);

    document.getElementById("form").reset(); // <- clear the input
    this.showNextItems(e, postNum);

    let copy = Object.assign({}, answers);
    copy.submission_time = new Date().toLocaleString("en-US");

    // if (copy.labels[copy.labels.length - 1] === "")
    //   copy.labels.pop();

    this.processTrivias(copy);  // <- process trivias and send to db

    showEl('success', 1000, true);
    this.setState({ changed: true, changedForMap: true });

  }

  processTrivias = (answers) => {
    let trivias = [answers.trivia1, answers.trivia2];
    delete answers.trivia1;
    delete answers.trivia2;

    let sent = false;
    let toDB = [];
    for (var i in trivias) {

      let tr = trivias[i];
      for (var prop in tr) {

        if (tr[prop] !== undefined) {
          let newAn = Object.assign({}, answers);
          const pushIfExist = this.pushIfExist;

          newAn.question = pushIfExist(newAn.question, tr['question']);
          newAn.right_answer = pushIfExist(newAn.right_answer, tr['right_answer']);
          newAn.answers = [];
          newAn.answers = pushIfExist(newAn.answers, tr['right_answer'], true);
          newAn.answers = pushIfExist(newAn.answers, tr['wrong_answer1'], true);
          newAn.answers = pushIfExist(newAn.answers, tr['wrong_answer2'], true);
          newAn.answers = pushIfExist(newAn.answers, tr['wrong_answer3'], true);

          if (sent)
            delete newAn.datastore_id;
          toDB.push(newAn);

          sent = true;
          break;
        }
      }
    }

    if (toDB.length === 0) {
      this.updatePostInDB(answers);
    } else {
      for (let i in toDB) {
        this.updatePostInDB(toDB[i]);
      }
    }
  }

  pushIfExist = (pushThere, pushThat, isArr = false) => {
    if (pushThat !== undefined) {
      if (isArr) {
        pushThere.push(pushThat);
      } else {
        pushThere = pushThat;
      }
    } return pushThere;
  }

  updatePostInDB = (data) => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(gcp_config.username + ":" + gcp_config.password));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const toDB = JSON.stringify({ item: data });
    console.log("UPDATE: ", toDB);

    fetch('https://roadio-master.appspot.com/v1/edit_item', {
      method: 'POST',
      headers: headers,
      body: toDB
    }).then(res => console.log('Status: ', res.status))
      .catch(error => console.error('Error: ', error));
  }

  showNextItems = (e, postNum) => {
    const { nextElementExistanse, showNext, toUndef } = this.props;

    if (nextElementExistanse) // <- use methods from App.js
      showNext(postNum, e);
    else {
      toUndef(postNum, e);
    }
  }

  addToPreviousAnswers = (answers) => {
    let temporaryList = this.state.listWithPreviosAnswers;
    temporaryList.push(answers);
    this.setState({ listWithPreviosAnswers: temporaryList });
  }

  //Show previous answers
  showPrev = (e) => {
    e.preventDefault();
    this.props.showPrev(e);
    let temporaryList = this.state.listWithPreviosAnswers;

    let previosAnswers = temporaryList.pop();
    console.log(previosAnswers);
    this.setState({ answers: previosAnswers, listWithPreviosAnswers: temporaryList, changedForMap: true });
  }

  changeToFalse = () => {
    this.setState({ changedForMap: false });
  }

  //react lifecycle methods
  static getDerivedStateFromProps(props, state) {
    if (state.changed) {
      return { answers: props.submitted ? '' : state.setNewFields(props.post), changed: false };
    } return null;
  }

  render() {

    const { answers } = this.state;
    const { postNum, numberOfPreviousElemnts, submitted, questions } = this.props;

    console.log(this.state.listWithPreviosAnswers);

    return submitted ? (
      <button className={numberOfPreviousElemnts > 0 ?
        'ui labeled icon violet basic massive button ' : 'ui labeled icon grey basic massive button disabled'}
        style={{ margin: '30px 35%' }}
        onClick={this.showPrev}>
        <i class="arrow left icon"></i>
        הקודם
      </button>
    ) : (
        <div>

          <SurveyQuestions
            answers={answers}
            placesList={this.props.placesList}
            changed={this.state.changedForMap}
            changeToFalse={this.changeToFalse}
            addToAnswer={this.addToAnswer}
            post={this.props.post}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}>
            <button className={numberOfPreviousElemnts > 0 ?
              'ui labeled icon violet basic button ' : 'ui labeled icon grey basic button disabled'}
              style={{ margin: '30px' }}
              onClick={this.showPrev}>
              <i className="arrow left icon"></i>
              הקודם
            </button>
            <button className='ui right labeled icon violet basic button'
              style={{ margin: '30px' }}
              onClick={(e) => { this.addAnswers(e, postNum) }}>
              הבא
              <i className="arrow right icon"></i>
            </button>
          </div>
        </div >
      )
  }
}

export default Survey;