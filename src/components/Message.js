import React from 'react';
import '../css/Hidden.css';

const Message = ({color, icon, text1, text2, className}) => {
    return (
        <div className={`ui icon ${color} massive message ${className}`} >
            <i aria-hidden='true' className={icon} />
            <div className='content'>
                <div className='header'>{text1}</div>
            {text2} </div>
        </div>
    )
}

export default Message;