import React from 'react';

const Question = ({question, tooltip=''}) =>{
    return (
        <div>
            <h1 style={{
                margin: '20px',
                padding: '15px',
                font: `1.7em 'Times'`
            }}> {question} </h1>
            <p style={{
                marginLeft: '40px',
                marginTop: '-30px',
                marginBottom: '5px',
                // marginTop: '-25px',
            }}> {tooltip} </p>
        </div>
    )
}

export default Question;