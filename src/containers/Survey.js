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
    const { nextElementExistanse, showNext, toUndef, text, place } = this.props;

    e.preventDefault(); // <- prevent form submit from reloading the page
    if(answers['4'] == undefined)
      this.showEl('negative', 2500);
    else {
      let temporaryList = this.state.listWithPreviosAnswers;
      temporaryList.push(answers);
      this.setState({ listWithPreviosAnswers: temporaryList });

      document.getElementById("form").reset(); // <- clear the input
      if (nextElementExistanse)
        showNext(post, e);
      else {
        toUndef(post, e);
      }

      const size = Object.keys(answers).length;
      if (size > 3 || answers['6'] !== text || answers['1'] !== place){
        let copy = this.state.answers;
        copy['22'] = new Date().toLocaleString("en-US");
  
        let db = fireDB.database();
        let textsRef = db.ref('masterSheet/');
        let all;
  
        if(answers['1'] !== place){
          textsRef.on('value', snapshot => {
            all = snapshot.val();
          });
  
          let newPost = all.length;
          textsRef.child(newPost).set(all[post]);
          post = newPost;
        }
  
        let postRef = db.ref(`masterSheet/${post}`);
        postRef.update(copy); // <- send to db
        this.showEl('success', 1000);
        this.setState( {changed: true});
      }
    }
  }
  

  //Show previous answers
  showPrev = (e) => {
    e.preventDefault();
    this.props.showPrev(e);
    console.log("previous answers PREV");
    console.log(this.state.listWithPreviosAnswers);
    let temporaryList = this.state.listWithPreviosAnswers;
    if (temporaryList.length > 0) {
      let previosAnswers = temporaryList.pop();
      this.setState({ answers: previosAnswers, listWithPreviosAnswers: temporaryList });
    } else {
      this.setState( {changed: true});
    }
  }

  //CSS methods
  showEl = (el, time) => {
      const current = document.getElementById(el);
      if(current.style.display === 'none'){
        current.style.display = 'block';
        current.scrollIntoView(true);
        setTimeout(this.hideEl, time, el);
      }

  }
  hideEl = (el) => {
    try {
      document.getElementById(el).style.display = 'none';
      document.getElementById('top').scrollIntoView(true);
    } catch (err) {
    }
  }

  setStateofSummary = () => {
    this.setState({ answers: {'6': this.props.text, '1': this.props.place} });
  }
  
  componentDidMount = () => {
    this.setStateofSummary();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.changed){
      return {answers: { '6': props.text, '1': props.place }, changed: false};
    }
    return null;
  }

  render() {
//     for(let i=11; i<628; i++)
// fireDB.database().ref(`masterSheet/${i}`).remove(); // <- send to db
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
