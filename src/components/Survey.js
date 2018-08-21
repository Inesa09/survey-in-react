import React, { Component } from 'react';
import fireDB from '../fireDB';
import Heading from './Heading';
import RadioQuestion from './RadioQuestion';

class Survey extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            messages: [],
        }; // <- set up react state
    }

    componentWillMount() {
        /* Create reference to messages in Firebase Database */
        let messagesRef = fireDB.database().ref('masterSheet').orderByKey().limitToLast(100);
        messagesRef.on('child_added', snapshot => {
            /* Update React state when message is added at Firebase Database */
            let message = { text: snapshot.val(), id: snapshot.key };
            this.setState({ messages: [message].concat(this.state.messages) });
        })
    }

    handleOptionChange = (question, e) => {
        this.state[question] = e.target.value;
        // this.setState({[question]: e.target.value});
        console.log(this.state);
    }

    handleTextInput = (question, text) => {
        this.state[question] = text;
        console.log(this.state);
    }

    addMessage = (e) => {
        e.preventDefault(); // <- prevent form submit from reloading the page
        /* Send the message to Firebase */
        fireDB.database().ref('masterSheet').push(this.inputEl.value);
        this.inputEl.value = ''; // <- clear the input
    }

    render() {
        const questions = ['q1', 'q2', 'q3'];

        return (
            <div className="Survey">
                <Heading heading={"Post Review (Your input)"} />
                <form onSubmit={this.addMessage}>
                    <RadioQuestion 
                    question={questions[0]} 
                    handleOptionChange={(e) => this.handleOptionChange(questions[0], e)} />
                    <RadioQuestion 
                    question={questions[1]} 
                    handleOptionChange={(e) => this.handleOptionChange(questions[1], e)} />
                    
                    {/* <Input 
                    question={questions[2]}
                    onInput={(text) => this.handleTextInput(questions[2], text)}
                    /> */}
                    <input type="text" ref={el => this.inputEl = el} />
                    <input type="submit" />
                    <ul>
                        { /* Render the list of messages */
                            this.state.messages.map(message => <li key={message.id}>{message.text}</li>)
                        }
                    </ul>

                </form>
            </div>
        )
    }
}

export default Survey;
