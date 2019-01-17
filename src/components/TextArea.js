import React from 'react';
import Question from './Question';
import '../css/TextArea.css';

const TextArea = ({question = '', handleTextInput, value='', rows='1', margin = '0px'}) => {

    return (
        <div style={{  marginTop: margin }}> 
            <Question question={question}/>
            <div className='field'>
                <textarea onChange={handleTextInput} value={value}
                placeholder='הכנס הערות' id='textArea' rows={rows} />   
            </div>
        </div>
    )
   
}

export default TextArea;