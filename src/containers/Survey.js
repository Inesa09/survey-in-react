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
        'תקציר התוכן',
        '#1 שאלת טריוויה',
        '#2 שאלת טריוויה',
        'הערות'],
      answers: {},
      listWithPreviosAnswers:[],
      changed: false,
    }; // <- set up react state
  }

  //Save answer in the state
  handleAnswer = (question, e) => {
    let copy = this.state.answers;
    copy[question] = e.target.value;
    this.setState({ answers: copy });
  }

  //Submit
  addAnswers = (e, post) => {
    const { answers } = this.state;
    const { nextElementExistanse, showNext, toUndef, place, showEl } = this.props;

    e.preventDefault(); // <- prevent form submit from reloading the page
    if(answers['4'] === undefined) // <- mandatory question
      showEl('negative', 250000000, false);
    else {
      let temporaryList = this.state.listWithPreviosAnswers; 
      temporaryList.push(answers);
      this.setState({ listWithPreviosAnswers: temporaryList }); // <- save previous answers

      document.getElementById("form").reset(); // <- clear the input
      if (nextElementExistanse) // <- use methods from App.js
        showNext(post, e);
      else {
        toUndef(post, e);
      }

      let db = fireDB.database();
      let copy = this.state.answers;

      if(answers['1'] !== place){ // <- add a new post if place has been changed
        let textsRef = db.ref('newData/');
        let all;
        textsRef.on('value', snapshot => {
          all = snapshot.val();
        });

        let newPost = all.length;
        textsRef.child(newPost).set(all[post]);
        post = newPost;
        copy['18'] = '';
      }

      let postRef = db.ref(`newData/${post}`);
      copy['22'] = new Date().toLocaleString("en-US");

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

  
  //react lifecycle methods
  componentDidMount = () => {
    const { text, place, user } = this.props;
    this.setState({ answers: {'1': place, '3': user, '6': text} }); //<- set user email, place and text of post
  }

  static getDerivedStateFromProps(props, state) {
    if (state.changed){
      const { text, place, user } = props
      return {answers: { '1': place, '3': user, '6': text }, changed: false};
    }
    return null;
  }

  render() {
    const { questions, answers } = this.state;
    const { post, numberOfPreviousElemnts, submitted } = this.props;

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
          <TextArea
            question={questions[3]}
            handleTextInput={(e) => this.handleAnswer(6, e)}
            value={answers['6']}
            rows= {'10'}
          />

          <TriviaQuestion
            question={questions[4]}
            tooltip={'answer is..'}
            numbers={[7, 8, 9, 10, 11]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['7']}
            value2={answers['8']}
            value3={answers['9']}
            value4={answers['10']}
            value5={answers['11']}
          />

          <TriviaQuestion
            question={questions[5]}
            tooltip={'answer is..'}
            numbers={[12, 13, 14, 15, 16]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['12']}
            value2={answers['13']}
            value3={answers['14']}
            value4={answers['15']}
            value5={answers['16']}
          />

          <TextArea
            question={questions[6]}
            handleTextInput={(e) => this.handleAnswer(17, e)}
            value={answers['17']}
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
              onClick={(e) => { this.addAnswers(e, post) }}>
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
