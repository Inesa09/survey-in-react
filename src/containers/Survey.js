import React, { Component } from 'react';
import fireDB from '../fireDB';
import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import TriviaQuestion from '../components/TriviaQuestion';

class Survey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: ['empty',
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
    const { nextElementExistanse, showNext, toUndef } = this.props;

    e.preventDefault(); // <- prevent form submit from reloading the page
    let temporaryList = this.state.listWithPreviosAnswers;
    temporaryList.push(answers);
    this.setState({ listWithPreviosAnswers: temporaryList });
    console.log("add aswers state ");
    console.log(this.state.answers);


    document.getElementById("form").reset(); // <- clear the input
    if (nextElementExistanse)
      showNext(post, e);
    else
      toUndef(post, e);

    var size = Object.keys(answers).length;
    if (size > 1){
      let copy = this.state.answers;
      copy['21'] = new Date().toLocaleString("en-US");
      fireDB.database().ref(`masterSheet/${post}`).update(copy); // <- send to db
      this.showEl('success');
    }
    this.setStateofSummary(); // <- clear the state
    this.setState( {changed: true});
  }

  //Show previous answers
  showPrev = (e) => {
    e.preventDefault();
    let temporaryList = this.state.listWithPreviosAnswers;
    console.log("show prev state ");
    console.log(this.state.listWithPreviosAnswers);
    if (temporaryList.length > 0) {
      let previosAnswers = temporaryList.pop();
      this.setState({ answers: previosAnswers, listWithPreviosAnswers: temporaryList });
    }
    this.props.showPrev(e);
    // this.setState( {changed: true});
  }

  setStateofSummary = () => {
    this.setState({ answers: {'5': this.props.text} });
  }

  //CSS methods
  showEl = (el) => {
      const current = document.getElementById(el);
      current.style.display = 'block';
      current.scrollIntoView(true);
      setTimeout(this.hideEl, 2000, el);

  }
  hideEl = (el) => {
    try {
      document.getElementById(el).style.display = 'none';
    } catch (err) {
    }
  }


  componentDidMount = () => {
    this.setStateofSummary();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.changed){
      console.log("before render");
      return {answers: { '5': props.text }, changed: false};
    }
    console.log("before render--not changed");
    console.log(state.answers);
    return null;
  }

  render() {
    // for(let i = 5; i<=629; i++)
    //   fireDB.database().ref(`masterSheet/${i}`).remove(); // <- send to db
    const { questions, answers } = this.state;
    const { post, numberOfPreviousElemnts, submitted } = this.props;

    // console.log(this.state.answers);
    return submitted ? 
      (<button className={numberOfPreviousElemnts > 0 ?
        'ui left animated violet basic massive button' : 'ui grey basic massive button'}
        style={{ margin: '30px 33%' }}
        onClick={this.showPrev}>
        <div className='visible content'> Previous Text</div>
        <div className='hidden content'>
          <i aria-hidden='true'
            className={numberOfPreviousElemnts > 0 ? 'arrow left icon' : ''} />
        </div>
      </button>)
    :
    (<div className="Survey">
        <form id='form'>
          <Radio
            question={questions[1]}
            handleOptionChange={(e) => this.handleAnswer(3, e)}
            answer={answers['3']}
          />
          <Radio
            question={questions[2]}
            handleOptionChange={(e) => this.handleAnswer(4, e)}
            answer={answers['4']}
          />
          <TextArea
            question={questions[3]}
            handleTextInput={(e) => this.handleAnswer(5, e)}
            value={answers['5']}
            rows= {'10'}
          />

          <TriviaQuestion
            question={questions[4]}
            tooltip={'answer is..'}
            numbers={[6, 7, 8, 9, 10]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['6']}
            value2={answers['7']}
            value3={answers['8']}
            value4={answers['9']}
            value5={answers['10']}
          />

          <TriviaQuestion
            question={questions[5]}
            tooltip={'answer is..'}
            numbers={[11, 12, 13, 14, 15]} 
            handleTextInput={(e, number) => this.handleAnswer(number, e)}
            value1={answers['11']}
            value2={answers['12']}
            value3={answers['13']}
            value4={answers['14']}
            value5={answers['15']}
          />

          <TextArea
            question={questions[6]}
            handleTextInput={(e) => this.handleAnswer(16, e)}
            value={answers['16']}
            rows= {'5'}
          />


          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}>
            <button className={numberOfPreviousElemnts > 0 ?
              'ui left animated violet basic button' : 'ui grey basic button'}
              style={{ margin: '30px' }}
              onClick={this.showPrev}>
              <div className='visible content'> הקודם</div>
              <div className='hidden content'>
                <i aria-hidden='true'
                  className={numberOfPreviousElemnts > 0 ? 'arrow left icon' : ''} />
              </div>
            </button>
            <button className='ui animated violet basic button'
              style={{ margin: '30px' }}
              onClick={(e) => { this.addAnswers(e, post) }}>
              <div className='visible content'>הבא</div>
              <div className='hidden content'>
                <i aria-hidden='true' className='arrow right icon' />
              </div>
            </button>
          </div>


          <SmallMessage name='success' text1='הטופס הושלם'
            text2='התשובות נשמרו' />
        </form>
      </div>)
  }
}

export default Survey;
