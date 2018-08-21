import React, { Component } from 'react';

const Input = ({question, tooltip='', onInput}) => {
    return (
        <div> 
            <h1> {question} </h1>
            <p> {tooltip} </p>
            <input type="text" ref={el => onInput(question, el)} />
        </div>
    )
}

export default Input;