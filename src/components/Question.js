import React from 'react';
import './Question.css';
const Question = ({question, tooltip=''}) =>{
    return (
        <div>
            <h1 className='h1Teg'> {question} </h1>
            <p className='pTeg'> {tooltip} </p>
        </div>
    )
}

export default Question;