import React, { Component } from 'react';
import Text from '../components/Text';
import Top from '../components/Top';
import Survey from './Survey';
import fireDB from '../fireDB';
import Heading from '../components/Heading';
import Message from '../components/Message';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: 0,
      text: [],
      previosIndexList: [],
    }; // <- set up react state
  }

  showPrev = (e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    if (temporaryList.length > 0) {
      let previosElement = temporaryList.pop();
      this.setState({ post: previosElement, previosIndexList: temporaryList });
      this.scrollToTop();
    }
  }

  showNext = (post, e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    let number = this.findNextUnsubmitedElement(post);
    if (number !== undefined) {
      temporaryList.push(post);
      this.setState({ post: number, previosIndexList: temporaryList });
      this.scrollToTop();
    }
  }

  scrollToTop = () => {
    try {
      document.getElementById('top').scrollIntoView(true);
    } catch (err) { }
  }

  toUndef = (post, e) => {
    e.preventDefault();
    let temporaryList = this.state.previosIndexList;
    temporaryList.push(post);
    this.setState({ post: undefined, previosIndexList: temporaryList });
  }

  findNextUnsubmitedElement = (post) => {
    for (let i = post + 1, size = Object.values(this.state.text).length; i < size; i++) {
      if (this.state.text[i][21].length === 0) {
        return i;
      }
    }
  }

  componentDidMount() {
    fireDB.database().ref('masterSheet/').on('value', snapshot => {
      this.setState({ text: snapshot.val() });
    });
  }

  render() {
    const { post, text, previosIndexList } = this.state;
    let number = this.findNextUnsubmitedElement(post);
    if (post !== 0) {
      number = post;
    }
    let isNextElementExist = this.findNextUnsubmitedElement(number) !== undefined;
  
    if (text.length === 0)  //Loading
      return (
        <Top>
          <Message color='teal' icon='circle notched loading icon'
            text1='רק שניה' text2='מביאים לכם את התוכן' />
        </Top>
      )
    else if (post === undefined || (post === 0 && number === undefined)) //All text submitted
      return (
        <Top>
          <Message color='green' icon='check icon'
            text1='מצטערים' text2='כל הפוסטים כבר נבדקו' />
          <Survey 
            showPrev={this.showPrev} 
            numberOfPreviousElemnts={previosIndexList.length}
            submitted={true}
             />
        </Top>
      )
    else if (number !== undefined && text.length !== 0) //Main
      return (
        <Top>
          <Heading heading={`תוכן - בהקשר ל ${text[number][1]}`} />
          <Text text={text[number][2]} heading={text[number][1]} />
          <Heading heading={"שדות למילוי"} />
          <Survey post={number}
            showPrev={this.showPrev} showNext={this.showNext}
            numberOfPreviousElemnts={previosIndexList.length}
            nextElementExistanse={isNextElementExist}
            toUndef={this.toUndef}
            text={text[number][2]}
            submitted={false}
             />
        </Top>
      )
  }
}

export default App;
