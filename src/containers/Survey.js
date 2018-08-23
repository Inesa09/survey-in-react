import React, { Component } from 'react';
import fireDB from '../fireDB';
import Heading from '../components/Heading';
import Radio from '../components/Radio';
import Input from '../components/Input';
import RadioWithInput from '../components/RadioWithInput';

import Flex from './Flex';

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
            answers: {},
            addAnswers: this.addAnswers,
        }; // <- set up react state
    }

    handleAnswer = (question, e) => {
        let copy = this.state.answers;
        copy[question+2] = e.target.value;
        this.setState({answers: copy});
    }

    //Submit
    addAnswers = (e, post) => {
        var size = Object.keys(this.state.answers).length;
        if( size !== 8)
            this.showEl('error');
        else {
            e.preventDefault(); // <- prevent form submit from reloading the page
            /* Send the answers to Firebase */
            fireDB.database().ref(`masterSheet/${post}`).update(this.state.answers);
            document.getElementById("form").reset(); // <- clear the input
            this.setState({answers: {}}); // <- clear the state
            this.showEl('success');
        }
    }

    //CSS methods
    showEl = (el) => {
        if (document.getElementById('error').style.display === 'none'){ //to avoid two messages when error in addMessage
            const current = document.getElementById(el);
            current.style.display = 'block';
            current.scrollIntoView(true);
            setTimeout(this.hideEl, 3000, el);
        }
    }

    hideEl = (el) => {
        const current = document.getElementById(el);
        current.style.display = 'none';
    }

    submitBtnHover = (color) => {
        const btn = document.getElementById('submitBtn');
        btn.style.backgroundColor = color;
    }

    render() {
        const {questions, answers} = this.state;
        const post = this.props.post;
        return (
            <div className="Survey">
                <Heading heading={"Post Review (Your input)"} />
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
                    />

                    <Input 
                    question={questions[4]}
                    tooltip={'answer is..'}
                    handleTextInput={(e) => this.handleAnswer(4, e)}
                    value={answers['6']}
                    />
                    <RadioWithInput 
                    question={questions[5]}
                    answer={'default'}
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
                    answer={'default'}
                    tooltip={'answer is..'}
                    handleAnswer={(e) => this.handleAnswer(7, e)}
                    value={answers['9']}
                    />

                    <Input 
                    question={questions[8]}
                    handleTextInput={(e) => this.handleAnswer(8, e)}
                    value={answers['10']}
                    />


                    <Flex>
                    <button className='ui big button' id='submitBtn'
                        style={{    
                            backgroundColor: 'rgb(109, 97, 136)',
                            color: 'white',
                            marginTop: '20px',
                        }}
                        onClick={(e) => this.addAnswers(e, post)}
                        onMouseOver={() => this.submitBtnHover('rgb(58, 46, 87)')}
                        onMouseOut={() => this.submitBtnHover('rgb(109, 97, 136)')}> 
                        Submit 
                    </button>
                    </Flex>

                    <Flex>
                        <button className='ui left animated violet basic button'
                            style={{margin: '30px'}}
                            onClick={() => this.props.showPrev(post)}>
                            <div className='visible content'> Previous Text</div>
                            <div className='hidden content'>
                                <i aria-hidden='true' className='arrow left icon' />
                            </div>
                        </button>
                        <button className='ui animated violet basic button'
                            style={{margin: '30px'}}
                            onClick={() => this.props.showNext(post)}>
                            <div className='visible content'>Next Text</div>
                            <div className='hidden content'>
                                <i aria-hidden='true' className='arrow right icon' />
                            </div>
                        </button>
                    </Flex>


                    <div className='ui success message' id='success'
                        style={{
                            margin: '40px',
                            marginTop: '0',
                            display: 'none',
                        }}>
                        <div className='content'>
                            <div className='header'>Form Completed</div>
                            <p>You have saved your answers.</p>
                        </div>
                    </div>
                    <div className='ui error message' id='error'
                        style={{
                            margin: '40px',
                            marginTop: '0',
                            display: 'none',
                        }}>
                        <div className='content'>
                            <div className='header'>Action Forbidden</div>
                            <p>You have to answer on all questions.</p>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Survey;
