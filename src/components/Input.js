import React from 'react';
import Question from './Question';
import './Input.css';

const Input = ({question, tooltip='', handleTextInput}) => {
    return (
        <div> 
            <Question question={question} tooltip={tooltip}/>
            <div className='ui small input'>
                <input type="text" onChange={handleTextInput} 
                placeholder='Type your answer' required 
                id='input'/>   
            </div>
        </div>
    )
}

export default Input;