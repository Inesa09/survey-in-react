import React from 'react';
import Question from './Question';
import './Input.css';

const Input = ({question, tooltip='', handleTextInput, value='', rows='1'}) => {

    return (
        <div> 
            <Question question={question} tooltip={tooltip}/>
            <div className='field'>
                <textarea onChange={handleTextInput} value={value}
                placeholder='Type your answer' id='input' rows={rows} required />   
            </div>
        </div>
    )
   
}

export default Input;