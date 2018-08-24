import React from 'react';
import './Input.css';

const Input = ({number, handleTextInput, placeholder='', value=''}) => {

    return (
        <div className='ui small input'>
            <input type="text" id='input' value={value}
            onChange={(e) => handleTextInput(number, e)} 
            placeholder={placeholder}  required />   
        </div>
    )
   
}

export default Input;