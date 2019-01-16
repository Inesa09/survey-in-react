import React, { Component } from 'react';

import gcp_config from '../GCP_configs';

import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import TriviaQuestion from '../components/TriviaQuestion';
import ToggleFields from '../components/ToggleFields';
import Question from '../components/Question';
import ImgUploader from './ImgUploader';
import MapContainer from '../components/MapContainer';

import '../css/Button.css';

class Survey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      setNewFields: this.setNewFields.bind(this),
      answers: this.setNewFields(this.props.post),
      listWithPreviosAnswers:[],
      changed: false,
    }; // <- set up react state
  }

  static defaultProps = {
    questions: {
      PLACE: 'מיקום קשור',
      TITLE: 'QUESTION TITLE',
      PRE_IMG: 'Pre Question Image',
      POST_IMG: 'Post Question Image',
      DIFFICULTY: 'Difficulty',
      PLACE_REL: 'עד כמה התוכן רלוונטי למקום?',
      INTERESTING: 'עד כמה התוכן מעניין?',
      TOURISTS_REL: 'כמה רלוונטי לתיירים',
      EDIT_TEXT: 'תקציר התוכן',
      TRIVIA1: '#1 שאלת טריוויה',
      TRIVIA2: '#2 שאלת טריוויה',
      NOTES: 'הערות',
    },
    constants: {
      numericFields: [ 'difficulty', 'place_relevancy', 'score', 'tourists_relevancy', ],
      textFields: [ 'place', 'story', 'notes' ],
      arrayFields: [ 'labels', 'question_images', 'story_images' ],
    },
  }

  setNewFields(change) {   
    const { numericFields, textFields, arrayFields } = this.props.constants;

    change.editor_username = this.props.user;

    for (let i = 1; i < 3; i++){
      change = this.setTrivia(i, change);
    } 

    for(let prop in change){
      if( (numericFields.indexOf(prop) !== -1) && (change[prop] === "") )
        change[prop] = null;
      else if( (textFields.indexOf(prop) !== -1) && (change[prop] === null) )
        change[prop] = "";
      else if( arrayFields.indexOf(prop) !== -1 )
        change[prop].push("");
    }

    return change;
  }

  setTrivia = (triviaNum, change) => {
    const getIfNotNull = this.getIfNotNull;
    let trivia = this.getTriviaByNum(triviaNum);

    change[trivia] =  (triviaNum === 1) ? {
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

  getIfNotNull = (getFromThere, getThis, index=0) => {
    if(index === 0){
      if(getFromThere[getThis] !== null | undefined)
        return getFromThere[getThis];
    } else {
      if(getFromThere[getThis].length > index) {
        if(getFromThere[getThis][index] !== null | undefined)
          return getFromThere[getThis][index]; 
      }
    } return undefined;
  }

  getTriviaByNum = (num) => {
    let trivia;
    switch(num){
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

    if(this.props.constants.numericFields.indexOf(question) !== -1){
      result = parseInt(result);
    }

    copy[question] = result;
    this.setState({ answers: copy });
  }

  handleAnswerArray = (question, element) => {
    let copy = this.state.answers;
    let size = copy[question].length;
    copy[question][size-1] = element;
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
    const { answers } = this.state;
    const { nextElementExistanse, showNext, toUndef, showEl } = this.props;

    e.preventDefault(); // <- prevent form submit from reloading the page
    if(answers.place_relevancy === "") // <- mandatory question
      showEl('negative', 250000000, false);
    else {
      this.addToPreviousAnswers(answers);

      document.getElementById("form").reset(); // <- clear the input
      if (nextElementExistanse) // <- use methods from App.js
        showNext(postNum, e);
      else {
        toUndef(postNum, e);
      }

      let copy = Object.assign({}, answers);
      copy.submission_time = new Date().toLocaleString("en-US");

      if(copy.labels[copy.labels.length - 1] === "")
        copy.labels.pop();

      //TODO ---> WAIT FOR DIMA ---> lat & lon - STRINGS!
      copy = this.processLocation(copy);
      this.processTrivias(copy);  // <- process trivias and send to db

      showEl('success', 1000, true);
      this.setState( {changed: true});
    }
  }

  addToPreviousAnswers = (answers) => {
    let temporaryList = this.state.listWithPreviosAnswers; 
    temporaryList.push(answers);
    this.setState({ listWithPreviosAnswers: temporaryList });
  }

  processLocation = (answers) => {
    // if(answers[ PLACE ] !== post[ PLACE ]){ // <- add a new post if place has been changed
      //   let textsRef = db.ref(this.state.table);
      //   let all;
      //   textsRef.on('value', snapshot => {
      //     all = snapshot.val();
      //   });

      //   let newPost = all.length;
      //   textsRef.child(newPost).set(all[postNum]);
      //   postNum = newPost;
      //   copy[ LOCATION ] = '';
      // }

    answers.lon = answers.lon.toString();
    answers.lat = answers.lat.toString();
    return answers;
  }

  processTrivias = (answers) => {
    let trivias = [answers.trivia1, answers.trivia2];
    delete answers.trivia1;
    delete answers.trivia2;

    let sent = false;
    let toDB = [];
    for(var i in trivias){
      
      let tr = trivias[i];
      for(var prop in tr){

        if(tr[prop] !== undefined){
          let newAn = Object.assign({}, answers);
          const pushIfExist = this.pushIfExist;

          newAn.question = pushIfExist(newAn.question, tr['question']);
          newAn.right_answer = pushIfExist(newAn.right_answer, tr['right_answer']);
          newAn.answers = [];
          newAn.answers = pushIfExist(newAn.answers, tr['right_answer'], true);
          newAn.answers = pushIfExist(newAn.answers, tr['wrong_answer1'], true);
          newAn.answers = pushIfExist(newAn.answers, tr['wrong_answer2'], true);
          newAn.answers = pushIfExist(newAn.answers, tr['wrong_answer3'], true);
          
          if(sent)
            delete newAn.datastore_id;
          toDB.push(newAn);

          sent = true;
          break;
        }
      }
    }

    if(toDB.length === 0){
      this.updatePostInDB(answers);
    } else {
      for(var i in toDB){
        this.updatePostInDB(toDB[i]);
      }
    }
  }

  pushIfExist = (pushThere, pushThat, isArr=false) => {
    if(pushThat !== undefined){
      if(isArr){
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
    if (temporaryList.length > 0) {
      let previosAnswers = temporaryList.pop();
      this.setState({ answers: previosAnswers, listWithPreviosAnswers: temporaryList });
    } else {
      this.setState( {changed: true});
    }
  }
  
  getNumOrNull = (getFromThere) => {
    getFromThere = (getFromThere === "") ? null : getFromThere;
    return getFromThere;
  }

  //react lifecycle methods
  static getDerivedStateFromProps(props, state) {
    if (state.changed){
      return { answers: state.setNewFields(props.post), changed:false }
    } return null;
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

        {/* <ToggleFields /> */}

        <Question question={questions.PLACE} />
        
        <MapContainer 
        handleAnswer={(place) => this.handleAnswerPlace(place)}
        placesList = {this.props.placesList}
        />

          <TextArea
            question={questions.PLACE}
            handleTextInput={(e) => this.handleAnswer("place", e)} // ---> handleAnswerPlace ???
            value={answers.place}
          />
          <TextArea
            question={questions.TITLE}
            handleTextInput={(e) => this.handleAnswerArray('labels', e.target.value)}
            value={answers.labels[answers.labels.length - 1]}
          />

          <ImgUploader
            question={questions.PRE_IMG}
            handleImgLoad={(newImg) => this.handleAnswerArray('question_images', newImg)}
            answer={answers.question_images[answers.question_images.length - 1]} // to remember image 
          />

          <ImgUploader
            question={questions.POST_IMG}
            handleImgLoad={(newImg) => this.handleAnswerArray('story_images', newImg)}
            answer={answers.story_images[answers.story_images.length - 1]} // to remember image 
          />

          <Radio
            question={questions.DIFFICULTY}
            handleOptionChange={(e) => this.handleAnswer('difficulty', e)}
            answer={ getNumOrNull(answers.difficulty) }
          />
          <Radio
            question={questions.PLACE_REL}
            handleOptionChange={(e) => this.handleAnswer('place_relevancy', e)}
            answer={ getNumOrNull(answers.place_relevancy) }
          />
          <Radio
            question={questions.INTERESTING}
            handleOptionChange={(e) => this.handleAnswer('score', e)}
            answer={ getNumOrNull(answers.score) }
          />
          <Radio
            question={questions.TOURISTS_REL}
            handleOptionChange={(e) => this.handleAnswer('tourists_relevancy', e)}
            answer={ getNumOrNull(answers.tourists_relevancy) }
          />

          <TextArea
            question={questions.EDIT_TEXT}
            handleTextInput={(e) => this.handleAnswer('story', e)}
            value={answers.story}
            rows= {'10'}
          />

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
          <TriviaQuestion
            question={questions.TRIVIA2}
            tooltip={'answer is..'}
            numbers={['question', 'right_answer', 'wrong_answer1', 'wrong_answer2', 'wrong_answer3']} 
            handleTextInput={(e, number) => this.handleAnswerTrivia(2, number, e)}
            value1={answers.trivia2.question}
            value2={answers.trivia2.right_answer}
            value3={answers.trivia2.wrong_answer1}
            value4={answers.trivia2.wrong_answer2}
            value5={answers.trivia2.wrong_answer3}
          />

          <TextArea
            question={questions.NOTES}
            handleTextInput={(e) => this.handleAnswer('notes', e)}
            value={answers.notes}
            rows= {'5'}
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
