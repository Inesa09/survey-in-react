import React from 'react';
import Question from './Question';
import './Input.css';

const TriviaQuestion = ({question, tooltip='', handleTextInput, value='', rows='1'}) => {

    return (
        <div style={{marginTop: '20px', marginLeft: '35px'}}> 
            <Question question={question} tooltip={tooltip}/>
            <Input
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
            <RadioWithInput
                question={questions[5]}
                answer={'Default'}
                tooltip={'answer is..'}
                handleAnswer={(e) => this.handleAnswer(5, e)}
                value={answers['7']}
            />
        </div>
    )
   
}

export default TriviaQuestion;