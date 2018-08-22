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
                'How relevant is the post to the place?',
                'How interesting is the post?',
                'Summary of the post',
                'Trivia Question About it #1',
                'Trivia Question About it #1',
                'Trivia Question About it #2',
                'Trivia Question About it #2',
                'Free Notes'],
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
        try {
            e.preventDefault(); // <- prevent form submit from reloading the page
            let answers = {};
            for (let i = 1; i <= 8; i++) 
                answers[i+2] = this.state.answers[i];
            /* Send the answers to Firebase */
            fireDB.database().ref(`masterSheet/${post}`).update(answers);
            document.getElementById("form").reset(); // <- clear the input
            this.setState({answers: []}); // <- clear the state
        } catch (err) {
            const el = document.getElementById('error');
            el.style.display = 'block';
        }
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
        this.state.addAnswers(e, post);
        const el = document.getElementById('success');
        el.style.display = 'block';
    }

    submitBtnHover = (color) => {
        const btn = document.getElementById('submitBtn');
        btn.style.backgroundColor = color;
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

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <button className='ui left animated violet basic button' role='button'
                            style={{margin: '30px'}}
                            onClick={(e) => this.showPrev(e, post)}>
                            <div className='visible content'> Previous Text</div>
                            <div className='hidden content'>
                                <i aria-hidden='true' className='arrow left icon' />
                            </div>
                        </button>
                        <button className='ui animated violet basic button' role='button'
                            style={{margin: '30px'}}
                            onClick={(e) => this.showNext(e, post)}>
                            <div className='visible content'>Next Text</div>
                            <div className='hidden content'>
                                <i aria-hidden='true' className='arrow right icon' />
                            </div>
                        </button>
                    </div>

                    <button className='ui big button' id='submitBtn'
                        style={{    
                            backgroundColor: 'rgb(109, 97, 136)',
                            color: 'white',
                            marginLeft: '285px',
                            marginBottom: '30px',
                            marginTop: '-10px',
                        }}
                        onClick={(e) => this.submit(e, post)}
                        onMouseOver={() => this.submitBtnHover('rgb(58, 46, 87)')}
                        onMouseOut={() => this.submitBtnHover('rgb(109, 97, 136)')}> 
                        Submit 
                    </button>

                    <div class='ui success message' id='success'
                        style={{
                            margin: '40px',
                            marginTop: '0',
                            display: 'none',
                        }}>
                        <div class='content'>
                            <div class='header'>Form Completed</div>
                            <p>You&#x27;re all signed up for the newsletter</p>
                        </div>
                    </div>
                    <div class='ui error message' id='error'
                        style={{
                            margin: '40px',
                            marginTop: '0',
                            display: 'none',
                        }}>
                        <div class='content'>
                            <div class='header'>Action Forbidden</div>
                            <p>You can only sign up for an account once with a given e-mail address.</p>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Survey;
