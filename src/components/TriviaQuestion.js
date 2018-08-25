import React from 'react';
import Question from './Question';
import './Input.css';
import Input from './Input';

const TriviaQuestion = ({numbers, question, tooltip='', handleTextInput, value1, value2, value3, value4, value5}) => {
    let inputs = [
        <Input key={1} number= {numbers[1]} handleTextInput={(e, number) => handleTextInput(number, e)} 
            placeholder='Type the correct answer...' value={value2}/>,
        <Input key={2 }number= {numbers[2]} handleTextInput={(e, number) => handleTextInput(number, e)} 
            placeholder='Type the wrong answer...' value={value3}/>,
        <Input key={3 }number= {numbers[3]} handleTextInput={(e, number) => handleTextInput(number, e)} 
            placeholder='Type the wrong answer...' value={value4}/>,
        <Input key={4} number= {numbers[4]} handleTextInput={(e, number) => handleTextInput(number, e)} 
            placeholder='Type the wrong answer...' value={value5}/>
    ];

    let text = [<div key={1}>תשובה נכונה:</div>, <div key={2}>תשובות לא נכונות:</div>];

    return (
        <div style={{marginTop: '20px'}}> 
            <Question question={question} tooltip={tooltip}/>
            <Input
                number= {numbers[0]} handleTextInput={(e, number) => handleTextInput(number, e)} 
                placeholder='Type the question...' value={value1}
            />
            <div style={{
                display:'flex', 
                justifyContent:'flex-end',
                marginTop: '20px',
                marginRight:'35px',
                marginLeft: '8px'
            }}>
                <div style={{
                    display:'flex', 
                    flexDirection: 'column', 
                    flexGrow: '1'
                }}> {inputs} </div>
                <div style={{
                    display:'flex', 
                    flexDirection: 'column', 
                    fontSize: '17px',
                    justifyContent:'space-between',
                    height: '65px',
                    marginTop: '15px',
                    marginLeft: '10px'
                }}> {text} </div>
            </div>
        </div>
    )
}

export default TriviaQuestion;