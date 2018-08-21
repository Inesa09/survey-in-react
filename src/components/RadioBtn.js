import React, { Component } from 'react';
// import './RadioBtn.css';

const RadioBtn = ({value, onChange, question}) => {

    return (
        <label className="container">{value}
            <input type="radio" 
            name={question}
            value={value}
            onChange={onChange} />
            <span className="checkmark"></span>
        </label>
    )
}

export default RadioBtn;