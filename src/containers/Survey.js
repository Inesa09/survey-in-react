import React, { Component } from 'react';
import fireDB from '../fireDB';
import Radio from '../components/Radio';
import Input from '../components/Input';
import SmallMessage from '../components/SmallMessage';
import RadioWithInput from '../components/RadioWithInput';

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
      answers: {'5': "Summary"},
    }; // <- set up react state
  }

  handleAnswer = (question, e) => {
    let copy = this.state.answers;
    copy[question + 2] = e.target.value;
    this.setState({ answers: copy });
  }

  //Submit
  addAnswers = (e, post) => {
    const { answers } = this.state;
    const { nextElementExistanse, showNext, toUndef } = this.props;

    var size = Object.keys(answers).length;
    if (size !== 8)
      this.showEl('error');
    else {
      e.preventDefault(); // <- prevent form submit from reloading the page

      if (nextElementExistanse)
        showNext(post, e);
      else
        toUndef(post, e);

      fireDB.database().ref(`masterSheet/${post}`).update(answers);
      document.getElementById("form").reset(); // <- clear the input
      this.setState({ answers: {} }); // <- clear the state
      this.showEl('success');
    }
  }

  //CSS methods
  showEl = (el) => {
    if (document.getElementById('error').style.display === 'none') { //to avoid two messages when error in addMessage
      const current = document.getElementById(el);
      current.style.display = 'block';
      current.scrollIntoView(true);
      setTimeout(this.hideEl, 2000, el);
    }
  }

  hideEl = (el) => {
    try {
      document.getElementById(el).style.display = 'none';
    } catch (err) {
    }
  }

  submitBtnHover = (color) => {
    document.getElementById('submitBtn').style.backgroundColor = color;
  }

  render() {
    const { questions, answers } = this.state;
    const { post, numberOfPreviousElemnts, nextElementExistanse, showNext, showPrev } = this.props;
    return (
      <div className="Survey">
        <form id='form'>
          <Radio
            question={questions[1]}
            handleOptionChange={(e) => this.handleAnswer(1, e)}
          />
          <Radio
            question={questions[2]}
            handleOptionChange={(e) => this.handleAnswer(2, e)}
          />
          <Input
            question={questions[3]}
            handleTextInput={(e) => this.handleAnswer(3, e)}
            value={answers['5']}
            rows= {'10'}
          />

          {/* <TriviaQuestion
            question={questions[4]}
            answer={'Default'}
            tooltip={'answer is..'}
            handleAnswer={(e) => this.handleAnswer(5, e)}
            value={answers['7']}
          />

          <TriviaQuestion
            question={questions[5]}
            answer={'Default'}
            tooltip={'answer is..'}
            handleAnswer={(e) => this.handleAnswer(5, e)}
            value={answers['7']}
          /> */}

          {/* <Input
            question={questions[4]}
            tooltip={'answer is..'}
            handleTextInput={(e) => this.handleAnswer(4, e)}
            value={answers['6']}
          />
          <RadioWithInput
            question={questions[5]}
            answer={'Default'}
            tooltip={'answer is..'}
            handleAnswer={(e) => this.handleAnswer(5, e)}
            value={answers['7']}
          />

          <Input
            question={questions[6]}
            tooltip={'answer is..'}
            handleTextInput={(e) => this.handleAnswer(6, e)}
            value={answers['8']}
          />
          <RadioWithInput
            question={questions[7]}
            answer={'Default'}
            tooltip={'answer is..'}
            handleAnswer={(e) => this.handleAnswer(7, e)}
            value={answers['9']}
          /> */}

          <Input
            question={questions[6]}
            handleTextInput={(e) => this.handleAnswer(8, e)}
            value={answers['10']}
            rows= {'5'}
          />


          <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button className='ui big button' id='submitBtn'
              style={{
                backgroundColor: 'rgb(109, 97, 136)',
                color: 'white',
                marginTop: '20px',
              }}
              onClick={(e) => { this.addAnswers(e, post) }}
              onMouseOver={() => this.submitBtnHover('rgb(58, 46, 87)')}
              onMouseOut={() => this.submitBtnHover('rgb(109, 97, 136)')}>
              Submit
                        </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <button className={numberOfPreviousElemnts > 0 ?
              'ui left animated violet basic button' : 'ui grey basic button'}
              style={{ margin: '30px 50px' }}
              onClick={showPrev}>
              <div className='visible content'> Previous Text</div>
              <div className='hidden content'>
                <i aria-hidden='true'
                  className={numberOfPreviousElemnts > 0 ? 'arrow left icon' : ''} />
              </div>
            </button>
            <button className={nextElementExistanse ?
              'ui animated violet basic button' : 'ui grey basic button'}
              style={{ margin: '30px 50px' }}
              onClick={(e) => showNext(post, e)}>
              <div className='visible content'>Next Text</div>
              <div className='hidden content'>
                <i aria-hidden='true'
                  className={nextElementExistanse > 0 ? 'arrow right icon' : ''} />
              </div>
            </button>
          </div>


          <SmallMessage name='success' text1='Form Completed'
            text2='You have saved your answers.' />
          <SmallMessage name='error' text1='Action Forbidden'
            text2='You have to answer on all questions.' />
        </form>
      </div>
    )
  }
}

export default Survey;
