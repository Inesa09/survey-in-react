import React from 'react';
import RadioBtn from './RadioBtn';

const RadioWithInput = ({question, tooltip='', answer, handleAnswer}) => {

    return (
        <div>
            <h1> {question} </h1>
            <p> {tooltip} </p>
            <RadioBtn
                value={answer}
                onChange={handleAnswer}
                question={question}
            />
            <label className="container"> Other
                <input type="radio" 
                name={question} 
                id="radio"
                required />
                <span className="checkmark"></span>

                <input type="text" 
                name={question} 
                onChange={handleAnswer} 
                />
            </label>
        </div>
    )
}

export default RadioWithInput;