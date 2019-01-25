import React from 'react';
import RadioBtn from './RadioBtn';
import Question from './Question';

const Radio = ({question, handleOptionChange, answer}) => {
    let btns = [];
    for (let i = 5; i>=1; i--){
        btns.push(
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }} key={i}>
                <h3 style={{marginLeft: '6px'}}> {i} </h3>
                <RadioBtn 
                    value={i}
                    onChange={handleOptionChange}
                    question={question}
                    answer={answer}
                />
            </div>)
    }

    return (
        <div>
            <Question question={question}/>
            <div style={{
                display:'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-around',
                width: '60%',
                marginLeft: '20%',
                marginTop: '30px',
                marginBottom: '30px',
            }}> {btns} </div>
        </div>
    )
}

export default Radio;