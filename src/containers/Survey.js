import React, { Component } from 'react';

import gcp_config from '../GCP_configs';

import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import TriviaQuestion from '../components/TriviaQuestion';
import Question from '../components/Question';
import ImgUploader from './ImgUploader';
import MapContainer from '../components/MapContainer';

import '../css/Button.css';
import '../css/Segment.css';

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
    questions: {
      PLACE: 'מיקום קשור',
      TITLE: 'כותרת שאלה / תגיות',
      PRE_IMG: 'תמונה בזמן שאלה',
      POST_IMG: 'תמונה בזמן תשובה',
      DIFFICULTY: 'רמת קושי שאלה',
      INTERESTING: 'איכות שאלה',
      TOURISTS_REL: 'כמה רלוונטי לתיירים',
      EDIT_TEXT: 'סיפור קצר משלים',
      TRIVIA1: 'שאלת טריוויה',
      TRIVIA2: '#2 שאלת טריוויה',
    },
    constants: {
      numericFields: ['difficulty', 'score', 'tourists_relevancy',],
      textFields: ['place', 'story'],
      arrayFields: ['labels', 'question_images', 'story_images'],
    },
  }

  setNewFields(change) {
    const { numericFields, textFields, arrayFields } = this.props.constants;

    change.editor_username = this.props.user;

    for (let i = 1; i < 3; i++) {
      change = this.setTrivia(i, change);
    }

    for (let prop in change) {
      if ((numericFields.indexOf(prop) !== -1) && (change[prop] === ""))
        change[prop] = null;
      else if ((textFields.indexOf(prop) !== -1) && (change[prop] === null))
        change[prop] = "";
      else if (arrayFields.indexOf(prop) !== -1)
        change[prop].push("");
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



  //Save answer in the state
  handleAnswer = (question, e) => {
    let copy = this.state.answers;
    let result = e.target.value;

    if (this.props.constants.numericFields.indexOf(question) !== -1) {
      result = parseInt(result, 10);
    }

    copy[question] = result;
    this.setState({ answers: copy });
  }

  handleAnswerArray = (question, element) => {
    let copy = this.state.answers;
    let size = copy[question].length;
    copy[question][size - 1] = element;
    this.setState({ answers: copy });
  }

  handleAnswerTrivia = (triviaNum, question, e) => {
    let copy = this.state.answers;
    let trivia = this.getTriviaByNum(triviaNum);
    copy[trivia][question] = e.target.value;
    this.setState({ answers: copy });
  }

  handleAnswerPlace = (currentPlace) => {
    console.log("current", currentPlace);
    let copy = this.state.answers;
    copy.place = currentPlace.place_name;
    copy.lon = currentPlace.lon;
    copy.lat = currentPlace.lat;
    this.setState({ answers: copy });
    console.log(this.state.answers);
  }

  // ---> 1. GCP <---
  //Submit
  addAnswers = (e, postNum) => {
    const { answers, } = this.state;
    const { nextElementExistanse, showNext, toUndef, showEl } = this.props;

    e.preventDefault(); // <- prevent form submit from reloading the page

    this.addToPreviousAnswers(answers);
    console.log("add to prev answers", this.state.answers);

    document.getElementById("form").reset(); // <- clear the input
    if (nextElementExistanse) // <- use methods from App.js
      showNext(postNum, e);
    else {
      toUndef(postNum, e);
    }

    let copy = Object.assign({}, answers);
    copy.submission_time = new Date().toLocaleString("en-US");

    if (copy.labels[copy.labels.length - 1] === "")
      copy.labels.pop();

    this.processTrivias(copy);  // <- process trivias and send to db

    showEl('success', 1000, true);
    this.setState({ changed: true, changedForMap: true });

  }

  addToPreviousAnswers = (answers) => {
    let temporaryList = this.state.listWithPreviosAnswers;
    temporaryList.push(answers);
    this.setState({ listWithPreviosAnswers: temporaryList });
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

  //Show previous answers
  showPrev = (e) => {
    e.preventDefault();
    this.props.showPrev(e);
    let temporaryList = this.state.listWithPreviosAnswers;

    let previosAnswers = temporaryList.pop();
    this.setState({ answers: previosAnswers, listWithPreviosAnswers: temporaryList, changedForMap: true }, () => {
      console.log("show prev: ", this.state.answers);
    });
  }

  getNumOrNull = (getFromThere) => {
    getFromThere = (getFromThere === "") ? null : getFromThere;
    return getFromThere;
  }

  //react lifecycle methods
  static getDerivedStateFromProps(props, state) {
    if (state.changed) {
      return { answers: state.setNewFields(props.post), changed: false }
    } return null;
  }

  changeToFalse = () => {
    this.setState({ changedForMap: false });
  }

  render() {
    const { answers } = this.state;
    const { postNum, numberOfPreviousElemnts, submitted, questions } = this.props;
    const getNumOrNull = this.getNumOrNull;

    return submitted ?
      (<button className={numberOfPreviousElemnts > 0 ?
        'ui labeled icon violet basic massive button ' : 'ui labeled icon grey basic massive button disabled'}
        style={{ margin: '30px 35%' }}
        onClick={this.showPrev}>
        <i class="arrow left icon"></i>
        הקודם
    </button>)
      :
      (<div className="Survey">
        <form id='form'>

          <TriviaQuestion
            question={questions.TRIVIA1}
            tooltip={'answer is..'}
            numbers={['question', 'right_answer', 'wrong_answer1', 'wrong_answer2', 'wrong_answer3']}
            handleTextInput={(e, number) => this.handleAnswerTrivia(1, number, e)}
            value1={answers.trivia1.question}
            value2={answers.trivia1.right_answer}
            value3={answers.trivia1.wrong_answer1}
            value4={answers.trivia1.wrong_answer2}
            value5={answers.trivia1.wrong_answer3}
          />
          {/* <TriviaQuestion
            question={questions.TRIVIA2}
            tooltip={'answer is..'}
            numbers={['question', 'right_answer', 'wrong_answer1', 'wrong_answer2', 'wrong_answer3']} 
            handleTextInput={(e, number) => this.handleAnswerTrivia(2, number, e)}
            value1={answers.trivia2.question}
            value2={answers.trivia2.right_answer}
            value3={answers.trivia2.wrong_answer1}
            value4={answers.trivia2.wrong_answer2}
            value5={answers.trivia2.wrong_answer3}
          /> */}

          <TextArea
            question={questions.EDIT_TEXT}
            handleTextInput={(e) => this.handleAnswer('story', e)}
            value={answers.story}
            rows={'10'}
          />

          <Question question={questions.PLACE} />
          <MapContainer
            handleAnswer={(place) => this.handleAnswerPlace(place)}
            placesList={this.props.placesList}
            answer={answers.place}
            changed={this.state.changedForMap}
            changeToFalse={this.changeToFalse}
          />


          <div className="ui placeholder segment" style={{ margin: '30px', marginBottom: '10px' }}>
            <div className="ui two column stackable center aligned grid">
              <div className="ui vertical divider"> And </div>
              <div className="middle aligned row" >
                <div className="column" >
                  <ImgUploader
                    question={questions.PRE_IMG}
                    handleImgLoad={(newImg) => this.handleAnswerArray('question_images', newImg)}
                    answer={answers.question_images[answers.question_images.length - 1]} // to remember image 
                  />
                </div>
                <div className="column" >
                  <ImgUploader
                    question={questions.POST_IMG}
                    handleImgLoad={(newImg) => this.handleAnswerArray('story_images', newImg)}
                    answer={answers.story_images[answers.story_images.length - 1]} // to remember image 
                  />
                </div>
              </div>
            </div>
          </div>


          <TextArea
            question={questions.TITLE}
            handleTextInput={(e) => this.handleAnswerArray('labels', e.target.value)}
            value={answers.labels[answers.labels.length - 1]}
          />

          <Radio
            question={questions.DIFFICULTY}
            handleOptionChange={(e) => this.handleAnswer('difficulty', e)}
            answer={getNumOrNull(answers.difficulty)}
          />
          <Radio
            question={questions.INTERESTING}
            handleOptionChange={(e) => this.handleAnswer('score', e)}
            answer={getNumOrNull(answers.score)}
          />
          <Radio
            question={questions.TOURISTS_REL}
            handleOptionChange={(e) => this.handleAnswer('tourists_relevancy', e)}
            answer={getNumOrNull(answers.tourists_relevancy)}
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


          <SmallMessage name='success' text1='הטופס הושלם'
            text2='התשובות נשמרו' />
          <SmallMessage name='negative' text1='הטופס לא נשלח'
            text2='שים לב - חובה למלא את דירוג הקשר למיקום' />
        </form>
      </div>)
  }
}

export default Survey;
