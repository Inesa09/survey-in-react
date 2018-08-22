import React from 'react';
import RadioBtn from './RadioBtn';

const Radio = ({question, handleOptionChange}) => {
    const btns = [];
    for (let i = 1; i<=5; i++){
        btns.push(
        <RadioBtn 
            key={i}
            value={i}
            onChange={handleOptionChange}
            question={question}
        />)
    }

    return (
        <div>
            <h1> {question} </h1>
            {btns} 
        </div>
    )
}

export default Radio;