import React from 'react';
import RadioBtn from './RadioBtn';
import Question from './Question';
import './Input.css'

const RadioWithInput = ({question, tooltip='', answer, handleAnswer}) => {

    return (
        <div>
            <Question question={question} tooltip={tooltip}/>
            <div style={{marginTop: '20px', marginLeft: '35px'}}>
                <RadioBtn
                    value={answer}
                    onChange={handleAnswer}
                    question={question}
                    answer={answer}
                />
                <div style={{display: 'flex', marginTop:'20px'}}>
                    <label className="container">
                        <input type="radio" 
                        name={question} 
                        id="radio"
                        required />
                        <span className="checkmark"></span>
                        Other:
                    </label>
                    <div className='ui small input'
                        style={{
                        marginLeft: '20px',
                        marginTop: '-20px',
                    }}> 
                        <input type="text" 
                        name={question} 
                        onChange={handleAnswer} 
                        placeholder='Type your answer'
                        id='input'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RadioWithInput;