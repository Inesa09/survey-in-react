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
      },
      answers: {},
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

  //Save image in the state
  handleImgLoad = (question, img) => {
    let copy = this.state.answers;
    copy[question] = img;
    this.setState({ answers: copy });
  }

    // ---> 1. NEW DB <---
  //Submit
  addAnswers = (e, postNum) => {
    const { answers } = this.state;
    const { nextElementExistanse, showNext, toUndef, post, showEl } = this.props;
    const { PLACE, MANDATORY, LOCATION, DATE } = this.state.constants;

    e.preventDefault(); // <- prevent form submit from reloading the page
    if(answers[ MANDATORY ].length === 0) // <- mandatory question
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

      let db = fireDB.database();
      let copy = this.state.answers;

      if(answers[ PLACE ] !== post[ PLACE ]){ // <- add a new post if place has been changed
        let textsRef = db.ref(this.state.table);
        let all;
        textsRef.on('value', snapshot => {
          all = snapshot.val();
        });

        let newPost = all.length;
        textsRef.child(newPost).set(all[postNum]);
        postNum = newPost;
        copy[ LOCATION ] = '';
      }

      let postRef = db.ref(this.state.table + `${postNum}`);
      copy[ DATE ] = new Date().toLocaleString("en-US");

      postRef.update(copy); // <- send to db
      showEl('success', 1000, true);
      this.setState( {changed: true});
    }
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
    this.setState( this.state.getCurrentAnswers(post, user, false) );
  }

  static getDerivedStateFromProps(props, state) {
    if (state.changed){
      const { post, user } = props
      return state.getCurrentAnswers(post, user, true);
    } return null;
  }

  render() {
    const { questions, answers } = this.state;
    const { postNum, numberOfPreviousElemnts, submitted } = this.props;

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
            handleTextInput={(e) => this.handleAnswer(1, e)}
            value={answers['1']}
            rows= {'1'}
          />
          <TextArea
            question={questions.TITLE}
            handleTextInput={(e) => this.handleAnswer(4, e)}
            value={answers['4']}
            rows= {'1'}
          />

          <ImgUploader
            tooltip={questions.PRE_IMG}
            handleImgLoad={(newImg) => this.handleImgLoad(5, newImg)}
            answer={answers['5']} // to remember image 
          />
          <ImgUploader
            tooltip={questions.POST_IMG}
            handleImgLoad={(newImg) => this.handleImgLoad(6, newImg)}
            answer={answers['6']} // to remember image 
          />

          <Radio
            question={questions.DIFFICULTY}
            handleOptionChange={(e) => this.handleAnswer(7, e)}
            answer={answers['7']}
          />
          <Radio
            question={questions.PLACE_REL}
            handleOptionChange={(e) => this.handleAnswer(8, e)}
            answer={answers['8']}
          />
          <Radio
            question={questions.INTERESTING}
            handleOptionChange={(e) => this.handleAnswer(9, e)}
            answer={answers['9']}
          />
          <Radio
            question={questions.TOURIST_REL}
            handleOptionChange={(e) => this.handleAnswer(10, e)}
            answer={answers['10']}
          />

          <TextArea
            question={questions.EDIT_TEXT}
            handleTextInput={(e) => this.handleAnswer(11, e)}
            value={answers['11']}
            rows= {'10'}
          />

          <TriviaQuestion
            question={questions.TRIVIA1}
            tooltip={'answer is..'}
            numbers={[12, 13, 14, 15, 16]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['12']}
            value2={answers['13']}
            value3={answers['14']}
            value4={answers['15']}
            value5={answers['16']}
          />
          <TriviaQuestion
            question={questions.TRIVIA2}
            tooltip={'answer is..'}
            numbers={[17, 18, 19, 20, 21]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['17']}
            value2={answers['18']}
            value3={answers['19']}
            value4={answers['20']}
            value5={answers['21']}
          />

          <TextArea
            question={questions.NOTES}
            handleTextInput={(e) => this.handleAnswer(22, e)}
            value={answers['22']}
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
