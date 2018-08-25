import React from 'react';
import Question from './Question';
import './TextArea.css';

const TextArea = ({question, handleTextInput, value='', rows='1'}) => {

    return (
        <div> 
            <Question question={question}/>
            <div className='field'>
                <textarea onChange={handleTextInput} value={value}
                placeholder='הכנס הערות' id='textArea' rows={rows} required />   
            </div>
        </div>
    )
   
}

export default TextArea;