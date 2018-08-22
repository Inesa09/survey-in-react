import React from 'react';
import './RadioBtn.css';

const RadioBtn = ({value, onChange, question, answer=''}) => {

    return (
        <label className="container">
            <input type="radio" 
            name={question}
            value={value}
            onChange={onChange} 
            required />
            <span className="checkmark"></span>
            {answer}
        </label>
    )
}

export default RadioBtn;