import React, { Component } from 'react';
import fireDB from '../fireDB';
import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import TriviaQuestion from '../components/TriviaQuestion';
import '../css/Button.css';

class Survey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: ['מיקום קשור',
        'עד כמה התוכן רלוונטי למקום?',
        'עד כמה התוכן מעניין?',
        'כמה רלוונטי לתיירים',
        'תקציר התוכן',
        '#1 שאלת טריוויה',
        '#2 שאלת טריוויה',
        'הערות'],
      constants: {
        FIRST: 1,
        PLACE: 1,
        TEXT: 2,
        USER: 3,
        MANDATORY: 4,
        SUMMARY: 7,
        LAST: 18,
        LOCATION: 19,
        DATE: 23,
      },
      answers: {},
      listWithPreviosAnswers:[],
      changed: false,
      getCurrentAnswers: this.getCurrentAnswers.bind(this),
      // table: 'newData/',
      table: 'version3/', // --> Developer's DB <--
    }; // <- set up react state
  }

  //Save answer in the state
  handleAnswer = (question, e) => {
    let copy = this.state.answers;
    copy[question] = e.target.value;
    this.setState({ answers: copy });
  }

  //Submit
  addAnswers = (e, postNum) => {
    const { answers } = this.state;
    const { nextElementExistanse, showNext, toUndef, post, showEl } = this.props;
    const { PLACE, MANDATORY, LOCATION, DATE } = this.state.constants;

    e.preventDefault(); // <- prevent form submit from reloading the page
    if(answers[ MANDATORY ] === "") // <- mandatory question
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
            question={questions[0]}
            handleTextInput={(e) => this.handleAnswer(1, e)}
            value={answers['1']}
            rows= {'1'}
          />

          <Radio
            question={questions[1]}
            handleOptionChange={(e) => this.handleAnswer(4, e)}
            answer={answers['4']}
          />
          <Radio
            question={questions[2]}
            handleOptionChange={(e) => this.handleAnswer(5, e)}
            answer={answers['5']}
          />
          <Radio
            question={questions[3]}
            handleOptionChange={(e) => this.handleAnswer(6, e)}
            answer={answers['6']}
          />
          <TextArea
            question={questions[4]}
            handleTextInput={(e) => this.handleAnswer(7, e)}
            value={answers['7']}
            rows= {'10'}
          />

          <TriviaQuestion
            question={questions[5]}
            tooltip={'answer is..'}
            numbers={[8, 9, 10, 11, 12]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['8']}
            value2={answers['9']}
            value3={answers['10']}
            value4={answers['11']}
            value5={answers['12']}
          />

          <TriviaQuestion
            question={questions[6]}
            tooltip={'answer is..'}
            numbers={[13, 14, 15, 16, 17]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['13']}
            value2={answers['14']}
            value3={answers['15']}
            value4={answers['16']}
            value5={answers['17']}
          />

          <TextArea
            question={questions[7]}
            handleTextInput={(e) => this.handleAnswer(18, e)}
            value={answers['18']}
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
