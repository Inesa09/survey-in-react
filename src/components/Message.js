import React from 'react';

const Message = ({color, icon, text1, text2}) => {
    return (
        <div className={`ui icon ${color} massive message`} >
            <i aria-hidden='true' className={icon} />
            <div className='content'>
                <div className='header'>{text1}</div>
            {text2} </div>
        </div>
    )
}

export default Message;