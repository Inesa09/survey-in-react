import React from 'react';
import './RadioBtn.css';

const RadioBtn = ({value, question, answer='', onChange}) => {

    return (
        <label className="container">
            <input type="radio" 
            name={question}
            value={value}
            onClick={onChange} 
            required />
            <span className="checkmark"></span>
            {answer}
        </label>
    )
}

export default RadioBtn;