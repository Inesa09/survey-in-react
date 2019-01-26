import React, { Component } from 'react';

import gcp_config from '../GCP_configs';

import Radio from '../components/Radio';
import TextArea from '../components/TextArea';
import SmallMessage from '../components/SmallMessage';
import TriviaQuestion from '../components/TriviaQuestion';
import Question from '../components/Question';
import ImgUploader from './ImgUploader';
import MapContainer from '../components/MapContainer';
import Checkbox from '../components/Checkbox';

import '../css/Button.css';
import '../css/Hidden.css';
import '../css/Segment.css';

class NewForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      setNewFields: this.setNewFields.bind(this),
      answers: this.setNewFields(this.props.post),
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
      EDIT_TEXT: 'סיפור קצר משלים',
      TRIVIA1: 'שאלת טריוויה',
      TRIVIA2: '#2 שאלת טריוויה',
      TOURISTS_REL: 'כמה רלוונטי לתיירים',
      NIGHT_ITEM: "האם מתאים בחושך",
      SEE_ITEM: 'האם צריך לראות בזמן אמת',
    },
    constants: {
      numericFields: ['difficulty', 'score'],
      textFields: ['place', 'lon', 'lat', 'story'],
      arrayFields: ['labels', 'question_images', 'story_images'],
      checkFields: ['tourists_relevancy', 'night_item', 'see_item']
    },
  }

  setNewFields() {
    const { numericFields, textFields, arrayFields, checkFields } = this.props.constants;

    let copy = {};
    copy.editor_username = this.props.user;

    for (let i = 1; i < 3; i++) {
      copy = this.setTrivia(i, copy);
    }

    for (let i in numericFields)
      copy[numericFields[i]] = null;
    for (let i in textFields)
      copy[textFields[i]] = '';
    for (let i in arrayFields)
      copy[arrayFields[i]] = [];
    for (let i in checkFields)
      copy[checkFields[i]] = null;

    return copy;
  }

  setTrivia = (triviaNum, change) => {
    let trivia = this.getTriviaByNum(triviaNum);

    change[trivia] = {
      question: undefined,
      right_answer: undefined,
      wrong_answer1: undefined,
      wrong_answer2: undefined,
      wrong_answer3: undefined,
    }
    return change;
  }


  isEmpty = (data) => {
    const { numericFields, textFields, arrayFields, checkFields } = this.props.constants;

    for (let prop in data) {
      if (((numericFields.indexOf(prop) !== -1) || (checkFields.indexOf(prop) !== -1))
        && (data[prop] !== null))
        return false;
      else if ((textFields.indexOf(prop) !== -1) && (data[prop] !== ''))
        return false;
      else if ((arrayFields.indexOf(prop) !== -1) && (data[prop].length !== 0))
        return false;
    }

    for (let prop in data['trivia1']) {
      if (data.trivia1[prop] !== undefined)
        return false;
    }

    return true;
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
    copy[question][size] = element;
    this.setState({ answers: copy });
  }

  handleAnswerTrivia = (triviaNum, question, e) => {
    let copy = this.state.answers;
    let trivia = this.getTriviaByNum(triviaNum);
    copy[trivia][question] = e.target.value;
    this.setState({ answers: copy });
  }

  handleAnswerPlace = (currentPlace) => {
    let copy = this.state.answers;
    copy.place = currentPlace.place_name;
    copy.lon = currentPlace.lon;
    copy.lat = currentPlace.lat;
    this.setState({ answers: copy });
  }

  handleCheck = (question, e) => {
    let copy = this.state.answers;
    copy[question] = e.target.checked;
    this.setState({ answers: copy });
  }


  // ---> 1. GCP <---
  //Submit
  addAnswers = (e) => {
    const { answers, } = this.state;
    e.preventDefault(); // <- prevent form submit from reloading the page

    document.getElementById("form").reset(); // <- clear the input

    let copy = Object.assign({}, answers);
    this.processTrivias(copy);  // <- process trivias and send to db
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

  processCheck = (answers) => {
    for (let prop in answers) {
      if ((this.props.constants.checkFields.indexOf(prop) !== -1) && (answers[prop] === null))
        answers[prop] = false;
    }
    return answers;
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

    if (this.isEmpty(data)) {
      const id = 'negative';
      this.showEl(id, () => { 
        document.getElementById(id).style.display = 'none';
        document.getElementById("top").scrollIntoView(true);
      });
    } else {
      data = this.processCheck(data);

      let headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(gcp_config.username + ":" + gcp_config.password));
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      const toDB = JSON.stringify({ item: data });
      // console.log("SAVE NEW ITEM: ", toDB);

      fetch('https://roadio-master.appspot.com/v1/edit_item', {
        method: 'POST',
        headers: headers,
        body: toDB
      }).then(res => console.log('Status: ', res.status))
        .catch(error => console.error('Error: ', error));

      this.showEl('success', () => { this.props.setNew(false) });
    }
  }


  showEl = (id, func='') => {
    const current = document.getElementById(id);
    if (current.style.display === 'none') {
      current.style.display = 'block';
      current.scrollIntoView(true);
      setTimeout(func, 1000);
    }
  }
  
  getNumOrNull = (getFromThere) => {
    getFromThere = (getFromThere === "") ? null : getFromThere;
    return getFromThere;
  }

  render() {
    const { answers } = this.state;
    const { questions } = this.props;
    const getNumOrNull = this.getNumOrNull;

    console.log("NEW: ", answers);

    return (
      <div className="Survey">
        <form id='form'>

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0px 30px' }}>
            <Checkbox question={questions.TOURISTS_REL} checked={answers.tourists_relevancy}
              handleCheck={(e) => this.handleCheck('tourists_relevancy', e)} />

            <Checkbox question={questions.NIGHT_ITEM} checked={answers.night_item}
              handleCheck={(e) => this.handleCheck('night_item', e)} />

            <Checkbox question={questions.SEE_ITEM} checked={answers.see_item}
              handleCheck={(e) => this.handleCheck('see_item', e)} />
          </div>

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
            post={this.props.post}
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


          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}>
            <button className={'ui labeled icon violet basic button '}
              style={{ margin: '30px' }}
              onClick={() => { this.props.setNew(false) }}>
              <i className="arrow left icon"></i>
              Cancel
            </button>
            <button className='ui right labeled icon violet basic button'
              style={{ margin: '30px' }}
              onClick={(e) => { this.addAnswers(e) }}>
              Save
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


export default NewForm;