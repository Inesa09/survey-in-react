import React, { Component } from 'react';
import fireDB from '../fireDB';
import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import RadioWithInput from '../components/RadioWithInput';
import TriviaQuestion from '../components/TriviaQuestion';

class Survey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: ['empty',
        'How relevant is the post to the place?',
        'How interesting is the post?',
        'Summary of the post',
        'Trivia Question About it #1',
        'Trivia Question About it #2',
        'Free Notes'],
      summary: 'Summary',
      answers: {},
    }; // <- set up react state
  }

  handleAnswer = (question, e) => {
    let copy = this.state.answers;
    copy[question] = e.target.value;
    this.setState({ answers: copy });
  }

  //Submit
  addAnswers = (e, post) => {
    const { answers, summary } = this.state;
    const { nextElementExistanse, showNext, toUndef } = this.props;

    var size = Object.keys(answers).length;
    if (size !== 14){
      document.getElementById("form").reset(); // <- clear the input
      this.setState({ answers: {'5': summary} }); // <- clear the state
      showNext(post, e);
    }
    else {
      e.preventDefault(); // <- prevent form submit from reloading the page

      if (nextElementExistanse)
        showNext(post, e);
      else
        toUndef(post, e);

      fireDB.database().ref(`masterSheet/${post}`).update(answers);
      document.getElementById("form").reset(); // <- clear the input
      this.setState({ answers: {'5': summary} }); // <- clear the state
      this.showEl('success');
    }
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
    this.setState({ answers: {'5': this.state.summary} });
  }

  render() {
    // for (let i=3; i<=629; i++)
    // fireDB.database().ref(`masterSheet/${i}`).remove();
    const { questions, answers } = this.state;
    const { post, numberOfPreviousElemnts, nextElementExistanse, showPrev } = this.props;

    return (
      <div className="Survey">
        <form id='form'>
          <Radio
            question={questions[1]}
            handleOptionChange={(e) => this.handleAnswer(3, e)}
          />
          <Radio
            question={questions[2]}
            handleOptionChange={(e) => this.handleAnswer(4, e)}
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
              onClick={showPrev}>
              <div className='visible content'> Previous Text</div>
              <div className='hidden content'>
                <i aria-hidden='true'
                  className={numberOfPreviousElemnts > 0 ? 'arrow left icon' : ''} />
              </div>
            </button>
            <button className='ui animated violet basic button'
              style={{ margin: '30px' }}
              onClick={(e) => { this.addAnswers(e, post) }}>
              <div className='visible content'>Next Text</div>
              <div className='hidden content'>
                <i aria-hidden='true' className='arrow right icon' />
              </div>
            </button>
          </div>


          <SmallMessage name='success' text1='Form Completed'
            text2='You have saved your answers.' />
        </form>
      </div>
    )
  }
}

export default Survey;
