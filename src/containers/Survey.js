import React, { Component } from 'react';
import fireDB from '../fireDB';
import Heading from '../components/Heading';
import Radio from '../components/Radio';
import Input from '../components/Input';
import RadioWithInput from '../components/RadioWithInput';

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
            answers: [],
            addAnswers: this.addAnswers,
        }; // <- set up react state
    }

    componentWillMount() {

    }

    handleAnswer = (question, e) => {
        let copy = this.state.answers;
        copy[question] = e.target.value;
        this.setState({answers: copy});
    }

    addAnswers = (e, post) => {
        e.preventDefault(); // <- prevent form submit from reloading the page

        let answers = {};
        for (let i = 1; i <= 8; i++) 
            answers[i+2] = this.state.answers[i];

        /* Send the answers to Firebase */
        fireDB.database().ref(`masterSheet/${post}`).update(answers);
        document.getElementById("form").reset(); // <- clear the input
    }

    showPrev = (e, post) => {
        console.log("showPrev");
        this.state.addAnswers(e, post);
        this.props.showPrev(post);
    }

    showNext = (e, post) => {
        console.log("showNext");
        this.state.addAnswers(e, post);
        this.props.showNext(post);
    }

    submit = (e, post) => {
        alert("submit");
        this.state.addAnswers(e, post);
    }

    render() {
        const {questions} = this.state;
        const post = this.props.post;
        return (
            <div className="Survey">
                <Heading heading={"Post Review (Your input)"} />
                <form id='form'>
                    <Radio
                    question={questions[1]} 
                    handleOptionChange={(e) => this.handleAnswer(1, e)} />
                    <Radio
                    question={questions[2]} 
                    handleOptionChange={(e) => this.handleAnswer(2, e)} />
                    <Input 
                    question={questions[3]}
                    handleTextInput={(e) => this.handleAnswer(3, e)}
                    />

                    <Input 
                    question={questions[4]}
                    tooltip={'answer is..'}
                    handleTextInput={(e) => this.handleAnswer(4, e)}
                    />
                    <RadioWithInput 
                    question={questions[5]}
                    answer={'default'}
                    tooltip={'answer is..'}
                    handleAnswer={(e) => this.handleAnswer(5, e)}
                    />

                    <Input 
                    question={questions[6]}
                    tooltip={'answer is..'}
                    handleTextInput={(e) => this.handleAnswer(6, e)}
                    />
                    <RadioWithInput 
                    question={questions[7]}
                    answer={'default'}
                    tooltip={'answer is..'}
                    handleAnswer={(e) => this.handleAnswer(7, e)}
                    />

                    <Input 
                    question={questions[8]}
                    handleTextInput={(e) => this.handleAnswer(8, e)}
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
