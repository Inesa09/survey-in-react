import React from 'react';
import Question from './Question';
import './Input.css';

const BigInput = ({question, tooltip='', handleTextInput, value='', rows}) => {
    return (
        <div> 
            <Question question={question} tooltip={tooltip}/>
            <div className='ui small input'>
                <textarea type="text" onChange={handleTextInput} 
                placeholder='Type your answer' id='input' rows={rows} value={value} required />   
            </div>
        </div>
    )
}

export default BigInput;