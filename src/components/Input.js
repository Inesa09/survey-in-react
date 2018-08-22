import React from 'react';

const Input = ({question, tooltip='', handleTextInput}) => {
    return (
        <div> 
            <h1> {question} </h1>
            <p> {tooltip} </p>
            <input type="text" onChange={handleTextInput} required />
        </div>
    )
}

export default Input;