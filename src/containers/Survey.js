import React, { Component } from 'react';
import fireDB from '../fireDB';
import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import TriviaQuestion from '../components/TriviaQuestion';
import ImgUploader from './ImgUploader';
import '../css/Button.css';

class Survey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: {
        PLACE: 'מיקום קשור',
        TITLE: 'QUESTION TITLE',
        PRE_IMG: 'Pre Question Image',
        POST_IMG: 'Post Question Image',
        DIFFICULTY: 'Difficulty',
        PLACE_REL: 'עד כמה התוכן רלוונטי למקום?',
        INTERESTING: 'עד כמה התוכן מעניין?',
        TOURIST_REL: 'כמה רלוונטי לתיירים',
        EDIT_TEXT: 'תקציר התוכן',
        TRIVIA1: '#1 שאלת טריוויה',
        TRIVIA2: '#2 שאלת טריוויה',
        NOTES: 'הערות',
      },
      constants: {
        FIRST: 1,
        PLACE: 1,
        TEXT: 2,
        USER: 3,
        MANDATORY: 8,
        SUMMARY: 11,
        LAST: 22,
        LOCATION: 23,
        DATE: 27,

        QUESTION: 0, 
        RIGHT_ANS: 1, 
        WRONG_ANS1: 2, 
        WRONG_ANS2: 3, 
        WRONG_ANS3: 4,
      },
      answers: this.props.post,
      trivias: [ [null, null, null, null, null], [null, null, null, null, null] ],
      listWithPreviosAnswers:[],
      changed: false,
      getCurrentAnswers: this.getCurrentAnswers.bind(this),
      // table: 'newData/',
      table: 'version4/', // --> Developer's DB <--
    }; // <- set up react state
  }

  //Save answer in the state
  handleAnswer = (question, e) => {
    let copy = this.state.answers;
    copy[question] = e.target.value;
    this.setState({ answers: copy });
  }

  handleAnswerArray = (question, e) => {
    let copy = this.state.answers;
    copy[question].push(e.target.value);
    this.setState({ answers: copy });
  }

  //Save image in the state
  handleImgLoad = (question, img) => {
    let copy = this.state.answers;
    copy[question].push(img);
    this.setState({ answers: copy });
  }

    // ---> 1. GCP <---
  //Submit
  addAnswers = (e, postNum) => {
    const { answers } = this.state;
    const { nextElementExistanse, showNext, toUndef, post, showEl } = this.props;
    const { PLACE, MANDATORY, LOCATION, DATE } = this.state.constants;

    e.preventDefault(); // <- prevent form submit from reloading the page
    if(answers.place_relevancy.length === 0) // <- mandatory question
      showEl('negative', 250000000, false);
    else {
      let temporaryList = this.state.listWithPreviosAnswers; 
      temporaryList.push(answers);
      this.setState({ listWithPreviosAnswers: temporaryList }); // <- save previous answers

      document.getElementById("form").reset(); // <- clear the input
      if (nextElementExistanse) // <- use methods from App.js
        showNext(postNum, e);
      else {
        toUndef(postNum, e);
      }

      // let db = fireDB.database();
      let copy = this.state.answers;

      //TODO ---> WAIT FOR DIMA ---> lat & lon - STRINGS!

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

      // let postRef = db.ref(this.state.table + `${postNum}`);
      copy.submission_time = new Date().toLocaleString("en-US");

      // postRef.update(copy); // <- send to db
      this.processTrivias(copy);  // <- process trivias and send to db

      showEl('success', 1000, true);
      this.setState( {changed: true});
    }
  }

  processTrivias = (data) => {
    const trivias = this.state.trivias;
    const { QUESTION, RIGHT_ANS, WRONG_ANS1, WRONG_ANS2, WRONG_ANS3 } = this.state.constants;
    let sent = 0;

    for(let i=0; i < trivias.length; i++){
      for(let j=0; j < trivias[i].length; i++){
        if (trivias[i][j] !== null){
          let copy = data;
          sent++;
          if(sent === 1){
            delete copy.datastore_id;     // ---> new post
          }

          copy.question = trivias[i][QUESTION];
          copy.right_answer = trivias[i][RIGHT_ANS];
          copy.answers = [ trivias[i][RIGHT_ANS], trivias[i][WRONG_ANS1], trivias[i][WRONG_ANS2], trivias[i][WRONG_ANS3] ];

          this.updatePostInDB(copy);
          break;
        }
      }
    }

    if(sent === 0){
      this.updatePostInDB(data);
    }
  }

  updatePostInDB = (data) => {
    let username = 'shinom';
    let password = 'iloveToRide';

    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

     fetch('https://roadio-master.appspot.com/v1/edit_item', {
       method: 'POST',
       headers: headers,
       body: JSON.stringify(data)
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

  getCurrentAnswers (post, user, changed) {
    const { FIRST, LAST, SUMMARY, TEXT, USER } = this.state.constants;
    var currentAnswers = {};
    for (var x = FIRST; x <= LAST; x++)
      currentAnswers[x] = post[x]; //<- set previous answers
    if (post[ SUMMARY ] === "")
      currentAnswers[ SUMMARY ] = post[ TEXT ];
    currentAnswers[ USER ] = user;
    if(changed)
      return { answers: currentAnswers, changed: false }
    return { answers: currentAnswers }
  }
  
  //react lifecycle methods
  componentDidMount = () => {
    const { post, user } = this.props;
    // this.setState( this.state.getCurrentAnswers(post, user, false) ); ---> do we need?
  }

  static getDerivedStateFromProps(props, state) {
    if (state.changed){
      const { post, user } = props
      // return state.getCurrentAnswers(post, user, true); ---> do we need?
    } return null;
  }

  render() {
    const { questions, answers, trivias } = this.state;
    const { postNum, numberOfPreviousElemnts, submitted } = this.props;
    const { QUESTION, RIGHT_ANS, WRONG_ANS1, WRONG_ANS2, WRONG_ANS3 } = this.state.constants;

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
          <TextArea
            question={questions.PLACE}
            handleTextInput={(e) => this.handleAnswer("place", e)} // ---> handleAnswerPlace ???
            value={answers["place"]}
            rows= {'1'}
          />
          <TextArea
            question={questions.TITLE}
            handleTextInput={(e) => this.handleAnswerArray('labels', e)}
            value={answers['labels']}
            rows= {'1'}
          />

          <ImgUploader
            tooltip={questions.PRE_IMG}
            handleImgLoad={(newImg) => this.handleImgLoad('question_images', newImg)}
            answer={answers['question_images']} // to remember image 
          />
          <ImgUploader
            tooltip={questions.POST_IMG}
            handleImgLoad={(newImg) => this.handleImgLoad('story_images', newImg)}
            answer={answers['story_images']} // to remember image 
          />

          <Radio
            question={questions.DIFFICULTY}
            handleOptionChange={(e) => this.handleAnswer('difficulty', e)}
            answer={answers['difficulty']}
          />
          <Radio
            question={questions.PLACE_REL}
            handleOptionChange={(e) => this.handleAnswer('place_relevancy', e)}
            answer={answers['place_relevancy']}
          />
          <Radio
            question={questions.INTERESTING}
            handleOptionChange={(e) => this.handleAnswer('score', e)}
            answer={answers['score']}
          />
          <Radio
            question={questions.TOURIST_REL}
            handleOptionChange={(e) => this.handleAnswer('tourist_relevancy', e)}
            answer={answers['tourist_relevancy']}
          />

          <TextArea
            question={questions.EDIT_TEXT}
            handleTextInput={(e) => this.handleAnswer('story', e)}
            value={answers['story']}
            rows= {'10'}
          />

          <TriviaQuestion
            question={questions.TRIVIA1}
            tooltip={'answer is..'}
            numbers={[QUESTION, RIGHT_ANS, WRONG_ANS1, WRONG_ANS2, WRONG_ANS3]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={trivias[0][QUESTION]}
            value2={trivias[0][RIGHT_ANS]}
            value3={trivias[0][WRONG_ANS1]}
            value4={trivias[0][WRONG_ANS2]}
            value5={trivias[0][WRONG_ANS3]}
          />
          <TriviaQuestion
            question={questions.TRIVIA2}
            tooltip={'answer is..'}
            numbers={[QUESTION, RIGHT_ANS, WRONG_ANS1, WRONG_ANS2, WRONG_ANS3]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={trivias[1][QUESTION]}
            value2={trivias[1][RIGHT_ANS]}
            value3={trivias[1][WRONG_ANS1]}
            value4={trivias[1][WRONG_ANS2]}
            value5={trivias[1][WRONG_ANS3]}
          />

          <TextArea
            question={questions.NOTES}
            handleTextInput={(e) => this.handleAnswer('notes', e)}
            value={answers['notes']}
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
