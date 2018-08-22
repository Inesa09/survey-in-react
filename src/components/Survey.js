import React, { Component } from 'react';
import fireDB from '../fireDB';
import Heading from './Heading';
import Radio from './Radio';
import Input from './Input';
import RadioWithInput from './RadioWithInput';

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
                'q8'],
            addAnswers: this.addAnswers,
        }; // <- set up react state
    }

    componentWillMount() {

    }

    handleAnswer = (question, e) => {
        this.setState({[question]: e.target.value});
        console.log(this.state);
    }

    addAnswers = (e, post) => {
        e.preventDefault(); // <- prevent form submit from reloading the page

        const {questions} = this.state;
        let answers = {};
        for (let i = 1; i <= 8; i++) 
            answers[i+2] = this.state[questions[i]];

        /* Send the answers to Firebase */
        fireDB.database().ref(`masterSheet/${post}`).update(answers);
        document.getElementById("form").reset(); // <- clear the input
    }

    showPrev = (e, post) => {
        console.log("showPrev");
        this.state.addAnswers(e, post);
    }

    showNext = (e, post) => {
        console.log("showNext");
        this.state.addAnswers(e, post);

    }

    submit = (e, post) => {
        alert("submit");
        this.state.addAnswers(e, post);
    }

    render() {
        const {questions} = this.state;
        let post = 1;
        return (
            <div className="Survey">
                <Heading heading={"Post Review (Your input)"} />
                <form id='form'>
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

                    <button 
                        onClick={(e) => this.showPrev(e, post)} > Prev 
                    </button>
                    <button 
                        onClick={(e) => this.showNext(e, post)} > Next 
                    </button>
                    <button 
                        onClick={(e) => this.submit(e, post)}> Submit 
                    </button>
                </form>
            </div>
        )
    }
}

export default Survey;
