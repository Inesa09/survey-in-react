import React, { Component } from 'react';
import fireDB from '../fireDB';
import Heading from './Heading';
import Radio from './Radio';
import Input from './Input';
import RadioWithInput from './RadioWithInput';
import PrevBtn from '../components/PrevBtn';
import NextBtn from '../components/NextBtn';

class Survey extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            questions: ['empty',
            'q1',
            'q2',
            'q3',
            'q4',
            'q5',
            'q6',
            'q7',
            'q8']
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

    handleAnswer = (question, e) => {
        this.state[question] = e.target.value;
        // this.setState({[question]: e.target.value});
        console.log(this.state);
    }

    addAnswers = (e, state, post) => {
        e.preventDefault(); // <- prevent form submit from reloading the page
        /* Send the message to Firebase */
        const {questions} = this.state;
        fireDB.database().ref(`masterSheet/${post}`).update({
            '3': this.state[questions[1]],
            '4': this.state[questions[2]],
            '5': this.state[questions[3]],
            '6': this.state[questions[4]],
            '7': this.state[questions[5]],
            '8': this.state[questions[6]],
            '9': this.state[questions[7]],
            '10': this.state[questions[8]],
        });
        // this.inputEl.value = ''; // <- clear the input
    }

    render() {
        const {questions} = this.state;
        let post = 1;
        return (
            <div className="Survey">
                <Heading heading={"Post Review (Your input)"} />
                <form onSubmit={(e) => this.addAnswers(e, this.state, post)}>
                    <Radio
                    question={questions[1]} 
                    handleOptionChange={(e) => this.handleAnswer(questions[1], e)} />
                    <Radio
                    question={questions[2]} 
                    handleOptionChange={(e) => this.handleAnswer(questions[2], e)} />
                    <Input 
                    question={questions[3]}
                    handleTextInput={(e) => this.handleAnswer(questions[3], e)}
                    />

                    <Input 
                    question={questions[4]}
                    tooltip={'answer is..'}
                    handleTextInput={(e) => this.handleAnswer(questions[4], e)}
                    />
                    <RadioWithInput 
                    question={questions[5]}
                    answer={'default'}
                    tooltip={'answer is..'}
                    handleAnswer={(e) => this.handleAnswer(questions[5], e)}
                    />

                    <Input 
                    question={questions[6]}
                    tooltip={'answer is..'}
                    handleTextInput={(e) => this.handleAnswer(questions[6], e)}
                    />
                    <RadioWithInput 
                    question={questions[7]}
                    answer={'default'}
                    tooltip={'answer is..'}
                    handleAnswer={(e) => this.handleAnswer(questions[7], e)}
                    />

                    <Input 
                    question={questions[8]}
                    handleTextInput={(e) => this.handleAnswer(questions[8], e)}
                    />

                    {/* <input type="text" ref={el => this.inputEl = el} /> */}
                    <PrevBtn />
                    <NextBtn />
                    <input type="submit" />

                    <ul>
                        { /* Render the list of messages */
                            // this.state.messages.map(message => <li key={message.id}>{message.text}</li>)
                        }
                    </ul>

                </form>
            </div>
        )
    }
}

export default Survey;
