import React from 'react';
import Question from './Question';
import './TextArea.css';

const TextArea = ({question, tooltip='', handleTextInput, value='', rows='1'}) => {

    return (
        <div> 
            <Question question={question} tooltip={tooltip}/>
            <div className='field'>
                <textarea onChange={handleTextInput} value={value}
                placeholder='Type your notes...' id='textArea' rows={rows} required />   
            </div>
        </div>
    )
   
}

export default TextArea;