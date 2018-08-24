import React from 'react';
import RadioBtn from './RadioBtn';
import Question from './Question';

const Radio = ({question, tooltip= '', handleOptionChange}) => {
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
                />
            </div>)
    }

    return (
        <div>
            <Question question={question} tooltip={tooltip}/>
            <div style={{
                display:'flex', 
                flexDirection: 'row', 
                justifyContent: 'space-around',
                width: '60%',
                marginLeft: '20%',
                marginTop: '50px',
                marginBottom: '30px',
            }}> {btns} </div>
        </div>
    )
}

export default Radio;